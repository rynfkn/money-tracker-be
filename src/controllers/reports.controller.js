import { getUserReportsSummaryService } from "../services/reports.service.js";
import { getUserReportByCategoryService } from "../services/reports.service.js";
import { getUserReportTrendService } from "../services/reports.service.js";

export async function getUserReportsSummaryController (req, res, next) {
    try{

        const userId = req.user.id;
        const { from, to } = req.query;
        
        const result = await getUserReportsSummaryService(userId, from, to);
        
        res.status(200).json({
            success: true,
            message: "Success get user reports summary",
            data: result 
        });
    } catch(error) {
        next(error);
    }
}

export async function getUserReportByCategoryController(req, res, next) {
    try {

        const userId = req.user.id;
        const { type, from, to } = req.query;
        
        const result = await getUserReportByCategoryService(userId, type, from, to);
        
        res.status(200).json({
            success: true,
            message: "Success get user report by category",
            data: result
        });
    } catch(error) {
        next(error);
    }
}

export async function getUserReportTrendController(req, res, next) {
    try {

        const userId = req.user.id;
        const { granularity, from, to } = req.query;
        
        const result = await getUserReportTrendService(userId, granularity, from, to);
        
        res.status(200).json({
            success: true,
            message: "Sucess get user report trend",
            data: result
        });
    } catch( error ) {
        next(error);
    }
}