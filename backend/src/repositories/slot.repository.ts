import { Prisma, SlotStatus } from "@prisma/client";
import { prisma } from "../utils/prismaClient";

export const slotRepository = {
  async createMany(mentorProfileId: string, slots: { startTime: Date; endTime: Date }[]) {
    return prisma.slot.createMany({
      data: slots.map((s) => ({ ...s, mentorProfileId })),
    });
  },

  async findAvailableByMentor(mentorProfileId: string) {
    return prisma.slot.findMany({
      where: { mentorProfileId, status: SlotStatus.AVAILABLE, startTime: { gte: new Date() } },
      orderBy: { startTime: "asc" },
    });
  },

  async findById(id: string) {
    return prisma.slot.findUnique({ where: { id } });
  },

  // Cập nhật trạng thái Slot có kèm điều kiện version — đây là "chốt khoá"
  // để chống race condition khi 2 Mentee cùng book 1 slot cùng lúc.
  // Nếu version ở DB đã đổi (do request khác vừa cập nhật) thì updateMany
  // sẽ trả về count = 0, báo hiệu "slot đã bị người khác đặt trước".
  async lockAndBook(slotId: string, expectedVersion: number) {
    return prisma.slot.updateMany({
      where: {
        id: slotId,
        version: expectedVersion,
        status: SlotStatus.AVAILABLE,
      },
      data: {
        status: SlotStatus.BOOKED,
        version: { increment: 1 },
      },
    });
  },

  async updateStatus(slotId: string, status: SlotStatus, tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma;
    return client.slot.update({ where: { id: slotId }, data: { status } });
  },
};
