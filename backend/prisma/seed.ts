import { PrismaClient, Role, ServiceType } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  // 1. Tạo Mentee mẫu
  const menteeUser = await prisma.user.upsert({
    where: { email: "mentee.demo@careerconnect.dev" },
    update: {},
    create: {
      email: "mentee.demo@careerconnect.dev",
      passwordHash,
      fullName: "Nguyễn Thị Mentee",
      role: Role.MENTEE,
      avatarUrl: "https://ui-avatars.com/api/?name=Mentee&background=random",
    },
  });

  console.log("✅ Tạo Mentee mẫu thành công");

  // Danh sách 10 Mentor giả lập
  const mentorsData = [
    {
      email: "an.nguyen@vng.com",
      fullName: "Nguyễn Văn An",
      company: "VNG Corporation",
      position: "Senior Software Engineer",
      yearsOfExp: 5,
      industry: "IT",
      bio: "Mình có hơn 5 năm kinh nghiệm làm việc với hệ thống lớn tại VNG. Rất vui được chia sẻ kinh nghiệm phỏng vấn technical và review CV cho các bạn fresher/junior.",
      services: [ServiceType.CV_REVIEW, ServiceType.MOCK_INTERVIEW, ServiceType.QNA],
    },
    {
      email: "ngoc.tran@shopee.com",
      fullName: "Trần Bích Ngọc",
      company: "Shopee",
      position: "Marketing Manager",
      yearsOfExp: 6,
      industry: "Marketing",
      bio: "Chuyên về Performance Marketing và E-commerce. Đã từng dẫn dắt nhiều chiến dịch Mega Sales. Hãy book lịch nếu bạn muốn tìm hiểu về ngành thương mại điện tử nhé.",
      services: [ServiceType.CV_REVIEW, ServiceType.QNA],
    },
    {
      email: "hai.le@momo.vn",
      fullName: "Lê Hoàng Hải",
      company: "MoMo",
      position: "Product Manager",
      yearsOfExp: 4,
      industry: "Product",
      bio: "Từ Data Analyst chuyển sang Product Manager. Mình hiểu rõ những khó khăn của các bạn trái ngành và sẵn sàng hỗ trợ bạn định hướng lộ trình phát triển.",
      services: [ServiceType.MOCK_INTERVIEW, ServiceType.QNA],
    },
    {
      email: "tien.do@techcombank.com.vn",
      fullName: "Đỗ Cẩm Tiên",
      company: "Techcombank",
      position: "Data Analyst",
      yearsOfExp: 3,
      industry: "Finance",
      bio: "Data is the new oil! Mình làm việc với SQL, Python và PowerBI mỗi ngày. Nhận review CV và portfolio data cho các bạn mới ra trường.",
      services: [ServiceType.CV_REVIEW],
    },
    {
      email: "dung.pham@fpt.com",
      fullName: "Phạm Quang Dũng",
      company: "FPT Software",
      position: "DevOps Engineer",
      yearsOfExp: 7,
      industry: "IT",
      bio: "Chứng chỉ AWS Solutions Architect & CKA. Kinh nghiệm triển khai CI/CD và Cloud cho các dự án outsource lớn. Nhận hướng dẫn định hướng Cloud/DevOps.",
      services: [ServiceType.QNA],
    },
    {
      email: "phuong.ho@vinhomes.vn",
      fullName: "Hồ Mai Phượng",
      company: "Vinhomes",
      position: "HR Specialist",
      yearsOfExp: 8,
      industry: "HR",
      bio: "Mình là người trực tiếp cầm trịch các vòng phỏng vấn văn hóa và deal lương. Biết rõ nhà tuyển dụng cần gì ở một chiếc CV. Let's talk!",
      services: [ServiceType.CV_REVIEW, ServiceType.MOCK_INTERVIEW],
    },
    {
      email: "tri.vo@begroup.vn",
      fullName: "Võ Minh Trí",
      company: "Be Group",
      position: "UI/UX Designer",
      yearsOfExp: 4,
      industry: "Design",
      bio: "Yêu cái đẹp và sự tiện dụng. Mình nhận review Portfolio và case study thiết kế UX cho các bạn chuẩn bị apply vào các công ty tech.",
      services: [ServiceType.CV_REVIEW, ServiceType.QNA],
    },
    {
      email: "tu.phan@vinamilk.com.vn",
      fullName: "Phan Tuấn Tú",
      company: "Vinamilk",
      position: "Sales Manager",
      yearsOfExp: 10,
      industry: "Sales",
      bio: "Bán hàng B2B và quản lý kênh phân phối FMCG. Sẽ giúp các bạn rèn luyện kỹ năng giao tiếp và thuyết phục trong buổi phỏng vấn.",
      services: [ServiceType.MOCK_INTERVIEW],
    },
    {
      email: "thuy.dinh@mbbank.com.vn",
      fullName: "Đinh Thu Thủy",
      company: "MB Bank",
      position: "Business Analyst",
      yearsOfExp: 3,
      industry: "Finance",
      bio: "BA trong ngành tài chính ngân hàng. Mình thường xuyên viết requirement và làm việc với team dev. Bạn nào muốn theo đuổi nghề BA thì book mình nhé.",
      services: [ServiceType.CV_REVIEW, ServiceType.QNA],
    },
    {
      email: "dung.trinh@zalo.me",
      fullName: "Trịnh Tuấn Dũng",
      company: "Zalo",
      position: "Frontend Developer",
      yearsOfExp: 4,
      industry: "IT",
      bio: "Chuyên gia về ReactJS, Vue và hiệu suất giao diện (Web Performance). Rất hoan nghênh các bạn review code frontend hoặc hỏi đáp tech stack.",
      services: [ServiceType.CV_REVIEW, ServiceType.MOCK_INTERVIEW, ServiceType.QNA],
    },
  ];

  const now = new Date();

  for (const mData of mentorsData) {
    // 2. Tạo Mentor
    const mentorUser = await prisma.user.upsert({
      where: { email: mData.email },
      update: {},
      create: {
        email: mData.email,
        passwordHash,
        fullName: mData.fullName,
        role: Role.MENTOR,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          mData.fullName
        )}&background=random`,
        mentorProfile: {
          create: {
            company: mData.company,
            position: mData.position,
            yearsOfExp: mData.yearsOfExp,
            industry: mData.industry,
            bio: mData.bio,
            isApproved: true,
            services: mData.services,
          },
        },
      },
      include: { mentorProfile: true },
    });

    // 3. Tạo Slot rảnh ngẫu nhiên (mỗi mentor có 2-5 slot trong 7 ngày tới)
    if (mentorUser.mentorProfile) {
      const numberOfSlots = Math.floor(Math.random() * 4) + 2; // 2 đến 5 slots
      
      const slotsToCreate = [];
      for (let i = 0; i < numberOfSlots; i++) {
        const dayOffset = Math.floor(Math.random() * 7) + 1; // 1 đến 7 ngày tới
        const hour = Math.floor(Math.random() * 10) + 9; // 9h sáng đến 18h
        
        const start = new Date(now);
        start.setDate(start.getDate() + dayOffset);
        start.setHours(hour, (Math.random() > 0.5 ? 30 : 0), 0, 0); // Phút 00 hoặc 30
        
        const end = new Date(start);
        end.setMinutes(end.getMinutes() + 30); // 30 phút mỗi slot
        
        slotsToCreate.push({
          startTime: start,
          endTime: end,
          mentorProfileId: mentorUser.mentorProfile.id,
        });
      }

      await prisma.slot.createMany({
        data: slotsToCreate,
      });
    }
  }

  console.log(`✅ Đã tạo thành công ${mentorsData.length} Mentors cùng với các slots rảnh ngẫu nhiên.`);
  console.log("Sử dụng bất kỳ email nào phía trên với password: 'password123' để đăng nhập.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
