import { Link } from "react-router-dom";
import { MentorSummary } from "../types";

const SERVICE_LABEL: Record<string, string> = {
  CV_REVIEW: "Review CV",
  MOCK_INTERVIEW: "Mock Interview",
  QNA: "Q&A định hướng",
};

export function MentorCard({ mentor }: { mentor: MentorSummary }) {
  return (
    <Link
      to={`/mentors/${mentor.id}`}
      className="block rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3">
        <img
          src={mentor.user.avatarUrl ?? "https://api.dicebear.com/7.x/initials/svg?seed=" + mentor.user.fullName}
          alt={mentor.user.fullName}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-gray-900">{mentor.user.fullName}</p>
          <p className="text-sm text-gray-500">
            {mentor.position} @ {mentor.company}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {mentor.services.map((s) => (
          <span
            key={s}
            className="text-xs bg-primary/10 text-primary rounded-full px-2 py-1"
          >
            {SERVICE_LABEL[s] ?? s}
          </span>
        ))}
      </div>
    </Link>
  );
}
