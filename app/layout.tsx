import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import NextTopLoader from 'nextjs-toploader';
import { BottomTab } from "@/app/bottom-tab"
import { SettingsProvider } from '@/app/SettingsContext';  // Import the SettingsProvider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ACAB"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextTopLoader color="hsl(var(--foreground))" showSpinner={false} speed={100} crawlSpeed={10}/>
        <SettingsProvider>  {/* Wrap ThemeProvider with SettingsProvider */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <BottomTab />
          </ThemeProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}