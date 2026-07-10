// Các type này nên khớp với Prisma schema ở backend.
// Khi cần, có thể export type trực tiếp từ backend qua 1 package "shared"
// nhưng để đơn giản cho MVP, mình định nghĩa lại thủ công ở đây.

export type ServiceType = "CV_REVIEW" | "MOCK_INTERVIEW" | "QNA";
export type SlotStatus = "AVAILABLE" | "BOOKED" | "COMPLETED" | "CANCELLED";

export interface MentorSummary {
  id: string;
  company: string;
  position: string;
  yearsOfExp: number;
  industry: string;
  bio?: string | null;
  services: ServiceType[];
  user: {
    id: string;
    fullName: string;
    avatarUrl?: string | null;
  };
}

export interface MentorDetail extends MentorSummary {
  ratingAverage: number;
  ratingCount: number;
}

export interface Slot {
  id: string;
  startTime: string;
  endTime: string;
  status: SlotStatus;
  version: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  items: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}
