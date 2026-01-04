import { app } from "./app.js";
import { env } from "./config/env.js";

const port = process.env.PORT || env.PORT || 3000;

const server = app.listen(port, "0.0.0.0", () => {
    // console.log(`[${env.NODE_ENV}] API running on http://localhost:${env.PORT}`);
    console.log(`[${env.NODE_ENV}] API running on port ${port}`);
});

function shutdown(signal) {
    console.log(`\nReceived ${signal}. Shutting down...`);
    server.close(() => {
        console.log("HTTP server closed");
        process.exit(0);
    });

    setTimeout(() => {
        console.error("Force shutdown.");
        process.exit(1);   
    }, 10_000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));