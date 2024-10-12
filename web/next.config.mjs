/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
        BASE_URI: process.env.BASE_URI,
        VERIFY_TOKEN: process.env.VERIFY_TOKEN,
        VEHICLE_SAVE: process.env.VEHICLE_SAVE,
        VEHICLE_STATUS_UPDATE: process.env.VEHICLE_STATUS_UPDATE,
        VEHICLE_FILTER: process.env.VEHICLE_FILTER,
        REGISTER: process.env.REGISTER,
        GENERATE_TOKEN: process.env.GENERATE_TOKEN,
        CHAT_RETRIEVE_CONVERSATIONS: process.env.CHAT_RETRIEVE_CONVERSATIONS,
        FETCH_USERS: process.env.FETCH_USERS,
        ADMIN_DEV_MODE: process.env.ADMIN_DEV_MODE
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'tailwindcss.com',
                port: '',
                pathname: '/img/**'
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**'
            }
        ]
    }
};

export default nextConfig;
