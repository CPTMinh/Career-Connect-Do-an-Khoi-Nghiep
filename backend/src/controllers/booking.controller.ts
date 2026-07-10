import { Request, Response } from "express";
import { bookingService } from "../services/booking.service";
import { asyncHandler } from "../middlewares/errorHandler";

export const bookingController = {
  // POST /api/bookings
  // Body: { slotId, menteeId, serviceType, cvFileUrl? }
  // Lưu ý MVP: menteeId lấy tạm từ body; khi có auth (JWT) sẽ lấy từ req.user.id
  create: asyncHandler(async (req: Request, res: Response) => {
    const booking = await bookingService.createBooking(req.body);
    res.status(201).json({ success: true, data: booking });
  }),

  // GET /api/bookings/mentee/:menteeId
  listByMentee: asyncHandler(async (req: Request, res: Response) => {
    const bookings = await bookingService.getMenteeBookings(req.params.menteeId);
    res.json({ success: true, data: bookings });
  }),
};
