import { apiClient } from "./client";
import { ApiResponse, MentorDetail, PaginatedResponse, MentorSummary, Slot } from "../types";

export const mentorApi = {
  search: (params: { industry?: string; service?: string; company?: string; page?: number }) =>
    apiClient
      .get<PaginatedResponse<MentorSummary>>("/mentors", { params })
      .then((res) => res.data),

  getById: (id: string) =>
    apiClient.get<ApiResponse<MentorDetail>>(`/mentors/${id}`).then((res) => res.data.data),

  getAvailableSlots: (mentorId: string) =>
    apiClient
      .get<ApiResponse<Slot[]>>(`/mentors/${mentorId}/slots`)
      .then((res) => res.data.data),
};
