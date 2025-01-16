import express from "express";
import UserAuth from "../../middlewares/auth/user.auth";
import { ChatController } from "../../controllers/Chat.Controller";
import { container } from "tsyringe";

const router = express.Router();

/************************container**************************/

const userAuth = container.resolve(UserAuth);
const chatController = container.resolve(ChatController);

/************************ routes ***************************/
router.use(userAuth.checkUser);
router.get("/", chatController.index.bind(chatController));
router.post("/create", chatController.create.bind(chatController));
router.post("/message", chatController.sendMessage.bind(chatController));
router.get("/getChat/:userId", chatController.getChat.bind(chatController));
export default router;
