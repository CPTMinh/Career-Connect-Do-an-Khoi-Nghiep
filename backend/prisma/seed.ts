import { PrismaClient, Role, ServiceType } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  // 1 Mentor mẫu
  const mentorUser = await prisma.user.create({
    data: {
      email: "mentor.demo@careerconnect.dev",
      passwordHash,
      fullName: "Trần Văn Mentor",
      role: Role.MENTOR,
      mentorProfile: {
        create: {
          company: "VNG Corporation",
          position: "Backend Engineer",
          yearsOfExp: 2,
          industry: "IT",
          bio: "Mình từng phỏng vấn hơn 30 bạn fresher, rất vui được review CV/mock interview cho các bạn.",
          isApproved: true,
          services: [ServiceType.CV_REVIEW, ServiceType.MOCK_INTERVIEW],
        },
      },
    },
    include: { mentorProfile: true },
  });

  // 1 Mentee mẫu
  const menteeUser = await prisma.user.create({
    data: {
      email: "mentee.demo@careerconnect.dev",
      passwordHash,
      fullName: "Nguyễn Thị Mentee",
      role: Role.MENTEE,
    },
  });

  // Vài slot rảnh trong 3 ngày tới
  const now = new Date();
  const slotsData = [1, 2, 3].map((dayOffset) => {
    const start = new Date(now);
    start.setDate(start.getDate() + dayOffset);
    start.setHours(19, 0, 0, 0);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 30);
    return { startTime: start, endTime: end };
  });

  if (mentorUser.mentorProfile) {
    await prisma.slot.createMany({
      data: slotsData.map((s) => ({ ...s, mentorProfileId: mentorUser.mentorProfile!.id })),
    });
  }

  console.log("✅ Seed thành công:");
  console.log(`   Mentor: ${mentorUser.email} / password123`);
  console.log(`   Mentee: ${menteeUser.email} / password123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
