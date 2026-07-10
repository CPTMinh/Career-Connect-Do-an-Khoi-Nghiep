import { Routes, Route, Link } from "react-router-dom";
import { MentorListPage } from "./pages/MentorListPage";
import { MentorDetailPage } from "./pages/MentorDetailPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link to="/" className="text-xl font-bold text-primary">
            Career Connect
          </Link>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<MentorListPage />} />
        <Route path="/mentors/:id" element={<MentorDetailPage />} />
      </Routes>
    </div>
  );
}
