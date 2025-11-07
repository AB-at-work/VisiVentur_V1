import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Session } from "next-auth";

import Navbar from "./Navbar";
import { track } from "@/lib/analytics";

jest.mock("@/components/Navbar/HelpModal", () => ({
  __esModule: true,
  default: ({ open }: { open: boolean }) =>
    open ? <div data-testid="help-modal">help-open</div> : null,
}));

jest.mock("@/lib/analytics", () => ({
  track: jest.fn(),
}));

describe("Navbar", () => {
  const originalFetch = global.fetch;
  const usePathnameMock = jest.requireMock("next/navigation").usePathname as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
    global.fetch = originalFetch;
    if (usePathnameMock) {
      usePathnameMock.mockReturnValue("/");
    }
  });

  it("renders guest view with authentication calls to action", async () => {
    render(<Navbar session={null} initialCurrency="USD" />);

    const currencyButton = await screen.findByRole("button", {
      name: /usd/i,
    });

    expect(currencyButton).toBeEnabled();
    expect(
      screen.getByRole("link", { name: /Sign Up — It’s free/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /help/i })).toBeInTheDocument();
  });

  it("renders profile menu for authenticated travellers", async () => {
    const session: Session = {
      user: {
        id: "user-123",
        name: "Ava Rivers",
        email: "ava@visiventur.com",
        isPremium: true,
        preferredCurrency: "EUR",
        unreadNotifications: 4,
      },
      expires: new Date().toISOString(),
    };

    render(<Navbar session={session} initialCurrency="EUR" />);

    expect(await screen.findByText("Ava Rivers")).toBeInTheDocument();
    expect(screen.getByText(/ava@visiventur.com/i)).toBeInTheDocument();
    expect(screen.queryByText(/Sign Up/i)).not.toBeInTheDocument();
  });

  it("persists currency selection and emits analytics", async () => {
    const session: Session = {
      user: {
        id: "user-999",
        name: "Noah",
        email: "noah@visiventur.com",
        preferredCurrency: "USD",
        isPremium: false,
        unreadNotifications: 0,
      },
      expires: new Date().toISOString(),
    };

    const fetchMock = jest.fn().mockResolvedValue({ ok: true, status: 204 });
    global.fetch = fetchMock as unknown as typeof fetch;

    const user = userEvent.setup();

    render(<Navbar session={session} initialCurrency="USD" />);

    const currencyButton = await screen.findByRole("button", { name: /usd/i });
    await user.click(currencyButton);

    const euroOption = await screen.findByRole("option", { name: /eur/i });
    await user.click(euroOption);

    await waitFor(() =>
      expect(window.localStorage.getItem("visiventur.currency")).toBe("EUR"),
    );

    await waitFor(() =>
      expect(track).toHaveBeenCalledWith("nav.currency_change", {
        currency: "EUR",
        gateway: "Stripe",
      }),
    );

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
  });
});
