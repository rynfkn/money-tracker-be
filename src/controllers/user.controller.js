import { Param } from "drizzle-orm";
import { getAllUserService, getUserByIdService } from "../services/user.service.js";
import { userLoginService } from "../services/user.service.js";

export async function getAllUserController(req, res){
    const users = await getAllUserService();

    res.json({
        sucess: true,
        data: users
    });
};

export async function getUserByIdController(req, res) {
    const userId = req.user?.id || req.params.id;
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
                id:user.id,
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