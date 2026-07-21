import { Request, Response } from "express";
import { bookingService } from "../services/booking.service";
import { asyncHandler } from "../middlewares/errorHandler";

export const bookingController = {
  // POST /api/bookings
  // Body: { slotId, serviceType, cvFileUrl? }
  create: asyncHandler(async (req: Request, res: Response) => {
    const menteeId = (req as any).user?.id;
    if (!menteeId) {
      return res.status(401).json({ error: "Chưa xác thực" });
    }

    const payload = { ...req.body, menteeId };
    const booking = await bookingService.createBooking(payload);
    res.status(201).json({ success: true, data: booking });
  }),

  // GET /api/bookings/mentee/:menteeId (Note: can also be rewritten to just use req.user.id but for now let's verify if the requested menteeId matches req.user.id or if user is admin)
  listByMentee: asyncHandler(async (req: Request, res: Response) => {
    const requestedMenteeId = req.params.menteeId;
    const userId = (req as any).user?.id;

    if (requestedMenteeId !== userId) {
      return res.status(403).json({ error: "Bạn không có quyền xem lịch sử của người khác" });
    }

    const bookings = await bookingService.getMenteeBookings(requestedMenteeId);
    res.json({ success: true, data: bookings });
  }),
};
