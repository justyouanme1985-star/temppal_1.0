import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      '@supabase/ssr',
      '@supabase/supabase-js',
      'lucide-react',
    ],
  },
};

// Only load bundle analyzer if explicitly requested
// This prevents build errors on Vercel where the package isn't installed
let exportConfig = nextConfig;

if (process.env.ANALYZE === 'true') {
  try {
    const withBundleAnalyzer = require('@next/bundle-analyzer');
    exportConfig = withBundleAnalyzer({ enabled: true })(nextConfig);
  } catch (e) {
    console.log('Bundle analyzer not installed, skipping...');
  }
}

export default exportConfig;