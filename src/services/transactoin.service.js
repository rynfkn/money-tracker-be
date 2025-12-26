import { sql, eq, and, lte, gte } from "drizzle-orm";
import { db } from "../db/index.js";
import { transactions, wallets } from "../db/schema.js";

export async function createUserTransactionService(walletId, categoryId, transactionDate, amount, description, transactionType) {
    const numericAmount = parseFloat(amount);
    const finalDate = transactionDate ? new Date(transactionDate) : new Date();

    let transactionData = {
        walletId: walletId,
        categoryId: categoryId,
        transactionDate: finalDate,
        amount: numericAmount,
        description: description,
        transactionType: transactionType
    };

    const result = await db.transaction(async (tx) => {
        const newTransaction = await tx.insert(transactions).values(transactionData).returning();

        if( transactionType === "EXPENSE" ) {
            await tx.update(wallets).set({
                balance: sql`${wallets.balance} - ${numericAmount}`,
                updatedAt: new Date()
            }).where(eq(wallets.walletId, walletId));
        } 
        else if( transactionType === "INCOME" ) {
            await tx.update(wallets).set({
                balance: sql`${wallets.balance} + ${numericAmount}`,
                updatedAt: new Date()
            }).where(eq(wallets.walletId, walletId));
        }

        return newTransaction[0];
    });

    return result;
}


export async function getUserTransactionService(from, to, walletId, categoryId, type) {
    const conditions = []
    
    if( walletId ) {
        conditions.push(eq(transactions.walletId, walletId));
    }
    if( categoryId ) {
        conditions.push(eq(transactions.categoryId, categoryId));
    }
    if( type ) {
        conditions.push(eq(transactions.transactionType, type));
    }
    if( from ) {
        conditions.push(gte(transactions.transactionDate, new Date(from)));
    }
    if( to ) {
        conditions.push(lte(transactions.transactionDate, new Date(to)));
    }

    const result = await db.select().from(transactions).where(and(...conditions));
    return result;
}

export async function updateUserTransactionService(
    transactionId, 
    walletId, 
    categoryId, 
    transactionDate, 
    amount, 
    description, 
    transactionType
) {

    const newTrnasactionData = {
        walletId: walletId, 
        categoryId: categoryId, 
        transactionDate: new Date(transactionDate), 
        amount: parseFloat(amount), 
        description: description, 
        transactionType: transactionType
    }

    const result = await db.transaction( async (tx) => {
        // get the existing transaction
        const [existingTransaction] = await tx.select().from(transactions).where(eq(transactions.transactionId, transactionId));

        // reverse transaction on old transaction
        if( existingTransaction.walletId ) {
            const oldAmount = existingTransaction.amount;

            // if old transaction was EXPENSE, add money back to the wallet
            // if old transaction was INCOME, substract money back from the wallet
            let reveseOperaion;
            if( existingTransaction.transactionType === "EXPENSE" ) {
                reveseOperaion = sql`${wallets.balance} + ${oldAmount}`;
            }
            else {
                reveseOperaion = sql`${wallets.balance} - ${oldAmount}`;
                
            }

            // update the old wallets
            await tx.update(wallets).set({
                balance: reveseOperaion,
                updatedAt: new Date()
            }).where(eq(wallets.walletId. existingTransaction.walletId));
            
        }
        
        // create the transaction
        const [updatedTransaction] = await tx.update(transactions).set(newTrnasactionData).where(eq(transactions.transactionId, transactionId)).returning();
        const newAmount = updatedTransaction.amount;

        // apply the new operaion on new transaction
        let applyOperation;
        if( updatedTransaction.transactionType === "EXPENSE") {
            applyOperation = sql`${wallets.balance} - ${newAmount}`;
        }
        else {
            applyOperation = sql`${wallets.balance} + ${newAmount}`;
        }

        // update the new wallets
        await tx.update(wallets).set({
            balance: applyOperation,
            updatedAt: new Date()
        }).where(eq(wallets.walletId, updatedTransaction.walletId));

        return updatedTransaction;
    });

    return result;
}

export async function deleteUserTransactionService(transactionId) {
    
    const result = await db.transaction( async (tx) => {
        const [transactionToDelete] = await tx.select().from(transactions).where(eq(transactions.transactionId, transactionId));
        
        if(transactionToDelete.transactionType === "EXPENSE") {
            await tx.update(wallets).set({
                balance: sql`${wallets.balance} + ${transactionToDelete.amount}`,
                updatedAt: new Date()
            }).where(eq(wallets.walletId, transactionToDelete.walletId));
        }
        else {
            await tx.update(wallets).set({
                balance: sql`${wallets.balance} - ${transactionToDelete.amount}`,
                updatedAt: new Date()
            }).where(eq(wallets.walletId, transactionToDelete.walletId));
        }

        const [deletedTransaction] = await tx.delete(transactions).where(eq(transactions.transactionId, transactionId)).returning();
        return deletedTransaction;

    }).returning();

    return result[0];
}