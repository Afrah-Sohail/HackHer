// Blip the alien and his rocket, drawn as small inline SVGs.

export function Alien({ size = 64, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <defs>
        <radialGradient id="alien-skin" cx="40%" cy="30%" r="80%">
          <stop offset="0" stopColor="#a8f0a0" />
          <stop offset="1" stopColor="#3fb56a" />
        </radialGradient>
      </defs>
      {/* antennae */}
      <path d="M22 16 Q18 6 12 6" fill="none" stroke="#3fb56a" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M42 16 Q46 6 52 6" fill="none" stroke="#3fb56a" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="12" cy="6" r="3.5" fill="#f0c36a" />
      <circle cx="52" cy="6" r="3.5" fill="#8ae7ff" />
      {/* head */}
      <ellipse cx="32" cy="36" rx="23" ry="22" fill="url(#alien-skin)" />
      {/* eyes */}
      <ellipse cx="22" cy="34" rx="7" ry="9" fill="#10201a" />
      <ellipse cx="42" cy="34" rx="7" ry="9" fill="#10201a" />
      <circle cx="24" cy="30" r="2.4" fill="#fff" />
      <circle cx="44" cy="30" r="2.4" fill="#fff" />
      {/* cheeks and smile */}
      <circle cx="14" cy="46" r="3" fill="#ff9ad5" opacity="0.55" />
      <circle cx="50" cy="46" r="3" fill="#ff9ad5" opacity="0.55" />
      <path d="M26 49 Q32 54 38 49" fill="none" stroke="#10201a" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// A little rocket pointing up, drawn in a 40 x 70 box. `flame` shows the engine
// fire, `broken` shows cracks and smoke. RocketArt is just the shapes (so the
// journey map can place and rotate it); Rocket wraps it in its own <svg>.
export function RocketArt({ flame = false, broken = false }: { flame?: boolean; broken?: boolean }) {
  return (
    <g>
      {flame && (
        <g className="rocket-flame">
          <path d="M14 52 Q20 78 26 52 Z" fill="#f59e0b" />
          <path d="M17 52 Q20 68 23 52 Z" fill="#fde68a" />
        </g>
      )}
      {/* fins */}
      <path d="M10 40 L1 56 L12 52 Z" fill="#e11d48" />
      <path d="M30 40 L39 56 L28 52 Z" fill="#e11d48" />
      {/* body */}
      <path d="M20 2 C31 12 32 34 28 54 L12 54 C8 34 9 12 20 2 Z" fill="#f4f1ff" />
      <path d="M20 2 C26 8 28 14 28 18 L12 18 C12 14 14 8 20 2 Z" fill="#e11d48" />
      {/* window */}
      <circle cx="20" cy="28" r="5.5" fill="#8ae7ff" stroke="#6b5fb5" strokeWidth="1.5" />
      <circle cx="18.5" cy="26.5" r="1.6" fill="#fff" opacity="0.8" />
      {broken && (
        <g>
          <path d="M14 38 L19 43 L16 47 L21 52" fill="none" stroke="#3b2f63" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="12" cy="56" r="4" fill="#6b6480" opacity="0.7" />
          <circle cx="20" cy="60" r="5" fill="#7d7696" opacity="0.6" />
          <circle cx="28" cy="56" r="3.5" fill="#6b6480" opacity="0.7" />
        </g>
      )}
    </g>
  );
}

export function Rocket({
  size = 48,
  flame = false,
  broken = false,
  className = "",
}: {
  size?: number;
  flame?: boolean;
  broken?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 40 70"
      width={size * (40 / 70)}
      height={size}
      aria-hidden="true"
      className={`shrink-0 overflow-visible ${className}`}
    >
      <RocketArt flame={flame} broken={broken} />
    </svg>
  );
}
