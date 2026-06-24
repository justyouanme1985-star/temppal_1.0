import type { Metadata } from "next";
import "./globals.css";
import { Noto_Sans_KR } from "next/font/google";
import { Providers } from "@/lib/providers";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { defaultOpenGraph, getSiteUrl, SITE_NAME } from "@/lib/seo/site";

const noto = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: "프로게이머가 실제로 사용하는 마우스, 키보드, 모니터 등 장비 정보와 인기 랭킹",
  openGraph: {
    ...defaultOpenGraph,
    title: SITE_NAME,
    description: "프로게이머가 실제로 사용하는 장비 정보",
    url: getSiteUrl(),
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: "프로게이머가 실제로 사용하는 장비 정보",
  },
  alternates: {
    canonical: "/",
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
