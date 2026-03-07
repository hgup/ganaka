import type { Metadata } from "next";
import './globals.css'

// TODO: Replace later when you are connected to better internet
// import {Inter } from "next/font/google";
// const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-sans'});

import localFont from "next/font/local";
import { ThemeProvider } from "@components/theme-provider";
import { cn } from "@lib/utils";
import { Toaster } from "@ui/sonner";
// const local_jetbrains_mono = localFont({
//   src: "../public/JetBrainsMono-VariableFont_wght.ttf",
// });
export const lexend = localFont({
  src: "../public/Lexend-VariableFont_wght.ttf",
  display: 'swap',
});
// const inter = Inter()

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
      <body className={cn(lexend.className, 'antialiased')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" offset={{top: '3.5rem'}} />
        </ThemeProvider>
      </body>
    </html>
  );
}
