import type { Meta, StoryObj } from "@storybook/react";
import type { Session } from "next-auth";

import Navbar from "@/components/Navbar";

const meta: Meta<typeof Navbar> = {
  title: "Navigation/Navbar",
  component: Navbar,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    initialCurrency: "USD",
  },
};

export default meta;

type Story = StoryObj<typeof Navbar>;

type SessionUser = NonNullable<Session["user"]>;

const createSession = (overrides?: Partial<SessionUser>): Session => ({
  user: {
    id: "story-user",
    name: "Atlas Cooper",
    email: "atlas@visiventur.com",
    preferredCurrency: "USD",
    unreadNotifications: 0,
    isPremium: false,
    ...overrides,
  } satisfies SessionUser,
  expires: new Date(Date.now() + 60 * 60 * 24 * 1000).toISOString(),
});

export const Guest: Story = {
  args: {
    session: null,
  },
};

export const SignedIn: Story = {
  args: {
    session: createSession({
      name: "Isla North",
      email: "isla@visiventur.com",
      preferredCurrency: "EUR",
      unreadNotifications: 1,
    }),
    initialCurrency: "EUR",
  },
};

export const Premium: Story = {
  args: {
    session: createSession({
      name: "Levi Meridian",
      email: "levi@visiventur.com",
      isPremium: true,
      unreadNotifications: 6,
      preferredCurrency: "GBP",
    }),
    initialCurrency: "GBP",
  },
};

export const DarkMode: Story = {
  args: {
    session: createSession({
      name: "Nova Rivers",
      email: "nova@visiventur.com",
    }),
    initialThemeMode: "dark",
  },
  parameters: {
    backgrounds: {
      default: "dark",
    },
  },
};

export const Mobile: Story = {
  args: {
    session: createSession({
      name: "Skye Finch",
    }),
  },
  parameters: {
    viewport: {
      defaultViewport: "iphone14pro",
    },
  },
};
