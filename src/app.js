import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import  { env } from "./config/env.js"
import { notFoundHandler } from "./middlewares/notfound.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

import { healthRouter } from "./routes/health.route.js"

export const app = express()

app.use(
    cors({
        origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.json({
    limit: "1mb"
}));

app.use(express.urlencoded({
    extended: true
}));

app.use(morgan(env.NODE_ENV == "production" ? "combined" : "dev"));

app.use("/health", healthRouter);

app.use(notFoundHandler);
app.use(errorMiddleware);