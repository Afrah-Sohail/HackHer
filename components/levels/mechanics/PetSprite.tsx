// A small sprite of one of the pets, drawn from its species and colour.

const FUR: Record<string, { base: string; dark: string; light: string }> = {
  orange: { base: "#f59e3b", dark: "#c9741a", light: "#ffd9a0" },
  brown: { base: "#9a6a47", dark: "#6b4429", light: "#d9b48f" },
  black: { base: "#3a3550", dark: "#1d1a2e", light: "#6a6585" },
  white: { base: "#f6f3ff", dark: "#cfc8e8", light: "#ffffff" },
};

export function PetSprite({
  species,
  color,
  size = 72,
  className = "",
}: {
  species: string;
  color: string;
  size?: number;
  className?: string;
}) {
  const fur = FUR[color] ?? FUR.white;
  const eye = color === "black" ? "#fde68a" : "#1a1530";

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role="img"
      aria-label={`${color} ${species}`}
      className={`shrink-0 ${className}`}
    >
      {/* ears (behind the head) */}
      {species === "cat" && (
        <>
          <path d="M12 26 L14 6 L28 18 Z" fill={fur.base} stroke={fur.dark} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M52 26 L50 6 L36 18 Z" fill={fur.base} stroke={fur.dark} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M16 20 L17 11 L23 17 Z" fill="#ffb3d1" />
          <path d="M48 20 L47 11 L41 17 Z" fill="#ffb3d1" />
        </>
      )}
      {species === "dog" && (
        <>
          <ellipse cx="12" cy="30" rx="8" ry="15" fill={fur.dark} transform="rotate(12 12 30)" />
          <ellipse cx="52" cy="30" rx="8" ry="15" fill={fur.dark} transform="rotate(-12 52 30)" />
        </>
      )}
      {species === "bunny" && (
        <>
          <ellipse cx="22" cy="14" rx="7" ry="15" fill={fur.base} stroke={fur.dark} strokeWidth="1.5" />
          <ellipse cx="42" cy="14" rx="7" ry="15" fill={fur.base} stroke={fur.dark} strokeWidth="1.5" />
          <ellipse cx="22" cy="15" rx="3.5" ry="10" fill="#ffb3d1" />
          <ellipse cx="42" cy="15" rx="3.5" ry="10" fill="#ffb3d1" />
        </>
      )}

      {/* head */}
      <circle cx="32" cy="38" r="22" fill={fur.base} stroke={fur.dark} strokeWidth="1.5" />
      {/* muzzle */}
      <ellipse cx="32" cy="46" rx="11" ry="8" fill={fur.light} />
      {/* eyes */}
      <circle cx="23" cy="36" r="3.4" fill={eye} />
      <circle cx="41" cy="36" r="3.4" fill={eye} />
      <circle cx="24.2" cy="34.8" r="1.1" fill="#fff" />
      <circle cx="42.2" cy="34.8" r="1.1" fill="#fff" />
      {/* nose and mouth */}
      <ellipse cx="32" cy="42.5" rx="3" ry="2.2" fill={species === "dog" ? "#1d1a2e" : "#ff8fb8"} />
      <path d="M32 44.5 Q32 49 27 49 M32 44.5 Q32 49 37 49" fill="none" stroke={fur.dark} strokeWidth="1.4" strokeLinecap="round" />
      {/* cheeks */}
      <circle cx="16" cy="45" r="3.5" fill="#ff9ad5" opacity="0.45" />
      <circle cx="48" cy="45" r="3.5" fill="#ff9ad5" opacity="0.45" />
      {/* whiskers for cats and bunnies */}
      {species !== "dog" && (
        <g stroke={fur.dark} strokeWidth="1" strokeLinecap="round" opacity="0.7">
          <path d="M18 43 L8 41 M18 46 L8 47" />
          <path d="M46 43 L56 41 M46 46 L56 47" />
        </g>
      )}
    </svg>
  );
}
