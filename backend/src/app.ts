import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import mentorRoutes from "./routes/mentor.routes";
import slotRoutes from "./routes/slot.routes";
import bookingRoutes from "./routes/booking.routes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL ?? "*" }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Mount routes theo layered architecture
app.use("/api/auth", authRoutes);
app.use("/api/mentors", mentorRoutes);
// Nested route: /api/mentors/:mentorId/slots
app.use("/api/mentors/:mentorId/slots", slotRoutes);
app.use("/api/bookings", bookingRoutes);

// Error handler LUÔN đặt sau cùng
app.use(errorHandler);

export default app;
