import { container } from "tsyringe";
import express from "express";
import UserAuth from "../../middlewares/auth/user.auth";
import { BlockController } from "../../controllers/block/block.controller";

const router = express.Router();
/************************container**************************/

const userAuth = container.resolve(UserAuth);
const blockController = container.resolve(BlockController);

/************************ routes ***************************/

router.use(userAuth.checkUser);

    router.post(
      "/",
      blockController.block.bind(blockController)
    );

    router.post(
      "/undo",
      blockController.unblock.bind(blockController)
    );

    router.get(
        "/",
        blockController.getBlocks.bind(blockController)
      );

      router.get(
        "/:userId",
        blockController.showBlock.bind(blockController)
      );

export default router;
