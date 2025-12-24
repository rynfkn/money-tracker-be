import { eq } from "drizzle-orm"
import { db } from "../db/index.js"
import { wallets } from "../db/schema.js"

export async function getUserWalletsService(userId) {
    const userWallets = await db.select().from(wallets).where(eq(wallets.userId, userId));
    return userWallets;
}

export async function createUserWalletService(userId, walletName, balance) {
    const newWalletData = {
        userId: userId,
        walletName: walletName,
        balance: balance
    };

    const result = await db.insert(wallets).values(newWalletData).returning();
    return result[0];
}

export async function updateUserWalletService(walletId, walletName, balance) {
    const newWalletData = {
        walletName: walletName,
        balance: balance,
        updateAt: new Date()
    }

    const result = await db.update(wallets).set(newWalletData).where(eq(wallets.walletId, walletId)).returning();
    return result[0] || null;
}

export async function deleteUserWalletService(walletId) {
    const result = await db.delete(wallets).where(eq(wallets.walletId, walletId)).returning();
    return result[0] || null;
}