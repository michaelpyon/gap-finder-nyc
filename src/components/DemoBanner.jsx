// Persistent honesty disclosure.
// This deployment runs on illustrative sample data, not live Census or
// OpenStreetMap measurements. This banner must appear on the homepage and
// on every screen that shows generated numbers so no one mistakes the
// demo for real measured data.

export default function DemoBanner({ className = '' }) {
  return (
    <div
      role="note"
      className={`flex items-start gap-2.5 bg-warning/10 border border-warning/40 rounded-lg px-3.5 py-2.5 ${className}`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="text-warning shrink-0 mt-0.5"
        aria-hidden="true"
      >
        <path
          d="M8 1L15 14H1L8 1Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path d="M8 6V9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="8" cy="11.6" r="0.85" fill="currentColor" />
      </svg>
      <p className="text-xs text-warning leading-relaxed">
        <span className="font-semibold">Illustrative demo data.</span> These are
        not real Census or OpenStreetMap measurements. Do not use this for a real
        lease or business decision.
      </p>
    </div>
  )
}
