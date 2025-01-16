import { WithdrawController } from "../../controllers/withdraw/Withdraw.Controller";
import UploadHandler from "../../middlewares/handlers/upload.handler";
import express from "express";
import { container } from "tsyringe";

const router = express.Router();

/************************container**************************/
const withdrawController = container.resolve(WithdrawController);
const uploadHandler = container.resolve(UploadHandler);

/************************ routes ***************************/
router.get(
  "/requests",
  withdrawController.getAllWithdrawRequests.bind(withdrawController)
);

router.get(
  "/requests/:requestId",
  withdrawController.showWithdrawRequest.bind(withdrawController)
);
router.get(
  "/transactions/:userId",
  withdrawController.getAllWithdrawTransactions.bind(withdrawController)
);

router.get(
  "/transactions/show/:transactionId",
  withdrawController.showWithdrawTransaction.bind(withdrawController)
);
router.post(
  "/requests/:requestId/handleRequest",
  uploadHandler.handleFileUpload,
  withdrawController.creatWithdrawTransaction.bind(withdrawController)
);

export default router;
