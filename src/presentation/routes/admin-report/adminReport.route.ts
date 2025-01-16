import express from "express";
import { container } from "tsyringe";
import { ReportController } from "../../controllers/report/Report.Controller";
import AdminAuth from "../../middlewares/auth/admin.auth";

const router = express.Router();

/************************container**************************/

const adminAuth = container.resolve(AdminAuth);

const reportController = container.resolve(ReportController);

/************************ routes ***************************/
router.get("/", reportController.getReports.bind(reportController));
    
router.use(adminAuth.checkAdmin);



router.get("/:reportId", reportController.showReport.bind(reportController));

router.post("/:reportId/handle", reportController.handleReport.bind(reportController));


export default router;
