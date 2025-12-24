import { Param } from "drizzle-orm";
import bcrypt from "bcrypt";
import { getAllUserService, getUserByEmailService, getUserByIdService, userRegisterService } from "../services/user.service.js";
import { userLoginService } from "../services/user.service.js";
export async function getAllUserController(req, res){
    const users = await getAllUserService();

    res.json({
        sucess: true,
        data: users
    });
};

export async function getUserByIdController(req, res) {
    const userId = req.params.id;
    const user = await getUserByIdService(userId);

    if(!user) {
        return res.status(404).json({
            sucess: false,
            message: "User not found"
        });
    }

    res.json({
        sucess: true,
        data: {
            user: {
                id:user.userId,
                username: user.username,
                email: user.email
            }
        }
    });
}

export async function userLoginController(req, res) {
    const {userEmail, userPassword } = req.body;
    const user = await userLoginService(userEmail, userPassword);

    if(!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        });
    }


    res.status(200).json({
        success:true,
        message: "You are logged in",
        data: {
            userId: user.userId,
            email: user.email
            
        }
    });
    
}

export async function userRegisterController(req, res) {
    const { userName, userEmail, userPassword } = req.body;

    const existingUser = await getUserByEmailService(userEmail);
    if(!existingUser) {
        const hashPassword = await bcrypt.hash(userPassword, 10);

        const user = await userRegisterService(userName, userEmail, hashPassword);

        return res.status(201).json({
            success: true,
            message: "User created",
            data: {
                username: user[0].username,
                email: user[0].email
            }
        });
    }

    res.status(409).json({
        success: false,
        message: "User already exist"
    });
}