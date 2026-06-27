import type { Metadata } from "next";
import "./globals.css";
import { Noto_Sans_KR } from "next/font/google";
import { Providers } from "@/lib/providers";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import ScrollToTop from "@/components/ScrollToTop";
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
  description:
    "LoL, 스타크래프트, 발로란트, PUBG 프로 게이머 장비 추천. Faker, Chovy, Canyon, Keria, Ruler, 이영호, 김명운 등 현역 프로들이 실제로 쓰는 게이밍 마우스, 키보드, 헤드셋, 마우스패드 랭킹과 상세 스펙을 한곳에서 확인하세요.",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    siteName: "템빨",
    locale: "ko_KR",
    type: "website",
    title: "템빨 - 프로들의 템",
    description: "프로게이머가 실제로 사용하는 게이밍 장비",
    images: [{ url: "/images/banner.png", alt: "템빨" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "템빨 - 프로들의 템",
    description: "프로게이머가 실제로 사용하는 게이밍 장비",
    images: ["/images/banner.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${noto.variable}`} suppressHydrationWarning>
      <head>
      <meta name="naver-site-verification" content="b897b690310c8080611ac2a9060f654280dfe905" />
      </head>
      <body className="h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white antialiased overflow-hidden">
        <Providers>
          <Header />
          <SearchBar />
          <div className="flex flex-1 min-h-0">
            <Sidebar />
            <div
              id="main-scroll"
              className="flex-1 min-w-0 flex flex-col overflow-x-hidden overflow-y-auto"
            >
              <div className="flex-1 flex justify-center w-full">
                {children}
              </div>
              <Footer />
              <ScrollToTop />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
