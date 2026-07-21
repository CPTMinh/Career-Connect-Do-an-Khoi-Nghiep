import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, role } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: "Vui lòng cung cấp đủ thông tin (email, password, fullName)" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await AuthService.register({
      email,
      passwordHash,
      fullName,
      role: role || Role.MENTEE,
    });

    res.status(201).json({
      message: "Đăng ký thành công",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Vui lòng nhập email và mật khẩu" });
    }

    const result = await AuthService.login(email, password);
    res.json({
      message: "Đăng nhập thành công",
      data: result,
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    // req.user will be populated by auth middleware
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Chưa đăng nhập" });
    }

    const user = await AuthService.getUserById(userId);
    res.json({ data: user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
