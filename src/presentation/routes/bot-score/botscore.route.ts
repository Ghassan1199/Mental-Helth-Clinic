import { container } from "tsyringe";
import express from "express";
import UserAuth from "../../middlewares/auth/user.auth";
import { BotScoreController } from "../../controllers/bot-score/BotScore.controller";

const router = express.Router();
/************************container**************************/

const userAuth = container.resolve(UserAuth);
const botScoreController = container.resolve(BotScoreController);

/************************ routes ***************************/

router.use(userAuth.checkUser);

router.post(
  "/",
  botScoreController.addScore.bind(botScoreController)
);

router.get(
  "/:userId",
  botScoreController.getScores.bind(botScoreController)
);

export default router;
