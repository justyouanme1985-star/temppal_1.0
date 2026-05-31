import type { Metadata } from "next";
import "./globals.css";
import { Noto_Sans_KR } from "next/font/google";
import { Providers } from "@/lib/providers";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

const noto = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "템빨 - 프로들의 템",
  description: "프로들이 실제로 쓰는 장비",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${noto.variable}`} suppressHydrationWarning>
      <body className="h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white antialiased overflow-hidden">
        <Providers>
          <Header />
          <SearchBar />
          <div className="flex flex-1 min-h-0">
            <Sidebar />
            <div className="flex-1 min-w-0 flex flex-col overflow-y-auto">
              <div className="flex-1 flex justify-center">{children}</div>
              <Footer />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
