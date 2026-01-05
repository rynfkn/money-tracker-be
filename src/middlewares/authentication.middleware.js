import jwt from "jsonwebtoken"
import { env } from "../config/env.js"

export function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(403).json({
            success: false,
            message: "No token provided",
        });
    }

    const [scheme, token] = authHeader.split(" ");

    console.log("here is the scheme >> ", scheme);
    console.log("here is the token >> ", token);

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({
            success: false,
            message: "Invalid Authorization header format. Use: Bearer <token>",
        });
    }

    // const tokenWithoutBearer = token.split(' ')[1];

    try {
        const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
        req.user = decoded;
        return next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};