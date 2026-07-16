import type { Metadata } from "next";
import { Inter, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner"
import { getUserFromCookie } from "@/lib/auth/session";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const sourceSerif = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });


export const metadata: Metadata = {
  title: "Learnova",
  description: "Learnova is a platform for learning and teaching."
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", inter.variable, sourceSerif.variable, jetbrainsMono.variable)}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  );
}