import { PrismaClient, User, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-default-key-for-dev";
const JWT_EXPIRES_IN = "7d";

export class AuthService {
  static async register(data: { email: string; passwordHash: string; fullName: string; role: Role }) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new Error("Email đã được sử dụng");
    }

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        fullName: data.fullName,
        role: data.role,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName)}&background=random`,
      },
    });

    const token = this.generateToken(user);
    return { user: this.sanitizeUser(user), token };
  }

  static async login(email: string, passwordHash: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("Email hoặc mật khẩu không đúng");
    }

    // In a real app we'd compare plaintext passwords with bcrypt.compare
    // But since the frontend might send plaintext, let's just check if it matches the hash if they send the seed password "password123".
    // For simplicity, we assume the frontend sends the plaintext password, so we use bcrypt to compare.
    const isPasswordValid = await bcrypt.compare(passwordHash, user.passwordHash);
    
    if (!isPasswordValid) {
      throw new Error("Email hoặc mật khẩu không đúng");
    }

    const token = this.generateToken(user);
    return { user: this.sanitizeUser(user), token };
  }

  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { mentorProfile: true }
    });
    if (!user) throw new Error("Không tìm thấy người dùng");
    return this.sanitizeUser(user);
  }

  private static generateToken(user: User) {
    return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
  }

  private static sanitizeUser(user: any) {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
