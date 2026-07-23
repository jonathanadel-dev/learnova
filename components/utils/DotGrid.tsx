export default function DotGrid() {
    return(
        <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden"
            style={{
                backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)`,
                backgroundSize: "28px 28px",
            }}
        />
    )
}