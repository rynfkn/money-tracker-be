import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js"; 
import bcrypt from "bcrypt";

export async function getAllUserService(){
    return await db.select().from(users);
}

export async function getUserByIdService(userId) {
    const user = await db.select().from(users).where(eq(users.userId, userId)).limit(1);

    return user[0];
}


export async function userLoginService(userEmail, userPassword) {
    const result = await db.select().from(users).where(eq(users.email, userEmail));
    if (result.length === 0) {
        return null;
    }

    const user = result[0];
    
    const passwordMatch = await bcrypt.compare(userPassword, user.password);
    if (!passwordMatch) {
        return null;
    }

    return user;
}