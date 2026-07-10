import { ServiceType } from "@prisma/client";
import { prisma } from "../utils/prismaClient";

export const bookingRepository = {
  async createWithSlot(params: {
    slotId: string;
    menteeId: string;
    serviceType: ServiceType;
    cvFileUrl?: string;
  }) {
    // Transaction đảm bảo: nếu tạo Booking thất bại thì Slot không bị đổi trạng thái,
    // và ngược lại — hai thao tác này phải "ăn cùng nhau hoặc không ăn gì cả".
    return prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          slotId: params.slotId,
          menteeId: params.menteeId,
          serviceType: params.serviceType,
          cvFileUrl: params.cvFileUrl,
        },
      });
      return booking;
    });
  },

  async findByMentee(menteeId: string) {
    return prisma.booking.findMany({
      where: { menteeId },
      include: {
        slot: { include: { mentorProfile: { include: { user: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async findById(id: string) {
    return prisma.booking.findUnique({
      where: { id },
      include: { slot: true, mentee: true },
    });
  },
};
