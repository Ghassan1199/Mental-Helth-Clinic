import { Router } from "express";
import userRoute from "./user/user.auth.route";
import specialistRoute from "./specs/spec.route";
import otpRoute from "./otp/otp.route";
import registrationRoute from "./registration/registration.route";
import cityRoute from "./city/city.route";
import categoryRoute from "./category/category.route";
import appointmentRoute from "./appointment";
import clinicRoute from "./clinic.route";
import chatRoute from "./chat/chat.route";
import adminRoute from "./admin/admin.route";
import codeRoute from "./code/code.route";
import withdrawRoute from "./withdraw/withdraw.route";
import AdminAuth from "../middlewares/auth/admin.auth";
import sessionInfoRoute from "./sessionInfo/sessionInfo.route";
import { AdminService } from "../../application/services/admin/admin.service";
import { AdminMysqlRepository } from "../../infrastructure/database/repositories/mysql/admin/admin.mysql.repository";
import Validator from "../../application/validation/validator";
import JwtService from "../../application/services/jwt.Service";
import botScoreRoute from "./bot-score/botscore.route";
import blockRoute from "./block/block.route";
import assignmentRoute from "./assignment/assignment.route";
import reportRoute from "./report/report.route";
import adminReportRoute from "./admin-report/adminReport.route";

class IndexRouter {
  router: Router;
  private adminAuth: AdminAuth;

  constructor() {
    this.router = Router();
    const jwtService = new JwtService();
    this.adminAuth = new AdminAuth(
      new AdminService(new AdminMysqlRepository(), new Validator(), jwtService),
      jwtService
    );
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.use("/user", userRoute);
    this.router.use("/appointment", appointmentRoute);
    this.router.use("/clinic", clinicRoute);
    this.router.use("/specs", specialistRoute);
    this.router.use("/otp", otpRoute);
    this.router.use("/botScore", botScoreRoute);
    this.router.use("/blocks", blockRoute);
    this.router.use("/chat", chatRoute);
    this.router.use("/assignment", assignmentRoute);
    this.router.use("/reports", reportRoute);



    
    this.router.use("/admins", adminRoute);
    this.router.use(
      "/registrationsRequests",
      this.adminAuth.checkAdmin,
      registrationRoute
    ); 
    this.router.use("/codes", this.adminAuth.checkAdmin, codeRoute);
    this.router.use("/withdraws", this.adminAuth.checkAdmin, withdrawRoute);
    this.router.use("/sessionInfo", this.adminAuth.checkAdmin,  sessionInfoRoute);
    this.router.use("/cities", cityRoute); 
    this.router.use("/categories", categoryRoute);
    this.router.use("/admin-reports", adminReportRoute);

    
  }
}

export default new IndexRouter().router;
