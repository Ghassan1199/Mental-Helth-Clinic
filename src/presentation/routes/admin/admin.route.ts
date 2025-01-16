import { AdminController } from "../../controllers/admin/Admin.Controller";

import express from "express";
import { container } from "tsyringe";
import { SpecialistController } from "../../controllers/specs/Specialist.Controller";
import AdminAuth from "../../middlewares/auth/admin.auth";
const router = express.Router();
/************************container**************************/

const adminController = container.resolve(AdminController);
const specialistController = container.resolve(SpecialistController);
const adminAuth = container.resolve(AdminAuth);

/************************ routes ***************************/


router.post("/", adminController.register.bind(adminController));

router.post("/login", adminController.login.bind(adminController));

router.get(
  "/getAllSpecialists",
  adminAuth.checkAdmin,   
  specialistController.getSpec.bind(specialistController)
);

router.get(
  "/doctors/:specializationId",
    specialistController.getDocsBySpecialization.bind(specialistController)
); 

export default router;
