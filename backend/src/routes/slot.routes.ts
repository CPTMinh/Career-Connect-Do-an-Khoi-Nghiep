import { Router } from "express";
import { slotController } from "../controllers/slot.controller";

// Mounted tại /api/mentors/:mentorId/slots trong app.ts (mergeParams: true)
const router = Router({ mergeParams: true });

router.get("/", slotController.listAvailable);
router.post("/", slotController.create);

export default router;
