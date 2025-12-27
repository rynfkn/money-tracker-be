import { and, eq, sql, count, lte, gte, asc } from "drizzle-orm"
import { db } from "../db/index.js"
import { categories, transactions, users, wallets } from "../db/schema.js"

export async function getUserReportsSummaryService(userId, from, to) {

    let results = {
        "from": new Date(from),
        "to": new Date(to),
        "totalIncome": 0,
        "totalExpense": 0,
        "netTotal": 0,
        "transactionCount": 0
    }

    const incomeResult = await db.select({
        value: sql`sum(${transactions.amount})`.mapWith(Number)
    }).from(transactions).innerJoin(wallets, eq(transactions.walletId, wallets.walletId)).innerJoin(users, eq(users.userId, wallets.userId))
        .where(and(
            eq(transactions.transactionType, 'INCOME'),
            eq(users.userId, userId),
            gte(transactions.transactionDate, new Date(from)),
            lte(transactions.transactionDate, new Date(to))
        ))
        .groupBy(users.userId, users.username);

    const expenseResult = await db.select({
        value: sql`sum(${transactions.amount})`.mapWith(Number)
    }).from(transactions).innerJoin(wallets, eq(transactions.walletId, wallets.walletId)).innerJoin(users, eq(users.userId, wallets.userId))
        .where(and(
            eq(transactions.transactionType, 'EXPENSE'),
            eq(users.userId, userId),
            gte(transactions.transactionDate, new Date(from)),
            lte(transactions.transactionDate, new Date(to))
        ))
        .groupBy(users.userId, users.username);

    const totalTransaction = await db.select({
        value: count(transactions.transactionId)
    }).from(transactions).innerJoin(wallets, eq(transactions.walletId, wallets.walletId)).innerJoin(users, eq(users.userId, wallets.userId))
        .where(and(
            eq(users.userId, userId),
            gte(transactions.transactionDate, new Date(from)),
            lte(transactions.transactionDate, new Date(to))
        ))
        .groupBy(users.userId, users.username);

    results.totalIncome = incomeResult[0]?.value || 0;
    results.totalExpense = expenseResult[0]?.value || 0;
    results.transactionCount = totalTransaction[0]?.value || 0;

    results.netTotal = results.totalIncome - results.totalExpense;

    return results;
}

export async function getUserReportByCategoryService(userId, type, from, to) {
    const allDataByCategory = db.select({
        categoryId: categories.categoryId,
        categoryName: categories.name,
        transactionType: transactions.transactionType,
        total: sql`sum(${transactions.amount})`.mapWith(Number),
        count: count(transactions.transactionType)
    })
        .from(transactions).innerJoin(wallets, eq(transactions.walletId, wallets.walletId)).innerJoin(categories, eq(categories.categoryId, transactions.categoryId)).innerJoin(users, eq(users.userId, wallets.userId))
        .groupBy(categories.name, users.userId, transactions.transactionType, categories.categoryId)
        .where(eq(users.userId, userId));

    if (type) {
        return await db.select({
            categoryId: categories.categoryId,
            categoryName: categories.name,
            transactionType: transactions.transactionType,
            total: sql`sum(${transactions.amount})`.mapWith(Number),
            count: count(transactions.transactionType)
        })
            .from(transactions).innerJoin(wallets, eq(transactions.walletId, wallets.walletId)).innerJoin(categories, eq(categories.categoryId, transactions.categoryId)).innerJoin(users, eq(users.userId, wallets.userId))
            .groupBy(categories.name, users.userId, transactions.transactionType, categories.categoryId)
            .where(and(
                eq(users.userId, userId),
                eq(transactions.transactionType, type)
            ));
    }

    return allDataByCategory;
}

export async function getUserReportTrendService(userId, granularity, from, to) {
    let interval = 'day';

    const dailyTrendData = db.select({
        date: sql`DATE_TRUNC(${sql.raw(interval)}, ${transactions.transactionDate})`.as('period'),
        income: sql`COALESCE(SUM(CASE WHEN ${transactions.transactionType} = 'INCOME' THEN ${transactions.amount} ELSE 0 END), 0)`.mapWith(Number),
        expense: sql`COALESCE(SUM(CASE WHEN ${transactions.transactionType} = 'EXPENSE' THEN ${transactions.amount} ELSE 0 END), 0)`.mapWith(Number),
        net: sql`COALESCE(SUM(CASE 
            WHEN ${transactions.transactionType} = 'INCOME' THEN ${transactions.amount} 
            ELSE -${transactions.amount} 
        END), 0)`.mapWith(Number)
    })
        .from(transactions)
        .innerJoin(wallets, eq(transactions.walletId, wallets.walletId))
        .where(and(
            eq(wallets.userId, userId)
        ))
        .groupBy(sql`DATE_TRUNC(${sql.raw(interval)}, ${transactions.transactionDate})`)
        .orderBy(asc(sql`DATE_TRUNC(${sql.raw(interval)}, ${transactions.transactionDate})`))

    console.log(dailyTrendData);
}