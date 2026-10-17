import type { PlanetId } from "@/story/journey";
import { PLANET_PHOTOS } from "@/story/planet-photos";

// A zoomed-in NASA photo with the planet's center in the bottom-left corner,
// as if the camera were sitting on the planet. It stays fixed behind the page.
// Rings drawn as banded ellipses around the planet's center (the screen corner).
// They sit under the planet photo, so its disk hides the far side.
function Rings({ radius }: { radius: string }) {
  const outer = `calc(${radius} * 2.45)`;
  return (
    <div
      className="absolute"
      style={{
        left: 0,
        bottom: 0,
        width: `calc(${outer} * 2)`,
        height: `calc(${outer} * 2 * 0.34)`,
        transform: "translate(-50%, 50%) rotate(-16deg)",
        filter: "blur(1.5px)",
        opacity: 0.9,
        background:
          "radial-gradient(ellipse closest-side, transparent 0 44%, rgba(120,100,80,0.0) 44% 49%, rgba(150,128,100,0.35) 49% 55%, rgba(205,180,140,0.55) 55% 62%, rgba(236,214,170,0.85) 62% 74%, rgba(222,198,155,0.8) 74% 80%, rgba(10,8,20,0.0) 80% 82%, rgba(214,190,150,0.7) 82% 90%, rgba(196,172,134,0.55) 90% 93%, rgba(200,176,138,0.6) 93% 98%, transparent 98%)",
      }}
    />
  );
}

export function PlanetBackdrop({ planet }: { planet: PlanetId }) {
  const photo = PLANET_PHOTOS[planet];
  // How big the planet's radius is on screen.
  const radius = "max(80vh, 65vw)";
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
