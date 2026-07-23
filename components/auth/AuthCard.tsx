import { Card } from "../ui/card";
import DotGrid from "../utils/DotGrid";

export default function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex-1 flex items-center justify-center px-6 py-20 overflow-hidden">
      <DotGrid />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 66% 56% at 50% 40%, rgba(79,70,229,0.18) 0%, rgba(79,70,229,0.08) 42%, transparent 78%)",
        }}
      />
      <Card
        className="relative w-full max-w-sm"
        style={{
          background: "linear-gradient(180deg, #131318 0%, #101014 100%)",
          boxShadow:
            "0 0 0 1px rgba(79,70,229,0.18), 0 24px 60px rgba(0,0,0,0.62), 0 0 56px rgba(79,70,229,0.1)",
        }}
      >
        {children}
      </Card>
    </div>
  );
}