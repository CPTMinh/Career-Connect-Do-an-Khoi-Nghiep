import { Router } from "express";
import { mentorController } from "../controllers/mentor.controller";

const router = Router();

// GET /api/mentors?industry=IT&service=CV_REVIEW&company=VNG&page=1&pageSize=10
router.get("/", mentorController.search);

// GET /api/mentors/:id
router.get("/:id", mentorController.getById);

export default router;
