import { Router } from "express";
import { bookingController } from "../controllers/booking.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", requireAuth, bookingController.create);
router.get("/mentee/:menteeId", requireAuth, bookingController.listByMentee);

export default router;
