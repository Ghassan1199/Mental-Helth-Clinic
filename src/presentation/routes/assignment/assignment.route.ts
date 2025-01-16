import { container } from "tsyringe";
import express from "express";
import UserAuth from "../../middlewares/auth/user.auth";
import { SpecialistController } from "../../controllers/specs/Specialist.Controller";

const router = express.Router();
/************************container**************************/

const userAuth = container.resolve(UserAuth);
const specialistController = container.resolve(SpecialistController);

/************************ routes ***************************/

router.use(userAuth.checkUser);

    router.delete(
      "/spec/:specId/user/:userId/unassign",
      specialistController.unassign.bind(specialistController)
    );


export default router;
