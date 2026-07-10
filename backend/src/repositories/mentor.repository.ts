import { Prisma, ServiceType } from "@prisma/client";
import { prisma } from "../utils/prismaClient";

// Repository layer: CHỈ chứa truy vấn Prisma thuần.
// Không xử lý logic nghiệp vụ ở đây — logic thuộc về Service layer.

export interface MentorSearchFilters {
  industry?: string;
  service?: ServiceType;
  company?: string;
  page?: number;
  pageSize?: number;
}

export const mentorRepository = {
  async findApprovedById(id: string) {
    return prisma.mentorProfile.findFirst({
      where: { id, isApproved: true },
      include: {
        user: { select: { id: true, fullName: true, avatarUrl: true } },
        reviews: { orderBy: { createdAt: "desc" }, take: 10 },
      },
    });
  },

  async search(filters: MentorSearchFilters) {
    const { industry, service, company, page = 1, pageSize = 10 } = filters;

    const where: Prisma.MentorProfileWhereInput = {
      isApproved: true,
      ...(industry && { industry: { equals: industry, mode: "insensitive" } }),
      ...(company && { company: { contains: company, mode: "insensitive" } }),
      ...(service && { services: { has: service } }),
    };

    const [items, total] = await Promise.all([
      prisma.mentorProfile.findMany({
        where,
        include: {
          user: { select: { id: true, fullName: true, avatarUrl: true } },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.mentorProfile.count({ where }),
    ]);

    return { items, total, page, pageSize };
  },

  async createProfile(userId: string, data: Omit<Prisma.MentorProfileUncheckedCreateInput, "userId">) {
    return prisma.mentorProfile.create({
      data: { ...data, userId },
    });
  },

  async getAverageRating(mentorProfileId: string) {
    const result = await prisma.review.aggregate({
      where: { mentorProfileId },
      _avg: { rating: true },
      _count: { rating: true },
    });
    return {
      average: result._avg.rating ?? 0,
      count: result._count.rating,
    };
  },
};
