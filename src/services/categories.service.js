import { db } from "../db/index.js";
import { eq, and } from "drizzle-orm";
import { categories } from "../db/schema.js";

export async function createCategoriesService(userId, categoriesName, categoriesType) {
    const newCategoriesData = {
        userId: userId,
        name: categoriesName,
        type: categoriesType
    }
    const result = await db.insert(categories).values(newCategoriesData).returning();
    return result[0];
}

export async function getCategoriesService(userId, type) {
    let allCategories = db.select().from(categories).where(eq(categories.userId, userId));

    if(type) {
        return await db.select().from(categories).where(and(
            eq(categories.userId, userId),
            eq(categories.type, type)
        ));
    }

    return await allCategories;
   
}

export async function updateCategoriesService(categoryId, categoryName, categoryType) {
    const newCategoryData = {
        name: categoryName,
        type: categoryType
    }
    const result =  await db.update(categories).set(newCategoryData).where(eq(categories.categoryId, categoryId)).returning();
    return result[0];
    
}

export async function deleteCategoriesService(categoryId) {
    const result = await db.delete(categories).where(eq(categories.categoryId, categoryId)).returning();
    return result[0];
}