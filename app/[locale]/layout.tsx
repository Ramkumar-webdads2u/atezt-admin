import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/providers/theme-provider";
import MountedProvider from "@/providers/mounted.provider";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

import { getLangDir } from "rtl-detect";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import DirectionProvider from "@/providers/direction-provider";

import QueryProvider from "@/providers/query-client.provider";
import AuthGuard from "@/services/authGuard";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ATEZT - Admin Panel",
  description: "ATEZT Admin Panel",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const messages = await getMessages();
  const direction = getLangDir(locale);

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body className={`${inter.className} nextcode-app`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <QueryProvider>
            <AuthGuard>
              <ThemeProvider>
                <DirectionProvider direction={direction}>
                  <MountedProvider>{children}</MountedProvider>
                </DirectionProvider>

                <SonnerToaster />
              </ThemeProvider>
            </AuthGuard>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
