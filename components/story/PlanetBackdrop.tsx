import type { PlanetId } from "@/story/journey";
import { PlanetBackdropArt } from "./PlanetBackdropArt";

// Radius of each planet's body inside the 100 x 100 clip-art box.
const BODY_RADIUS: Record<PlanetId, number> = {
  mercury: 46,
  venus: 46,
  mars: 46,
  jupiter: 46,
  saturn: 30,
  uranus: 32,
};

// Detailed clip-art planets (a richer cousin of the map icons), drawn huge with the planet's center in
// the bottom-left corner, as if the camera were sitting on it. It stays fixed
// behind the page.
export function PlanetBackdrop({ planet }: { planet: PlanetId }) {
  // How big the planet's body is on screen, and the matching art box.
  const radius = "max(70vh, 56vw)";
  const size = `calc(${radius} * ${100 / BODY_RADIUS[planet]})`;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute overflow-visible"
        style={{
          width: size,
          height: size,
          left: `calc(${size} / -2)`,
          bottom: `calc(${size} / -2)`,
        }}
      >
        <PlanetBackdropArt id={planet} uid="-backdrop" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-void/25 to-void/60" />
    </div>
  );
}
