import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// import { notFoundMiddleware } from "./middlewares/notfound.middleware.js";
// import { errorMiddleware } from "./middlewares/error.middleware.js";

// import routes from "./routes/index.js";

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

app.get("/", (req, res) => {
  res.status(200).send("OK - Express is running on Azure");
});
app.get("/health", (req, res) => {
  res.status(200).json({
    ok: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    node: process.version,
  });
});
// app.use("/api/v1", routes);

// app.use(notFoundMiddleware);
// app.use(errorMiddleware);