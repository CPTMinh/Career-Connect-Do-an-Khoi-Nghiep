import { useEffect, useState } from "react";
import { mentorApi } from "../api/mentor.api";
import { MentorSummary } from "../types";
import { MentorCard } from "../components/MentorCard";

export function MentorListPage() {
  const [mentors, setMentors] = useState<MentorSummary[]>([]);
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    mentorApi
      .search({ industry: industry || undefined })
      .then((res) => setMentors(res.items))
      .finally(() => setLoading(false));
  }, [industry]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Tìm Mentor</h1>

      <div className="mb-6">
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="">Tất cả lĩnh vực</option>
          <option value="IT">Công nghệ thông tin</option>
          <option value="Marketing">Marketing</option>
          <option value="Finance">Tài chính</option>
          <option value="HR">Nhân sự</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">Đang tải danh sách mentor...</p>
      ) : mentors.length === 0 ? (
        <p className="text-gray-500">Chưa có mentor nào phù hợp bộ lọc.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mentors.map((m) => (
            <MentorCard key={m.id} mentor={m} />
          ))}
        </div>
      )}
    </div>
  );
}
