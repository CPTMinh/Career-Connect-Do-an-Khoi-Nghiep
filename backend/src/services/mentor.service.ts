import { mentorRepository, MentorSearchFilters } from "../repositories/mentor.repository";
import { AppError } from "../middlewares/errorHandler";

// Service layer: chứa business logic, gọi xuống Repository để truy vấn DB.
// Controller KHÔNG được gọi thẳng Prisma — luôn phải đi qua Service.

export const mentorService = {
  async getMentorProfile(id: string) {
    const mentor = await mentorRepository.findApprovedById(id);
    if (!mentor) {
      throw new AppError("Không tìm thấy mentor hoặc mentor chưa được duyệt", 404);
    }

    const { average, count } = await mentorRepository.getAverageRating(id);

    return {
      ...mentor,
      ratingAverage: Number(average.toFixed(1)),
      ratingCount: count,
    };
  },

  async searchMentors(filters: MentorSearchFilters) {
    const result = await mentorRepository.search(filters);
    return {
      items: result.items,
      pagination: {
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: Math.ceil(result.total / result.pageSize),
      },
    };
  },
};
