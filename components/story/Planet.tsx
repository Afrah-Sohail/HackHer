import type { PlanetId } from "@/story/journey";

// Planet art, drawn in a 100 x 100 box. `PlanetArt` is just the shapes so the
// journey map can place it anywhere; `Planet` wraps it in its own <svg>.
export function PlanetArt({ id, uid = "" }: { id: PlanetId; uid?: string }) {
  switch (id) {
    case "mercury":
      return (
        <g>
          <defs>
            <radialGradient id={`pl-mercury${uid}`} cx="35%" cy="30%" r="80%">
              <stop offset="0" stopColor="#c4b8ac" />
              <stop offset="1" stopColor="#6b625b" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="46" fill={`url(#pl-mercury${uid})`} />
          <circle cx="34" cy="38" r="8" fill="#5a524b" opacity="0.55" />
          <circle cx="64" cy="58" r="11" fill="#5a524b" opacity="0.5" />
          <circle cx="42" cy="68" r="5" fill="#5a524b" opacity="0.55" />
          <circle cx="68" cy="30" r="4" fill="#5a524b" opacity="0.5" />
        </g>
      );
    case "venus":
      return (
        <g>
          <defs>
            <radialGradient id={`pl-venus${uid}`} cx="35%" cy="30%" r="80%">
              <stop offset="0" stopColor="#ffe0a3" />
              <stop offset="1" stopColor="#c7843a" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="46" fill={`url(#pl-venus${uid})`} />
          <path d="M8 40 Q30 28 50 40 T92 38" fill="none" stroke="#fff3d6" strokeWidth="4" opacity="0.55" />
          <path d="M6 58 Q28 46 50 58 T94 56" fill="none" stroke="#b8702e" strokeWidth="4" opacity="0.45" />
          <path d="M14 74 Q34 64 52 74 T88 72" fill="none" stroke="#fff3d6" strokeWidth="3" opacity="0.4" />
        </g>
      );
    case "uranus":
      return (
        <g>
          <defs>
            <radialGradient id={`pl-uranus${uid}`} cx="35%" cy="30%" r="80%">
              <stop offset="0" stopColor="#d6fbff" />
              <stop offset="1" stopColor="#5fa8b8" />
            </radialGradient>
          </defs>
          <g transform="rotate(-80 50 50)">
            <ellipse cx="50" cy="50" rx="46" ry="10" fill="none" stroke="#bfeaf2" strokeWidth="3" opacity="0.5" />
          </g>
          <circle cx="50" cy="50" r="32" fill={`url(#pl-uranus${uid})`} />
          <g transform="rotate(-80 50 50)">
            <path d="M4 50 A46 10 0 0 0 96 50" fill="none" stroke="#d9f4f9" strokeWidth="3" />
          </g>
        </g>
      );
    case "mars":
      return (
        <g>
          <defs>
            <radialGradient id={`pl-mars${uid}`} cx="35%" cy="30%" r="80%">
              <stop offset="0" stopColor="#f4875a" />
              <stop offset="1" stopColor="#8a2f1a" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="46" fill={`url(#pl-mars${uid})`} />
          <ellipse cx="50" cy="12" rx="16" ry="5" fill="#fff" opacity="0.8" />
          <path d="M18 52 Q32 44 44 54 Q36 62 22 60 Z" fill="#6e2413" opacity="0.5" />
          <path d="M58 66 Q72 60 82 68 Q74 78 60 76 Z" fill="#6e2413" opacity="0.45" />
          <circle cx="66" cy="38" r="5" fill="#6e2413" opacity="0.4" />
        </g>
      );
    case "jupiter":
      return (
        <g>
          <defs>
            <clipPath id={`clip-jupiter${uid}`}>
              <circle cx="50" cy="50" r="46" />
            </clipPath>
          </defs>
          <circle cx="50" cy="50" r="46" fill="#e4c39a" />
          <g clipPath={`url(#clip-jupiter${uid})`}>
            <rect x="0" y="16" width="100" height="10" fill="#c98f5a" />
            <rect x="0" y="32" width="100" height="8" fill="#f2ddc0" />
            <rect x="0" y="44" width="100" height="12" fill="#b8763f" />
            <rect x="0" y="62" width="100" height="8" fill="#f2ddc0" />
            <rect x="0" y="74" width="100" height="10" fill="#c98f5a" />
            <ellipse cx="64" cy="58" rx="11" ry="6" fill="#c2412d" />
          </g>
          <circle cx="50" cy="50" r="46" fill="none" stroke="#8a5a30" strokeWidth="1.5" opacity="0.4" />
        </g>
      );
    case "saturn":
      return (
        <g>
          <defs>
            <radialGradient id={`pl-saturn${uid}`} cx="35%" cy="30%" r="80%">
              <stop offset="0" stopColor="#fbe7b0" />
              <stop offset="1" stopColor="#c9a25a" />
            </radialGradient>
          </defs>
          <g transform="rotate(-18 50 50)">
            <ellipse cx="50" cy="50" rx="48" ry="12" fill="none" stroke="#e7cf98" strokeWidth="5" opacity="0.55" />
          </g>
          <circle cx="50" cy="50" r="30" fill={`url(#pl-saturn${uid})`} />
          <path d="M22 44 Q50 36 78 44" fill="none" stroke="#b58c45" strokeWidth="3" opacity="0.5" />
          <path d="M22 58 Q50 50 78 58" fill="none" stroke="#fff3d0" strokeWidth="3" opacity="0.45" />
          <g transform="rotate(-18 50 50)">
            <path d="M2 50 A48 12 0 0 0 98 50" fill="none" stroke="#f2deaa" strokeWidth="5" />
          </g>
        </g>
      );
  }
}

export function Planet({
  id,
  size = 120,
  locked = false,
  className = "",
}: {
  id: PlanetId;
  size?: number;
  locked?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      className={`shrink-0 ${locked ? "opacity-40 grayscale" : ""} ${className}`}
    >
      <PlanetArt id={id} />
    </svg>
  );
}
