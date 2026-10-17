import type { PlanetId } from "@/story/journey";
import { PLANET_PHOTOS } from "@/story/planet-photos";

// A zoomed-in NASA photo with the planet's center in the bottom-left corner,
// as if the camera were sitting on the planet. It stays fixed behind the page.
export function PlanetBackdrop({ planet }: { planet: PlanetId }) {
  const photo = PLANET_PHOTOS[planet];
  // How big the planet's radius is on screen.
  const radius = "max(80vh, 65vw)";
  const scale = `(${radius} / ${photo.r})`;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
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
