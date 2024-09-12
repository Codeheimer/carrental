/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        BASE_URI: process.env.BASE_URI,
        VERIFY_TOKEN: process.env.VERIFY_TOKEN,
        VEHICLE_SAVE: process.env.VEHICLE_SAVE,
        VEHICLE_STATUS_UPDATE: process.env.VEHICLE_STATUS_UPDATE,
        VEHICLE_FILTER: process.env.VEHICLE_FILTER,
        REGISTER: process.env.REGISTER,
        GENERATE_TOKEN: process.env.GENERATE_TOKEN
    }
};

export default nextConfig;
