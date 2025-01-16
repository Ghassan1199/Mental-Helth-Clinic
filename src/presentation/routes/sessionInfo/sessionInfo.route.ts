import { SessionInfoController } from "../../controllers/sessionInfo/sessionInfo.controller";
import express from "express";
import { container } from "tsyringe";

const router = express.Router();

/************************container**************************/
const sessionInfoController = container.resolve(SessionInfoController);

/************************ routes ***************************/
    router.post(
      "/",
      sessionInfoController.addSessionInfo.bind(sessionInfoController)
    );

    router.get(
      "/",
      sessionInfoController.getSessionInfo.bind(sessionInfoController)
    );

    router.put(
      "/:sessionInfoId/update",
      sessionInfoController.updateSessionInfo.bind(
        sessionInfoController
      )
    );

export default router;
