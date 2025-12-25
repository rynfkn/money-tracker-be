import bcrypt from "bcrypt";
import { getAllUserService, getUserByEmailService, getUserByIdService, userRegisterService } from "../services/user.service.js";
import { userLoginService } from "../services/user.service.js";

import { generateToken } from "../utils/jwt.js"

export async function getAllUserController(req, res) {
    try {

        const users = await getAllUserService();

        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export async function getUserByIdController(req, res) {
    try {

        const userId = req.params.id;
        const user = await getUserByIdService(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            data: {
                user: {
                    id: user.userId,
                    username: user.username,
                    email: user.email
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export async function userLoginController(req, res) {
    try {
        const { userEmail, userPassword } = req.body;
        if (!userEmail || userPassword === undefined) {
            return res.status(400).json({
                success: false,
                message: "Email and password required"
            });
        }

        const user = await userLoginService(userEmail, userPassword);


        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const userToken = generateToken(user);

        res.status(200).json({
            success: true,
            message: "You are logged in",
            data: {
                userId: user.userId,
                email: user.email,
                token: userToken,
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export async function userRegisterController(req, res) {
    try {

        const { userName, userEmail, userPassword } = req.body;
        if (!userName || !userEmail || !userPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }


        const existingUser = await getUserByEmailService(userEmail);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exist"
            });
        }

        const hashPassword = await bcrypt.hash(userPassword, 10);
        const user = await userRegisterService(userName, userEmail, hashPassword);

        res.status(201).json({
            success: true,
            message: "User created",
            data: {
                username: user.username,
                email: user.email
            }
        });
    } catch(error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}