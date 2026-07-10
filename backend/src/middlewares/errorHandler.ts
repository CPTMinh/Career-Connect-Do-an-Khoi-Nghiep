import { NextFunction, Request, Response } from "express";

// Class lỗi tuỳ chỉnh để Service layer throw kèm statusCode rõ ràng
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Bọc async controller để không cần try/catch lặp lại ở mỗi hàm
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Middleware bắt lỗi cuối cùng — đặt sau tất cả routes trong app.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || "Đã có lỗi xảy ra ở server";

  if (statusCode === 500) {
    // eslint-disable-next-line no-console
    console.error("[UNHANDLED ERROR]", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}
