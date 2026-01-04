import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import  { env } from "./config/env.js"
import { notFoundMiddleware } from "./middlewares/notfound.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

import routes from "./routes/index.js";

export const app = express()

app.use(helmet());
app.use(
    cors({
        // origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN,
        origin: true,
        credentials: false,
    })
);

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

// app.use(morgan(env.NODE_ENV == "production" ? "combined" : "dev"));
app.use(morgan("combined"));

app.use("/api/v1", routes);

app.use(errorMiddleware);
app.use(notFoundMiddleware);