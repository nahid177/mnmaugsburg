import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import I18nProvider from "../components/I18nProvider";
import ClientWrapper from "@/components/ClientWrapper";
import Footer from "@/components/Footer";

const geistSans = localFont({
  src: "./fonts/RobotoCondensed-Italic-VariableFont_wght.ttf",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/RobotoCondensed-Italic-VariableFont_wght.ttf",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "mnmaugsburg",
  description: "Generated mnmaugsburg",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <I18nProvider>
          <ClientWrapper>
            <main className="flex-grow">{children}</main>
            <Footer />
          </ClientWrapper>
        </I18nProvider>
      </body>
    </html>
  );
}
