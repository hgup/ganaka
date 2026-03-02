import type { Metadata } from "next";
import './globals.css'

// TODO: Replace later when you are connected to better internet
// import {JetBrains_Mono } from "next/font/google";
// const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-sans'});

import localFont from "next/font/local";
import { ThemeProvider } from "@components/theme-provider";
const local_jetbrains_mono = localFont({
  src: "../public/JetBrainsMono-VariableFont_wght.ttf",
});

export const metadata: Metadata = {
  title: "Bench",
  description: "A playground for testing and benchmarking the Ganaka backend with various datasets and configurations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={`${local_jetbrains_mono.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
