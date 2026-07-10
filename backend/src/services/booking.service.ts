import { ServiceType, SlotStatus } from "@prisma/client";
import { slotRepository } from "../repositories/slot.repository";
import { bookingRepository } from "../repositories/booking.repository";
import { AppError } from "../middlewares/errorHandler";
// import { sendBookingConfirmationEmail } from "./email.service"; // gắn ở MVP Feature 3

interface CreateBookingInput {
  slotId: string;
  menteeId: string;
  serviceType: ServiceType;
  cvFileUrl?: string;
}

export const bookingService = {
  /**
   * Đây là hàm quan trọng nhất của MVP: xử lý đặt lịch an toàn khi nhiều
   * Mentee có thể cùng bấm "Đặt lịch" cho 1 slot trong cùng khoảnh khắc.
   *
   * Cơ chế: Optimistic Locking
   * 1. Đọc Slot hiện tại, lấy version.
   * 2. Cố gắng update Slot -> BOOKED với điều kiện version khớp.
   * 3. Nếu update thành công (count === 1) -> tạo Booking.
   * 4. Nếu update thất bại (count === 0) -> nghĩa là người khác vừa book
   *    trước trong lúc mình đang xử lý -> báo lỗi rõ ràng cho Mentee.
   */
  async createBooking(input: CreateBookingInput) {
    const slot = await slotRepository.findById(input.slotId);

    if (!slot) {
      throw new AppError("Slot không tồn tại", 404);
    }
    if (slot.status !== SlotStatus.AVAILABLE) {
      throw new AppError("Slot này đã được đặt hoặc không còn khả dụng", 409);
    }
    if (slot.startTime < new Date()) {
      throw new AppError("Không thể đặt slot đã qua thời gian", 400);
    }

    const lockResult = await slotRepository.lockAndBook(slot.id, slot.version);

    if (lockResult.count === 0) {
      // Có request khác đã "thắng" trong khoảng thời gian rất ngắn giữa lúc
      // mình đọc slot và lúc mình cố update. Đây chính là race condition
      // được xử lý an toàn thay vì để 2 người cùng đặt trùng 1 slot.
      throw new AppError(
        "Rất tiếc, slot này vừa được người khác đặt trước. Vui lòng chọn slot khác.",
        409
      );
    }

    try {
      const booking = await bookingRepository.createWithSlot(input);
      // await sendBookingConfirmationEmail(booking.id); // TODO: MVP Feature 3
      return booking;
    } catch (err) {
      // Nếu tạo Booking lỗi sau khi đã lock slot thành công, cần rollback
      // trạng thái Slot về AVAILABLE để không "khoá chết" slot đó.
      await slotRepository.updateStatus(slot.id, SlotStatus.AVAILABLE);
      throw err;
    }
  },

  async getMenteeBookings(menteeId: string) {
    return bookingRepository.findByMentee(menteeId);
  },
};
