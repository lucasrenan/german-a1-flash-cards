/**
 * A small geometric icon set drawn to match Space Grotesk's construction:
 * flat 1.75 strokes, round joins, circles that are actually circles.
 * Deliberately sparse — icons appear only where a label alone would not fit.
 */

interface IconProps {
  className?: string
}

function Svg({ className = 'w-5 h-5', children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function SpeakerIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M11 5 6.5 9H3.5v6h3L11 19V5Z" />
      <path d="M15 9.5a3.5 3.5 0 0 1 0 5" />
      <path d="M17.8 6.5a7.5 7.5 0 0 1 0 11" />
    </Svg>
  )
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="m9.5 5 7 7-7 7" />
    </Svg>
  )
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="m5 9.5 7 7 7-7" />
    </Svg>
  )
}

export function ArrowLeftIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M19 12H5" />
      <path d="m11 6-6 6 6 6" />
    </Svg>
  )
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </Svg>
  )
}

/** Two arrows chasing each other — "turn this card over". */
export function FlipIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 9.5a6.5 6.5 0 0 1 11-4.7l2.5 2.2" />
      <path d="M20 14.5a6.5 6.5 0 0 1-11 4.7L6.5 17" />
      <path d="M17.5 3.5V7h-3.5M6.5 20.5V17h3.5" />
    </Svg>
  )
}

export function CloseIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="m6 6 12 12M18 6 6 18" />
    </Svg>
  )
}

/** Sliders rather than a gear — this panel is toggles and numbers. */
export function SlidersIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 8h10M18 8h2M4 16h4M12 16h8" />
      <circle cx="16" cy="8" r="2.25" />
      <circle cx="10" cy="16" r="2.25" />
    </Svg>
  )
}

export function SearchIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </Svg>
  )
}

export function ListIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M9 6h11M9 12h11M9 18h11" />
      <path d="M4 6h.01M4 12h.01M4 18h.01" />
    </Svg>
  )
}

export function ConjugationIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17M9.5 9.5v10" />
    </Svg>
  )
}

export function SunIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
    </Svg>
  )
}

export function MoonIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </Svg>
  )
}

export function MonitorIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="3" y="4.5" width="18" height="12" rx="2" />
      <path d="M9 20h6M12 16.5V20" />
    </Svg>
  )
}
