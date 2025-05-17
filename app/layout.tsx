import type { Metadata } from "next";
import "@mantine/core/styles.css";
import "./globals.css";
import { MantineProvider } from "@mantine/core";
import ReactQueryProvider from "./contexts/react-query-provider";

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
        <ReactQueryProvider>
          <MantineProvider
            theme={{
              breakpoints: {
                sm: "640px",
                md: "768px",
                lg: "1024px",
                xl: "1280px",
                "2xl": "1536px",
              },
            }}
          >
            {children}
          </MantineProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
