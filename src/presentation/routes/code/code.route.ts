import { CodeController } from "../../controllers/code/Code.Controller";
import express from "express";
import { container } from "tsyringe";

const router = express.Router();

/************************container**************************/
const codeController = container.resolve(CodeController);

/************************ routes ***************************/
router.post("/", codeController.addCodes.bind(codeController));
router.get("/", codeController.getCodes.bind(codeController));

export default router;
