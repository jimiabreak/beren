/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  // Required for embedded Sanity Studio
  transpilePackages: ['next-sanity'],
  async redirects() {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
    const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

    if (!projectId) return [];

    try {
      const query = encodeURIComponent(
        '*[_type == "redirect" && isActive == true]{ source, destination, permanent }',
      );
      const res = await fetch(
        `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`,
      );
      if (!res.ok) return [];
      const { result } = await res.json();
      return (result || []).map((r) => ({
        source: r.source,
        destination: r.destination,
        permanent: r.permanent ?? true,
      }));
    } catch {
      return [];
    }
  },
};

export default nextConfig;
