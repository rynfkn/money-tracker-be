import jwt from "jsonwebtoken"
import { env } from "../config/env.js"

export function generateToken(user) {
    const payload = {
        id: user.userId,
        username: user.username
    };

    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {expiresIn: env.JWT_ACCESS_EXPIRES_IN});
}