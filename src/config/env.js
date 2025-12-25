import dotenv from "dotenv";
dotenv.config();

function requiredEnv(key) {
    const v = process.env[key];
    if (!v) throw new Error(`Missing required evn: ${key}`);
    return v;
}

export const env = {
    NODE_ENV: process.env.NODE_ENV ?? "development",
    PORT: Number(process.env.PORT ?? 8000),
    CORS_ORIGIN: process.env.CORS_ORIGIN ?? "*",
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
};

if (Number.isNaN(env.PORT)) {
    throw new Error("PORT must be a number");
}

