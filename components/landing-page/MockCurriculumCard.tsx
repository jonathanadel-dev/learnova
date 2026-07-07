import { CheckCircle2, Circle, Lock, PlayCircle } from "lucide-react";

export default function MockCurriculumCard() {
 const lessons = [
    { title: "Introduction & Setup", done: true, type: "text" },
    { title: "Core Concepts", done: true, type: "video" },
    { title: "Building Your First Project", done: false, type: "video", active: true },
    { title: "Advanced Patterns", done: false, type: "text" },
    { title: "Testing & Deployment", done: false, type: "text", locked: true },
  ];

  return (
    <div
      className="w-full max-w-sm rounded-2xl border overflow-hidden"
      style={{
        background: "#111113",
        borderColor: "rgba(255,255,255,0.08)",
        boxShadow: "0 0 0 1px rgba(79,70,229,0.15), 0 32px 64px rgba(0,0,0,0.5)",
      }}
    >
      {/* Card header */}
      <div className="px-5 pt-5 pb-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#71717A] mb-1">
              React Architecture Patterns
            </p>
            <p className="text-sm font-semibold text-[#F0EFF4]">Chapter 2 · Foundations</p>
          </div>
          {/* Progress ring */}
          <div className="relative w-10 h-10 shrink-0">
            <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
              <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="14"
                fill="none"
                stroke="#22C55E"
                strokeWidth="3"
                strokeDasharray="87.96"
                strokeDashoffset="52.77"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-green-400">
              40%
            </span>
          </div>
        </div>
      </div>

      {/* Lesson list */}
      <div className="px-4 py-3 flex flex-col gap-0.5">
        {lessons.map((lesson, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 px-2 py-2.5 rounded-lg transition-colors ${
              lesson.active
                ? "bg-[#4F46E5]/15 border border-[#4F46E5]/30"
                : "hover:bg-white/3"
            }`}
          >
            {lesson.locked ? (
              <Lock size={13} className="text-[#52525B] shrink-0" />
            ) : lesson.done ? (
              <CheckCircle2 size={14} className="text-green-400 shrink-0" />
            ) : (
              <Circle
                size={14}
                className={lesson.active ? "text-[#818CF8] shrink-0" : "text-[#52525B] shrink-0"}
              />
            )}
            <span
              className={`text-xs flex-1 truncate ${
                lesson.locked
                  ? "text-[#52525B]"
                  : lesson.done
                  ? "text-[#71717A] line-through decoration-[#52525B]"
                  : lesson.active
                  ? "text-[#A5B4FC] font-medium"
                  : "text-[#A1A1AA]"
              }`}
            >
              {lesson.title}
            </span>
            {lesson.type === "video" && !lesson.locked && (
              <PlayCircle size={11} className="text-[#52525B] shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Continue button */}
      <div className="px-4 pb-4 pt-1">
        <div
          className="w-full py-2.5 rounded-lg text-xs font-semibold text-center text-[#A5B4FC] border border-[#4F46E5]/40"
          style={{ background: "rgba(79,70,229,0.12)" }}
        >
          Continue learning →
        </div>
      </div>
    </div>
  );
}