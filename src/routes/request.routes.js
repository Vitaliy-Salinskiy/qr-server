import { Router } from "express";
import { RequestController } from "../controllers/request.controller.js";

const router = Router();
const requestController = new RequestController();

router.get('/', requestController.getRequests);
router.post('/:id/allow', requestController.allowRequest);
router.post('/:id/deny', requestController.denyRequest);
router.post('/:userId/:productId', requestController.addRequest);

export default router;