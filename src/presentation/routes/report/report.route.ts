import express from "express";
import { container } from "tsyringe";
import { ReportController } from "../../controllers/report/Report.Controller";
import UserAuth from "../../middlewares/auth/user.auth";
import UploadHandler from "../../middlewares/handlers/upload.handler";

const router = express.Router();

/************************container**************************/

const userAuth = container.resolve(UserAuth);

const reportController = container.resolve(ReportController);

const uploadHandler = container.resolve(UploadHandler);


/************************ routes ***************************/
router.get("/", reportController.getReports.bind(reportController));

router.use(userAuth.checkUser);

router.post("/user", reportController.createUserReport.bind(reportController));

router.post("/medicalRecord", reportController.createMedicalReocrdReport.bind(reportController));

router.post("/appointment", uploadHandler.handleFileUpload, reportController.createAppointmentReport.bind(reportController));

router.get("/history", reportController.getReportsForUser.bind(reportController));

router.get("/:reportId", reportController.showReport.bind(reportController));

export default router;
