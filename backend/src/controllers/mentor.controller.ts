import { Request, Response } from "express";
import { ServiceType } from "@prisma/client";
import { mentorService } from "../services/mentor.service";
import { asyncHandler } from "../middlewares/errorHandler";

// Controller layer: chỉ nhận req, validate cơ bản, gọi Service, trả res.
// KHÔNG chứa business logic ở đây.

export const mentorController = {
  getById: asyncHandler(async (req: Request, res: Response) => {
    const mentor = await mentorService.getMentorProfile(req.params.id);
    res.json({ success: true, data: mentor });
  }),

  search: asyncHandler(async (req: Request, res: Response) => {
    const { industry, service, company, page, pageSize } = req.query;

    const result = await mentorService.searchMentors({
      industry: industry as string | undefined,
      service: service as ServiceType | undefined,
      company: company as string | undefined,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });

    res.json({ success: true, ...result });
  }),
};
