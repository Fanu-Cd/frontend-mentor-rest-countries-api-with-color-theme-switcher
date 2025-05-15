import type { Metadata } from "next";
import "./globals.css";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

export const metadata: Metadata = {
  title: "Rest Countries Api With Color Theme Switcher",
  description: "Rest Countries Api With Color Theme Switcher",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}
