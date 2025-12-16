export function healthCheck(_req, res) {
    res.json({
        ok: true,
        service: "money-tracker-be",
        timestamp: new Date().toISOString(),
    });
}