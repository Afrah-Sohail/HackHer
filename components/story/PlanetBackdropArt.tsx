import type { ReactNode } from "react";
import type { PlanetId } from "@/story/journey";

// Detailed clip-art planets for the level backdrops. Same flat style as the
// map icons, with more going on: craters, cloud bands, storms, rings, and
// soft sphere shading. Each is drawn in a 100 x 100 box centered on (50, 50).

type Crater = [number, number, number]; // x, y, radius

function Craters({
  list,
  dark,
  light,
}: {
  list: Crater[];
  dark: string;
  light: string;
}) {
  return (
    <g>
      {list.map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill={dark} opacity="0.42" />
          <circle
            cx={x - r * 0.12}
            cy={y - r * 0.12}
            r={r * 0.88}
            fill="none"
            stroke={light}
            strokeWidth={Math.max(0.35, r * 0.12)}
            opacity="0.5"
          />
          <circle
            cx={x + r * 0.2}
            cy={y + r * 0.2}
            r={r * 0.45}
            fill={dark}
            opacity="0.25"
          />
        </g>
      ))}
    </g>
  );
}

// A wavy horizontal band between two heights.
function band(y1: number, y2: number, wave = 2): string {
  return `M-5 ${y1} Q22 ${y1 - wave} 50 ${y1} T105 ${y1} L105 ${y2} Q78 ${y2 + wave} 50 ${y2} T-5 ${y2} Z`;
}

// Shading that makes a flat disc read as a sphere: darker limb, soft highlight.
function Sphere({ r, uid, glow }: { r: number; uid: string; glow: string }) {
  return (
    <>
      <defs>
        <radialGradient id={`limb${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.5" />
        </radialGradient>
        <radialGradient id={`shine${uid}`} cx="30%" cy="26%" r="55%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`glow${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0.86" stopColor={glow} stopOpacity="0.4" />
          <stop offset="1" stopColor={glow} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r={r * 1.14} fill={`url(#glow${uid})`} />
    </>
  );
}

function Shade({ r, uid }: { r: number; uid: string }) {
  return (
    <>
      <circle cx="50" cy="50" r={r} fill={`url(#limb${uid})`} />
      <circle cx="50" cy="50" r={r} fill={`url(#shine${uid})`} />
    </>
  );
}

function Mercury({ uid }: { uid: string }) {
  const R = 46;
  const craters: Crater[] = [
    [32, 36, 9],
    [64, 56, 12],
    [42, 70, 6],
    [68, 28, 5],
    [24, 58, 4.5],
    [55, 34, 3.5],
    [78, 46, 3],
    [36, 52, 3],
    [58, 78, 4],
    [20, 40, 3],
    [48, 22, 3],
    [72, 68, 3.5],
    [28, 76, 3],
  ];
  return (
    <g>
      <Sphere r={R} uid={uid} glow="#c9bcae" />
      <defs>
        <radialGradient id={`body${uid}`} cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#cfc4b8" />
          <stop offset="1" stopColor="#6b625b" />
        </radialGradient>
        <clipPath id={`clip${uid}`}>
          <circle cx="50" cy="50" r={R} />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r={R} fill={`url(#body${uid})`} />
      <g clipPath={`url(#clip${uid})`}>
        <g stroke="#e4dacd" strokeWidth="0.4" opacity="0.35">
          <path d="M64 56 L92 40" />
          <path d="M64 56 L96 62" />
          <path d="M64 56 L84 84" />
          <path d="M64 56 L40 92" />
          <path d="M64 56 L54 26" />
        </g>
        <Craters list={craters} dark="#4f4842" light="#e4dacd" />
      </g>
      <Shade r={R} uid={uid} />
    </g>
  );
}

function Venus({ uid }: { uid: string }) {
  const R = 46;
  return (
    <g>
      <Sphere r={R} uid={uid} glow="#ffd9a0" />
      <defs>
        <radialGradient id={`body${uid}`} cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#ffe9b8" />
          <stop offset="1" stopColor="#c7843a" />
        </radialGradient>
        <clipPath id={`clip${uid}`}>
          <circle cx="50" cy="50" r={R} />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r={R} fill={`url(#body${uid})`} />
      <g clipPath={`url(#clip${uid})`}>
        <path d={band(18, 26, 3)} fill="#fff3d6" opacity="0.5" />
        <path d={band(30, 36, 4)} fill="#b8702e" opacity="0.35" />
        <path d={band(40, 50, 3)} fill="#fff3d6" opacity="0.45" />
        <path d={band(54, 61, 4)} fill="#b8702e" opacity="0.4" />
        <path d={band(66, 72, 3)} fill="#fff3d6" opacity="0.4" />
        <path d={band(78, 84, 3)} fill="#b8702e" opacity="0.3" />
        <path
          d="M22 46 Q40 36 58 46 T92 40"
          fill="none"
          stroke="#fff8e6"
          strokeWidth="2.2"
          opacity="0.6"
          strokeLinecap="round"
        />
        <path
          d="M14 64 Q36 54 56 64 T96 58"
          fill="none"
          stroke="#a9611f"
          strokeWidth="1.8"
          opacity="0.45"
          strokeLinecap="round"
        />
        <path
          d="M30 28 Q52 20 74 30"
          fill="none"
          stroke="#fff8e6"
          strokeWidth="1.6"
          opacity="0.5"
          strokeLinecap="round"
        />
        <ellipse
          cx="62"
          cy="52"
          rx="9"
          ry="4"
          fill="#fff3d6"
          opacity="0.35"
          transform="rotate(-12 62 52)"
        />
      </g>
      <Shade r={R} uid={uid} />
    </g>
  );
}

function Mars({ uid }: { uid: string }) {
  const R = 46;
  const craters: Crater[] = [
    [66, 62, 5],
    [34, 66, 4],
    [58, 40, 3],
    [76, 48, 2.5],
    [28, 44, 3],
  ];
  return (
    <g>
      <Sphere r={R} uid={uid} glow="#ff9a6a" />
      <defs>
        <radialGradient id={`body${uid}`} cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#f69a6d" />
          <stop offset="1" stopColor="#8a2f1a" />
        </radialGradient>
        <clipPath id={`clip${uid}`}>
          <circle cx="50" cy="50" r={R} />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r={R} fill={`url(#body${uid})`} />
      <g clipPath={`url(#clip${uid})`}>
        <path
          d="M14 52 Q26 40 44 50 Q54 56 46 66 Q30 70 18 62 Z"
          fill="#6e2413"
          opacity="0.5"
        />
        <path
          d="M60 36 Q74 30 86 42 Q80 52 66 50 Z"
          fill="#6e2413"
          opacity="0.42"
        />
        <path
          d="M30 56 Q46 52 70 60"
          fill="none"
          stroke="#5c1d0f"
          strokeWidth="2.2"
          opacity="0.55"
          strokeLinecap="round"
        />
        <circle cx="38" cy="38" r="7" fill="#c75d3a" opacity="0.6" />
        <circle cx="38" cy="38" r="4" fill="#a14428" opacity="0.6" />
        <path d={band(70, 78, 3)} fill="#f4b08a" opacity="0.28" />
        <ellipse cx="50" cy="7" rx="22" ry="7" fill="#fff" opacity="0.9" />
        <ellipse cx="50" cy="94" rx="14" ry="4" fill="#fff" opacity="0.6" />
        <Craters list={craters} dark="#6e2413" light="#ffc7a3" />
      </g>
      <Shade r={R} uid={uid} />
    </g>
  );
}

function Jupiter({ uid }: { uid: string }) {
  const R = 46;
  return (
    <g>
      <Sphere r={R} uid={uid} glow="#f0d2a8" />
      <defs>
        <clipPath id={`clip${uid}`}>
          <circle cx="50" cy="50" r={R} />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r={R} fill="#e4c39a" />
      <g clipPath={`url(#clip${uid})`}>
        <path d={band(10, 17, 2)} fill="#c98f5a" opacity="0.8" />
        <path d={band(17, 24, 2)} fill="#f2ddc0" />
        <path d={band(24, 31, 2.5)} fill="#b8763f" opacity="0.9" />
        <path d={band(31, 38, 2)} fill="#f6e6cc" />
        <path d={band(38, 45, 3)} fill="#a8663a" opacity="0.95" />
        <path d={band(45, 52, 2)} fill="#f2ddc0" />
        <path d={band(52, 58, 3)} fill="#c98f5a" opacity="0.85" />
        <path d={band(58, 66, 2)} fill="#f6e6cc" />
        <path d={band(66, 73, 3)} fill="#b8763f" opacity="0.8" />
        <path d={band(73, 80, 2)} fill="#f2ddc0" />
        <path d={band(80, 90, 2)} fill="#c98f5a" opacity="0.7" />
        <ellipse cx="64" cy="60" rx="13" ry="7" fill="#b5532f" />
        <ellipse cx="64" cy="60" rx="9.5" ry="4.8" fill="#c2412d" />
        <ellipse cx="64" cy="60" rx="4.5" ry="2.2" fill="#e07a52" />
        <path
          d="M46 56 Q56 52 66 54 Q56 50 44 52"
          fill="none"
          stroke="#f6e6cc"
          strokeWidth="1.2"
          opacity="0.7"
        />
        <ellipse cx="30" cy="40" rx="4" ry="2" fill="#fff4e0" opacity="0.8" />
        <ellipse
          cx="42"
          cy="72"
          rx="3.4"
          ry="1.7"
          fill="#fff4e0"
          opacity="0.75"
        />
        <ellipse cx="78" cy="34" rx="3" ry="1.5" fill="#fff4e0" opacity="0.7" />
      </g>
      <Shade r={R} uid={uid} />
    </g>
  );
}

function Saturn({ uid }: { uid: string }) {
  const R = 28;
  const rings: { rx: number; w: number; color: string; opacity: number }[] = [
    { rx: 36, w: 3.4, color: "#a89270", opacity: 0.7 },
    { rx: 41, w: 5.2, color: "#e6d2a2", opacity: 0.95 },
    { rx: 46, w: 2.4, color: "#c4ab7c", opacity: 0.8 },
    { rx: 50, w: 3.2, color: "#d8c394", opacity: 0.85 },
    { rx: 54, w: 1.2, color: "#b9a37c", opacity: 0.6 },
  ];
  const ry = (rx: number) => rx * 0.27;
  const top = (rx: number) =>
    `M${50 - rx} 50 A${rx} ${ry(rx)} 0 0 1 ${50 + rx} 50`;
  const bottom = (rx: number) =>
    `M${50 - rx} 50 A${rx} ${ry(rx)} 0 0 0 ${50 + rx} 50`;
  return (
    <g>
      <Sphere r={R} uid={uid} glow="#f5e2ae" />
      <defs>
        <radialGradient id={`body${uid}`} cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#fbeab6" />
          <stop offset="1" stopColor="#c9a25a" />
        </radialGradient>
        <clipPath id={`clip${uid}`}>
          <circle cx="50" cy="50" r={R} />
        </clipPath>
      </defs>
      <g transform="rotate(-18 50 50)">
        {rings.map((ring) => (
          <path
            key={`b${ring.rx}`}
            d={top(ring.rx)}
            fill="none"
            stroke={ring.color}
            strokeWidth={ring.w}
            opacity={ring.opacity * 0.8}
          />
        ))}
      </g>
      <circle cx="50" cy="50" r={R} fill={`url(#body${uid})`} />
      <g clipPath={`url(#clip${uid})`}>
        <path d={band(30, 36, 2)} fill="#c3984f" opacity="0.45" />
        <path d={band(40, 46, 2)} fill="#fff3d0" opacity="0.45" />
        <path d={band(52, 58, 2)} fill="#b58c45" opacity="0.4" />
        <path d={band(62, 67, 2)} fill="#fff3d0" opacity="0.4" />
        <path d={band(70, 76, 2)} fill="#b58c45" opacity="0.3" />
        <ellipse cx="42" cy="46" rx="4" ry="1.6" fill="#fff8e0" opacity="0.5" />
        <g transform="rotate(-18 50 50)">
          <path
            d={`M${50 - 38} 50 A38 ${ry(38)} 0 0 0 ${50 + 38} 50 L${50 + 38} 56 L${50 - 38} 56 Z`}
            fill="#000"
            opacity="0.2"
          />
        </g>
      </g>
      <Shade r={R} uid={uid} />
      <g transform="rotate(-18 50 50)">
        {rings.map((ring) => (
          <path
            key={`f${ring.rx}`}
            d={bottom(ring.rx)}
            fill="none"
            stroke={ring.color}
            strokeWidth={ring.w}
            opacity={ring.opacity}
          />
        ))}
      </g>
    </g>
  );
}

function Uranus({ uid }: { uid: string }) {
  const R = 30;
  const rings = [38, 43, 48];
  const ry = (rx: number) => rx * 0.2;
  const top = (rx: number) =>
    `M${50 - rx} 50 A${rx} ${ry(rx)} 0 0 1 ${50 + rx} 50`;
  const bottom = (rx: number) =>
    `M${50 - rx} 50 A${rx} ${ry(rx)} 0 0 0 ${50 + rx} 50`;
  return (
    <g>
      <Sphere r={R} uid={uid} glow="#bff4ff" />
      <defs>
        <radialGradient id={`body${uid}`} cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#e2fcff" />
          <stop offset="1" stopColor="#5fa8b8" />
        </radialGradient>
        <clipPath id={`clip${uid}`}>
          <circle cx="50" cy="50" r={R} />
        </clipPath>
      </defs>
      <g transform="rotate(-82 50 50)">
        {rings.map((rx, i) => (
          <path
            key={`b${rx}`}
            d={top(rx)}
            fill="none"
            stroke="#cdeff5"
            strokeWidth={i === 1 ? 1.8 : 1}
            opacity="0.5"
          />
        ))}
      </g>
      <circle cx="50" cy="50" r={R} fill={`url(#body${uid})`} />
      <g clipPath={`url(#clip${uid})`}>
        <path d={band(26, 31, 2)} fill="#fff" opacity="0.18" />
        <path d={band(38, 43, 2)} fill="#3f8ea0" opacity="0.16" />
        <path d={band(50, 56, 2)} fill="#fff" opacity="0.16" />
        <path d={band(62, 67, 2)} fill="#3f8ea0" opacity="0.14" />
        <ellipse cx="50" cy="27" rx="18" ry="5" fill="#fff" opacity="0.22" />
      </g>
      <Shade r={R} uid={uid} />
      <g transform="rotate(-82 50 50)">
        {rings.map((rx, i) => (
          <path
            key={`f${rx}`}
            d={bottom(rx)}
            fill="none"
            stroke="#dff7fb"
            strokeWidth={i === 1 ? 2 : 1.1}
            opacity="0.85"
          />
        ))}
      </g>
    </g>
  );
}

const ART: Record<PlanetId, (props: { uid: string }) => ReactNode> = {
  mercury: Mercury,
  venus: Venus,
  mars: Mars,
  jupiter: Jupiter,
  saturn: Saturn,
  uranus: Uranus,
};

export function PlanetBackdropArt({ id, uid }: { id: PlanetId; uid: string }) {
  const Art = ART[id];
  return <Art uid={uid} />;
}
