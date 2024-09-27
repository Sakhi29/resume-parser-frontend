/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/resume-builder",
        destination: "https://careerai-resume-builder.vercel.app",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
