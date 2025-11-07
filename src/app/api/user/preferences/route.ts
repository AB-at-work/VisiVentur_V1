import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/options";
import type { CurrencyCode } from "@/types/currency";

const VALID_CURRENCIES: ReadonlySet<string> = new Set([
  "INR",
  "USD",
  "EUR",
  "GBP",
]);

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let data: unknown;

  try {
    data = await request.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const currency = (data as { currency?: string }).currency;

  if (!currency || !VALID_CURRENCIES.has(currency)) {
    return NextResponse.json({ error: "Unsupported currency" }, { status: 400 });
  }

  cookies().set({
    name: "visiventur_preferred_currency",
    value: currency as CurrencyCode,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return new NextResponse(null, { status: 204 });
}
