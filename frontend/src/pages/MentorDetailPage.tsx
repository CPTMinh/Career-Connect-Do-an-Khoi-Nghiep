import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { mentorApi } from "../api/mentor.api";
import { apiClient } from "../api/client";
import { MentorDetail, Slot } from "../types";

export function MentorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [mentor, setMentor] = useState<MentorDetail | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    mentorApi.getById(id).then(setMentor);
    mentorApi.getAvailableSlots(id).then(setSlots);
  }, [id]);

  async function handleBook(slotId: string) {
    setBookingMessage(null);
    try {
      // TODO: thay menteeId cứng bằng user đang đăng nhập khi có Auth
      await apiClient.post("/bookings", {
        slotId,
        menteeId: "ca9d5904-a62c-4c1a-9226-fb155386a71f", // Hardcode ID của mentee mẫu trong DB
        serviceType: "CV_REVIEW",
      });
      setBookingMessage("Đặt lịch thành công! Kiểm tra email để xem link buổi hẹn.");
      setSlots((prev) => prev.filter((s) => s.id !== slotId));
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Đặt lịch thất bại, vui lòng thử lại.";
      setBookingMessage(message);
    }
  }

  if (!mentor) return <p className="p-6 text-gray-500">Đang tải thông tin mentor...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900">{mentor.user.fullName}</h1>
      <p className="text-gray-500">
        {mentor.position} @ {mentor.company} — {mentor.yearsOfExp} năm kinh nghiệm
      </p>
      <p className="mt-2 text-sm text-yellow-600">
        ⭐ {mentor.ratingAverage} ({mentor.ratingCount} đánh giá)
      </p>
      {mentor.bio && <p className="mt-4 text-gray-700">{mentor.bio}</p>}

      <h2 className="mt-8 text-lg font-semibold">Chọn lịch rảnh</h2>
      {slots.length === 0 ? (
        <p className="text-gray-500 mt-2">Mentor hiện chưa có slot rảnh.</p>
      ) : (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {slots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => handleBook(slot.id)}
              className="border border-primary text-primary rounded-md px-3 py-2 text-sm hover:bg-primary hover:text-white transition-colors"
            >
              {new Date(slot.startTime).toLocaleString("vi-VN", {
                weekday: "short",
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
              })}
            </button>
          ))}
        </div>
      )}

      {bookingMessage && <p className="mt-4 text-sm">{bookingMessage}</p>}
    </div>
  );
}
