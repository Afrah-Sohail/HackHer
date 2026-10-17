// Geometry for the squiggly journey path: six planets plus Home at the end.
// Everything (the drawn path, the planets and the flying rocket) uses these
// same curves, so the rocket follows the line exactly.

export type Layout = "wide" | "tall";
export type Pt = { x: number; y: number };
export type Seg = [Pt, Pt, Pt, Pt];

export const NODE_COUNT = 7; // 6 planets + Home
export const PLANET_RADIUS = 30;

export const VIEW: Record<Layout, { w: number; h: number }> = {
  wide: { w: 1000, h: 290 },
  tall: { w: 360, h: 780 },
};

export function nodes(layout: Layout): Pt[] {
  if (layout === "wide") {
    const ys = [180, 95, 180, 95, 180, 95, 150];
    return ys.map((y, i) => ({ x: 85 + i * 138, y }));
  }
  const xs = [110, 250, 110, 250, 110, 250, 180];
  return xs.map((x, i) => ({ x, y: 75 + i * 105 }));
}

// An S-shaped curve between two neighbouring nodes.
export function segment(layout: Layout, index: number): Seg {
  const all = nodes(layout);
  const a = all[index];
  const b = all[index + 1];
  if (layout === "wide") {
    const dx = (b.x - a.x) / 2;
    return [a, { x: a.x + dx, y: a.y }, { x: b.x - dx, y: b.y }, b];
  }
  const dy = (b.y - a.y) / 2;
  return [a, { x: a.x, y: a.y + dy }, { x: b.x, y: b.y - dy }, b];
}

export function segmentPath(layout: Layout, index: number): string {
  const [a, c1, c2, b] = segment(layout, index);
  return `M ${a.x} ${a.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${b.x} ${b.y}`;
}

export function bezier(seg: Seg, t: number): Pt {
  const [p0, p1, p2, p3] = seg;
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return {
    x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
  };
}

/** Rotation in degrees (clockwise from "up") of the direction of travel at t. */
export function heading(seg: Seg, t: number): number {
  const [p0, p1, p2, p3] = seg;
  const u = 1 - t;
  const dx =
    3 * u * u * (p1.x - p0.x) + 6 * u * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x);
  const dy =
    3 * u * u * (p1.y - p0.y) + 6 * u * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y);
  return (Math.atan2(dx, -dy) * 180) / Math.PI;
}
