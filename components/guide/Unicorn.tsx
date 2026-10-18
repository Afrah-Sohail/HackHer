import type { ReactNode } from "react";

export function UnicornAvatar({
  size = 56,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id="unicorn-horn" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#f0c36a" />
          <stop offset="1" stopColor="#fff1b8" />
        </linearGradient>
      </defs>

      {/* mane */}
      <circle cx="17" cy="27" r="8.5" fill="#ff9ad5" />
      <circle cx="12" cy="38" r="7.5" fill="#b08cff" />
      <circle cx="18" cy="48" r="7" fill="#8ae7ff" />

      {/* horn (drawn first so the head covers its base) */}
      <path d="M30 27 L36.5 2 L40.5 28 Z" fill="url(#unicorn-horn)" stroke="#e5ad45" strokeWidth="0.8" strokeLinejoin="round" />
      <path d="M32.6 17 L38.4 15 M34.2 11 L37.6 9.6" stroke="#e5ad45" strokeWidth="0.9" strokeLinecap="round" />

      {/* ear */}
      <path d="M23 25 L25 11 L33 22 Z" fill="#fff7ff" stroke="#d9c9ff" strokeWidth="1" strokeLinejoin="round" />
      <path d="M26 22 L27 16 L30 21 Z" fill="#ffc2e2" />

      {/* head and muzzle */}
      <ellipse cx="32" cy="37" rx="17" ry="16" fill="#fff7ff" stroke="#d9c9ff" strokeWidth="1" />
      <ellipse cx="45" cy="43" rx="9.5" ry="7.5" fill="#ffeef8" stroke="#ecd9f7" strokeWidth="0.8" />

      {/* forelock */}
      <path d="M26 26 C 27 19, 37 18, 39 26 C 34 22, 30 24, 26 26 Z" fill="#ff9ad5" />

      {/* face */}
      <circle cx="37" cy="35" r="2.7" fill="#2b1d4a" />
      <circle cx="38" cy="34" r="0.95" fill="#fff" />
      <circle cx="30" cy="43" r="3.2" fill="#ff9ad5" opacity="0.45" />
      <circle cx="51" cy="43.5" r="0.9" fill="#c79bd8" />
      <path d="M42 48 Q46 51 50 48" fill="none" stroke="#c79bd8" strokeWidth="1.1" strokeLinecap="round" />

      {/* sparkles */}
      <path d="M56 12 l1.2 3 3 1.2 -3 1.2 -1.2 3 -1.2 -3 -3 -1.2 3 -1.2 z" fill="#f0c36a" />
      <path d="M8 10 l0.8 2 2 0.8 -2 0.8 -0.8 2 -0.8 -2 -2 -0.8 2 -0.8 z" fill="#8ae7ff" />
    </svg>
  );
}

const TONE_CLASS = {
  neutral: "border-signal/30 bg-signal/10",
  happy: "border-signal/60 bg-signal/15",
  oops: "border-copper/50 bg-copper/10",
} as const;

export function UnicornSays({
  children,
  tone = "neutral",
  size = 72,
  big = false,
  small = false,
  className = "",
}: {
  children: ReactNode;
  tone?: keyof typeof TONE_CLASS;
  size?: number;
  /** Larger text and avatar, for the comments after a round. */
  big?: boolean;
  /** Tighter text and padding, for tight spots like the welcome screen. */
  small?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <UnicornAvatar size={big ? 96 : size} />
      <div
        className={`relative min-w-0 flex-1 rounded-2xl rounded-tl-sm border ${big ? "px-6 py-5 text-3xl leading-10" : small ? "px-3 py-2 text-base leading-6" : "px-4 py-3 text-lg leading-7"} text-ink ${TONE_CLASS[tone]}`}
      >
        {children}
      </div>
    </div>
  );
}
