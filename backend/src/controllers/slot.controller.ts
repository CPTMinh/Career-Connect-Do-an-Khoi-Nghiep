import { Request, Response } from "express";
import { slotRepository } from "../repositories/slot.repository";
import { asyncHandler } from "../middlewares/errorHandler";

export const slotController = {
  // GET /api/mentors/:mentorId/slots
  listAvailable: asyncHandler(async (req: Request, res: Response) => {
    const slots = await slotRepository.findAvailableByMentor(req.params.mentorId);
    res.json({ success: true, data: slots });
  }),

  // POST /api/mentors/:mentorId/slots  (Mentor tạo slot rảnh)
  create: asyncHandler(async (req: Request, res: Response) => {
    const { slots } = req.body as { slots: { startTime: string; endTime: string }[] };

    const result = await slotRepository.createMany(
      req.params.mentorId,
      slots.map((s) => ({ startTime: new Date(s.startTime), endTime: new Date(s.endTime) }))
    );

    res.status(201).json({ success: true, count: result.count });
  }),
};
