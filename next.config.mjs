/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "s1.ticketm.net",
            },{
                protocol: "https",
                hostname: "images.universe.com",
            },
        ],
    },
};

export default nextConfig;
