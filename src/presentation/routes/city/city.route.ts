import { container } from "tsyringe";
import express from "express";

import { CityController } from "../../controllers/city/City.Controller";
import AdminAuth from "../../middlewares/auth/admin.auth";

const router = express.Router();

/************************container**************************/
const adminAuth = container.resolve(AdminAuth);
const cityController = container.resolve(CityController);

/************************ routes ***************************/
router.get("/", cityController.getCities.bind(cityController));

router.use(adminAuth.checkAdmin);

router.post("/", cityController.addCity.bind(cityController));

export default router;
