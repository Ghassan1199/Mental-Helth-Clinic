import { CategoryController } from "../../controllers/category/Category.Controller";
import { container } from "tsyringe";
import express from "express";
import UserAuth from "../../middlewares/auth/user.auth";
import AdminAuth from "../../middlewares/auth/admin.auth";

const router = express.Router();
/************************container**************************/

const adminAuth = container.resolve(AdminAuth);
const categoryController = container.resolve(CategoryController);

/************************ routes ***************************/
router.get(
  "/",
  categoryController.getCategories.bind(categoryController)
);

router.use(adminAuth.checkAdmin);

    router.post(
      "/",
      categoryController.addCategory.bind(categoryController)
    );

    

export default router;
