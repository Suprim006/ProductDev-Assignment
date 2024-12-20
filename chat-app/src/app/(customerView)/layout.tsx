"use client"

import "./globals.css";
import Header from "@/components/(customerView)/Header";
import Footer from "@/components/(customerView)/Footer";
import ScrollToTop from "@/components/(customerView)/ScrollToTop";
import FloatingChatbot from "@/components/(customerView)/Chat/FloatingChatBot";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <div className="pt-16">
          {children}
        </div>
        <Footer />
        <ScrollToTop />
        <FloatingChatbot />
      </body>
    </html>
  );
}