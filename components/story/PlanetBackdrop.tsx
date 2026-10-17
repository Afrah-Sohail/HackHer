import type { PlanetId } from "@/story/journey";
import { PLANET_PHOTOS } from "@/story/planet-photos";

// A zoomed-in NASA photo with the planet's center in the bottom-left corner,
// as if the camera were sitting on the planet. It stays fixed behind the page.
// Ring structure in planet radii: [start, end, base opacity, rgb].
const RING_BANDS: [number, number, number, string][] = [
  [1.24, 1.53, 0.2, "128,114,98"], // C ring, faint
  [1.53, 1.95, 0.72, "216,198,168"], // B ring, brightest
  [1.95, 2.03, 0.04, "150,136,116"], // Cassini division
  [2.03, 2.21, 0.55, "194,178,152"], // A ring
  [2.21, 2.22, 0.08, "150,136,116"], // Encke gap
  [2.22, 2.27, 0.5, "190,174,148"],
];
const RING_OUTER = 2.3;

// Many thin stripes, with a fixed pseudo-random wobble, so the rings look like
// real ringlets instead of a few flat bands.
function ringGradient(): string {
  const stops: string[] = ["transparent 0%"];
  let n = 0;
  const wobble = () => {
    n += 1;
    const x = Math.sin(n * 12.9898) * 43758.5453;
    return (x - Math.floor(x)) * 2 - 1;
  };
  for (const [start, end, alpha, rgb] of RING_BANDS) {
    const step = 0.011;
    for (let r = start; r < end; r += step) {
      const a = Math.max(0, Math.min(1, alpha * (1 + wobble() * 0.28)));
      stops.push(
        `rgba(${rgb},${a.toFixed(2)}) ${((r / RING_OUTER) * 100).toFixed(2)}%`,
      );
    }
  }
  stops.push("transparent 100%");
  return `radial-gradient(ellipse closest-side, ${stops.join(", ")})`;
}

const RING_BACKGROUND = ringGradient();

// Rings drawn around the planet's center (the screen corner). They sit under
// the planet photo, so its disk hides the far side.
function Rings({ radius }: { radius: string }) {
  const outer = `calc(${radius} * ${RING_OUTER})`;
  return (
    <div
      className="absolute"
      style={{
        left: 0,
        bottom: 0,
        width: `calc(${outer} * 2)`,
        height: `calc(${outer} * 2 * 0.24)`,
        transform: "translate(-50%, 50%) rotate(-13deg)",
        filter: "blur(0.8px)",
        opacity: 0.85,
        background: RING_BACKGROUND,
      }}
    />
  );
}

export function PlanetBackdrop({ planet }: { planet: PlanetId }) {
  const photo = PLANET_PHOTOS[planet];
  // How big the planet's radius is on screen.
  const radius = `calc(max(80vh, 65vw) * ${photo.size ?? 1})`;
  const scale = `(${radius} / ${photo.r})`;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {photo.rings && <Rings radius={radius} />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.src}
        alt=""
        draggable={false}
        className="absolute max-w-none"
        style={{
          width: `calc(${photo.width} * ${scale})`,
          height: `calc(${photo.height} * ${scale})`,
          left: `calc(${-(photo.flip ? photo.width - photo.cx : photo.cx)} * ${scale})`,
          transform: photo.flip ? "scaleX(-1)" : undefined,
          bottom: `calc(${-(photo.height - photo.cy)} * ${scale})`,
          clipPath: photo.clip,
          // Fade out the black space around the planet so only it shows.
          maskImage: `radial-gradient(circle at calc(${photo.cx} * ${scale}) calc(${photo.cy} * ${scale}), #000 calc(${photo.r * (photo.keep ?? 1)} * ${scale} - 3px), transparent calc(${photo.r * (photo.keep ?? 1)} * ${scale}))`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-void/25 to-void/60" />
    </div>
  );
}
