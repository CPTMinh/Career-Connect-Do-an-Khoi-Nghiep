import { Router } from "express";
import { bookingController } from "../controllers/booking.controller";

const router = Router();

router.post("/", bookingController.create);
router.get("/mentee/:menteeId", bookingController.listByMentee);

export default router;
