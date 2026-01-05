import { app } from "./app.js";
// import { env } from "./config/env.js";

const port = Number(process.env.PORT || 8080);

const server = app.listen(port, "0.0.0.0", () => {
    console.log(`[startup] Listening on 0.0.0.0:${port}`);
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