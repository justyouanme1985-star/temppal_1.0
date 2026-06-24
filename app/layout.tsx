import type { Metadata } from "next";
import "./globals.css";
import { Noto_Sans_KR } from "next/font/google";
import { Providers } from "@/lib/providers";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { getSiteUrl } from "@/lib/site";

const noto = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "템빨 - 프로들의 템",
    template: "%s | 템빨",
  },
  description: "프로게이머가 실제로 사용하는 마우스, 키보드, 모니터 등 게이밍 장비 정보",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
  },
  openGraph: {
    siteName: "템빨",
    locale: "ko_KR",
    type: "website",
    title: "템빨 - 프로들의 템",
    description: "프로게이머가 실제로 사용하는 게이밍 장비",
    images: [{ url: "/images/banner.svg", alt: "템빨" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "템빨 - 프로들의 템",
    description: "프로게이머가 실제로 사용하는 게이밍 장비",
    images: ["/images/banner.svg"],
  },
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
            <div
              id="main-scroll"
              className="flex-1 min-w-0 flex flex-col overflow-y-auto"
            >
              <div className="flex-1 flex justify-center">{children}</div>
              <Footer />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
