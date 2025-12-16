import { app } from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.PORT, () => {
    console.log(`[${env.NODE_ENV}] API running on https://localhost:${env.PORT}`);
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
process.on("SIGTERM", () => shutdown("SIGTERMN"));