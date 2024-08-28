/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        BASE_URI : process.env.BASE_URI,
        VERIFY_TOKEN : process.env.VERIFY_TOKEN,
        VEHICLE_SAVE_API : process.env.VEHICLE_SAVE_API
    }
};

export default nextConfig;
