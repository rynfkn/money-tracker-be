import jwt from "jsonwebtoken"
import { env } from "../config/env.js"

export function authenticate(req, res, next) {
    const token = req.headers['authorization'];
    
    if(!token) {
        return res.status(403).json({
            success:false,
            message: "No token provided"
        });
    }

    // const tokenWithoutBearer = token.split(' ')[1];
    
    jwt.verify(token, env.JWT_ACCESS_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });

        }
        req.user = decoded;
        next();
    });


};