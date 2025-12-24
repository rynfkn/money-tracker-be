import { categories } from "../db/schema.js";
import { getUserWalletsService } from "../services/wallet.service.js";
import { createUserWalletService } from "../services/wallet.service.js";
import { updateUserWalletService } from "../services/wallet.service.js";
import { deleteUserWalletService } from "../services/wallet.service.js";

export async function getUserWalletsController(req, res) {
    const userId = req.params.id;
    const userWallets = await getUserWalletsService(userId);

    if(!userWallets) {
        return res.status(200).json({
            success:true,
            message: "User has no wallet",
            data: []
        });
    }

    const walletData = userWallets.map(wallet => ({
        walletId: wallet.walletId,
        walletName: wallet.walletName,
        balance: wallet.balance
    }));

    res.status(200).json({
        success: true,
        message: "Sucess get user wallets",
        data: walletData
    });
}


export async function createUserWalletController(req, res) {
    const userId = req.params.id;
    const { walletName, balance } = req.body;

    if(!walletName || balance === undefined) {
        return res.status(400).json({
            success: false,
            message: "walletName and balance are required"
        });
    }

    try {
        const newWallet = await createUserWalletService(userId, walletName, balance);
        
        res.status(200).json({
            success: true,
            message: "Success adding new wallet",
            data: newWallet
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export async function updateUserWalletController(req, res) {
    const walletId = req.params.id;
    const { walletName, balance } = req.body;

    try {

        const updatedWallet = await updateUserWalletService(walletId, walletName, balance);
        if(!updatedWallet) {
            return res.status(404).json({
                success: false,
                messag: "Wallet not found"
            });
        }
        
        res.status(200).json({
            success:true,
            message: "Success update wallet",
            data: result
        });
    } catch(error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export async function deleteUserWalletController(req, res) {
    const walletId = req.params.id;

    try {

        const result = await deleteUserWalletService(walletId);
        if(!result) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Success delete wallet",
            data: result
        });
    } catch(error) {
        res.status(500).json({
            success:false,
            message: error.message
        });
    }
}