import type { PlanetId } from "@/story/journey";

// NASA photos of each planet. cx, cy and r describe the planet's disk in the
// photo's own pixels, so the backdrop can put its center in the screen corner.
export type PlanetPhoto = {
  src: string;
  width: number;
  height: number;
  cx: number;
  cy: number;
  r: number;
  /** Hide part of the photo (CSS inset), for photos with two views in one. */
  clip?: string;
  /** How far past the disk to keep the photo (default 1.01 times r). */
  keep?: number;
  /** Mirror the photo, so the lit side faces into the screen. */
  flip?: boolean;
  /** Draw Saturn-style rings around the planet (the photo has none in view). */
  rings?: boolean;
  credit: string;
};

export const PLANET_PHOTOS: Record<PlanetId, PlanetPhoto> = {
  mercury: { src: "/planets/mercury.jpg", width: 840, height: 1738, cx: 0, cy: 870, r: 800, credit: "NASA/JHUAPL/Carnegie (MESSENGER)" },
  venus: { src: "/planets/venus.jpg", width: 2245, height: 1096, cx: 526, cy: 547, r: 429, clip: "inset(0 51% 0 0)", credit: "NASA/JPL-Caltech (Mariner 10)" },
  mars: { src: "/planets/mars.jpg", width: 500, height: 500, cx: 250, cy: 252, r: 222, credit: "NASA/ESA/Hubble" },
  jupiter: { src: "/planets/jupiter.jpg", width: 1024, height: 1280, cx: 705, cy: 640, r: 595, flip: true, credit: "NASA/JPL/Space Science Institute (Cassini)" },
  saturn: { src: "/planets/saturn.jpg", width: 1001, height: 1628, cx: 749, cy: 814, r: 706, flip: true, rings: true, credit: "NASA/JPL/Space Science Institute (Cassini)" },
  uranus: { src: "/planets/uranus.jpg", width: 1280, height: 1280, cx: 635, cy: 640, r: 520, credit: "NASA/JPL-Caltech (Voyager 2)" },
};
