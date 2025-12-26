import { createUserTransactionService } from "../services/transactoin.service.js";
import { getUserTransactionService } from "../services/transactoin.service.js";
import { updateUserTransactionService } from "../services/transactoin.service.js";
import { deleteUserTransactionService } from "../services/transactoin.service.js";

export async function createUserTransactionController(req, res) {
    const { 
        walletId, categoryId, 
        transactionDate, amount, description, transactionType
    } = req.body;

    const result = await createUserTransactionService(walletId, categoryId, transactionDate, amount, description, transactionType);
    res.status(200).json({
        success : true,
        message: "Succes create transaction",
        data: result
    });
}

export async function getUserTransactionController(req, res) {
    const { from, to, walletId, categoryId, type } = req.query;
    const result = await getUserTransactionService(from, to, walletId, categoryId, type);
    
    res.status(200).json({
        success: true,
        message: "Success get transaction",
        data: result
    });
}

export async function updateUserTransactionController(req, res) {
    const transactionId = req.params.id;
    const { walletId, categoryId, transactionDate, amount, description, transactionType} = req.body;

    const result = await updateUserTransactionService(
        transactionId, walletId, categoryId,
        transactionDate, amount, description, transactionType
    );

    res.status(200).json({
        success: true,
        message: "Success update transaction",
        data: result
    });
}


export async function deleteUserTransactionController(req, res) {
    const transactionId = req.params.id;

    const result = await deleteUserTransactionService(transactionId);
    
    res.status(200).json({
        success: true,
        message: "Success delete transaction",
        data: result
    });
}