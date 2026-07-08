import { ArrowRight } from "lucide-react";
import MockCurriculumCard from "./MockCurriculumCard";
import LinkButton from "../utils/LinkButton";

export default function Hero(){
    return(
        <main className="flex flex-col overflow-hidden">
    
            {/* Hero */}
            <section className="relative min-h-[88vh] flex items-center">
                
                {/* Dot Grid */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 overflow-hidden"
                    style={{
                        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)`,
                        backgroundSize: "28px 28px",
                    }}
                />
                {/* Hero glow */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 overflow-hidden"
                    style={{
                        background: `
                            radial-gradient(ellipse 70% 60% at 15% 25%, rgba(79,70,229,0.18) 0%, transparent 70%),
                            radial-gradient(ellipse 40% 40% at 80% 10%, rgba(245,158,11,0.07) 0%, transparent 60%)
                        `,
                    }}
                />

                <div className="relative max-w-6xl mx-auto px-6 w-full py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 items-center">
                        {/* Left: text */}
                        <div className="flex flex-col gap-8">

                            <div className="flex flex-col gap-4">
                                <h1
                                    className="text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-[#F0EFF4]"
                                    style={{ letterSpacing: "-0.03em" }}
                                >
                                    The LMS built for{" "}
                                    <span
                                        className="relative inline-block text-primary"
                                    >
                                        focused
                                    </span>{" "}
                                    learning
                                </h1>
                                <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                                    Instructors structure courses in chapters and lessons. Students
                                    enroll, consume content, and track their own progress — without
                                    the noise of a bloated platform.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <LinkButton href="/signup" variant="default" height="14">
                                    <span className="inline-flex items-center gap-2">
                                        Start For Free
                                        <ArrowRight size={16} />
                                    </span>
                                </LinkButton>
                            </div>

                        </div>

                        {/* Right: mock UI */}
                        <div className="hidden lg:flex justify-end">
                            <div className="relative">
                                {/* Glow behind card */}
                                <div
                                    className="absolute inset-0 rounded-2xl blur-2xl"
                                    style={{ background: "rgba(79,70,229,0.2)", transform: "scale(0.9) translateY(10px)" }}
                                />
                                <MockCurriculumCard />
                            </div>
                        </div>

                    </div>
                </div>

            </section>

            {/* Feature row */}
            <section
                className="border-t"
                style={{ borderColor: "rgba(255,255,255,0.06)", background: "#111113" }}
            >
                <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            label: "Structured curriculum",
                            body: "Organize content into chapters and lessons. Mix text and video with a clean editor that stays out of your way.",
                            tag: null,
                        },
                        {
                            label: "Zero-friction enrollment",
                            body: "Students browse the catalog and enroll in one click. No payment gates, no waitlists, no approval queues.",
                            tag: "Free for students",
                        },
                        {
                            label: "Progress at a glance",
                            body: "Per-lesson completion tracking so students know exactly where they are and instructors see engagement clearly.",
                            tag: null,
                        }
                    ].map((f) => (
                        <div key={f.label} className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-foreground">{f.label}</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold text-foreground tracking-tight">
                    Ready to build your first course?
                    </h2>
                    <p className="text-sm text-muted-foreground">It takes minutes to set up. No credit card.</p>
                </div>
                <LinkButton href="/signup" variant="default" height="14">
                    Create an account <ArrowRight size={14} />
                </LinkButton>
                </div>
            </section>

        </main>
    )
};