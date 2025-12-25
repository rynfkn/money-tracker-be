import { createCategoriesService } from "../services/categories.service.js";
import { getCategoriesService } from "../services/categories.service.js";
import { updateCategoriesService } from "../services/categories.service.js";
import { deleteCategoriesService } from "../services/categories.service.js";

export async function createCategoriesController(req, res) {
    const { userId, categoriesName, categoriesType } = req.body;

    const result = await createCategoriesService(userId, categoriesName, categoriesType);

    res.status(200).json({
        success: true,
        message: "Success create categories",
        data: result
    });
}

export async function getCategoriesController(req, res) {
    const userId = req.user.id;
    const type = req.query.type;

    const categories = await getCategoriesService(userId, type);

    res.status(200).json({
        success: true,
        message: "Success get categories",
        data: categories
    });
}

export async function updateCategoriesController(req, res) {
    const categoryId = req.params.id;
    const { categoryName, categoryType } = req.body;

    if(!categoryId) {
        return res.status(401).json({
            success: false,
            message: "Parameters required"
        });
    }

    const category = await updateCategoriesService(categoryId, categoryName, categoryType);
    res.status(200).json({
        success: true,
        message: "Success update category",
        data: category
    });

}

export async function deleteCategoriesController(req, res) {
    const categoryId = req.params.id;
    if(!categoryId) {
        return res.status(401).json({
            success: false,
            message: "Parameters required"
        });
    }

    const result = await deleteCategoriesService(categoryId); 

    res.status(200).json({
        success: true, 
        message: "Success delete category",
        data: result
    });
}