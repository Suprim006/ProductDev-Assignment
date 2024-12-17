"use client";

import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/(customerView)/Header";
import Footer from "@/components/(customerView)/Footer";
import ScrollToTop from "@/components/(customerView)/ScrollToTop";
import FloatingChatbot from "@/components/(customerView)/Chat/FloatingChatBot"; // Import the new chatbot component

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Header />
          {children}
          <Footer />
          <ScrollToTop />
          <FloatingChatbot /> {/* Add the floating chatbot */}
      </body>
    </html>
  );
}