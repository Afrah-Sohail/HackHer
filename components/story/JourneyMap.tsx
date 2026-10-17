"use client";

import { HOME_NAME, JOURNEY } from "@/story/journey";
import {
  PLANET_RADIUS,
  VIEW,
  bezier,
  heading,
  nodes,
  segment,
  segmentPath,
  type Layout,
} from "@/story/map-geometry";
import { RocketArt } from "./Characters";
import { PlanetArt } from "./Planet";

// Where the rocket is during a travel scene. t is progress (0..1) along the
// path segment from planet `from` to the next stop.
export type Travel = {
  from: number;
  t: number;
  flame: boolean;
  broken: boolean;
  boom: boolean;
  wobble: number;
};

type MapProps = {
  /** Planet where Blip is, or will play next. */
  current: number;
  completed: boolean[];
  /** Planets Blip has reached (the rest are greyed out). */
  unlocked: boolean[];
  onSelect?: (index: number) => void;
  travel?: Travel;
  /** Blip has made it to the end of the line. */
  atHome?: boolean;
};

const SPARKS = Array.from({ length: 10 }, (_, i) => {
  const angle = (i / 10) * Math.PI * 2;
  return { dx: Math.cos(angle) * 52, dy: Math.sin(angle) * 52 };
});

function Explosion({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} aria-hidden="true">
      <circle className="boom-core" r="26" fill="#fde68a" />
      <circle className="boom-ring" r="20" fill="none" stroke="#f97316" strokeWidth="7" />
      {SPARKS.map((spark, i) => (
        <circle
          key={i}
          className="boom-spark"
          r="5"
          fill={i % 2 ? "#f59e0b" : "#ef4444"}
          style={{ "--dx": `${spark.dx}px`, "--dy": `${spark.dy}px` } as React.CSSProperties}
        />
      ))}
      <text fontSize="44" textAnchor="middle" dominantBaseline="central" className="boom-core">
        💥
      </text>
    </g>
  );
}

function MapSvg({
  layout,
  className,
  current,
  completed,
  unlocked,
  onSelect,
  travel,
  atHome,
}: MapProps & { layout: Layout; className: string }) {
  const pts = nodes(layout);
  const { w, h } = VIEW[layout];
  const R = PLANET_RADIUS;
  const uid = `-${layout}`;

  let pose: { x: number; y: number; angle: number } | null = null;
  const trail: { x: number; y: number; r: number; o: number }[] = [];
  if (travel) {
    const seg = segment(layout, travel.from);
    const p = bezier(seg, travel.t);
    pose = { x: p.x, y: p.y, angle: heading(seg, travel.t) + travel.wobble };
    if (travel.broken) {
      for (let k = 1; k <= 5; k += 1) {
        const q = bezier(seg, Math.max(0, travel.t - 0.035 * k));
        trail.push({ x: q.x, y: q.y, r: 5 + k * 2.4, o: 0.55 - k * 0.08 });
      }
    }
  } else {
    const spot = pts[atHome ? 6 : Math.min(current, 5)];
    pose = { x: spot.x + R * 0.95, y: spot.y - R * 1.05, angle: 24 };
  }

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      role="img"
      aria-label="Blip's journey across the planets"
    >
      <defs>
        <filter id={`map-gray${uid}`}>
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>

      {Array.from({ length: 6 }, (_, i) => (
        <path
          key={i}
          d={segmentPath(layout, i)}
          fill="none"
          strokeWidth={completed[i] ? 6 : 5}
          strokeLinecap="round"
          strokeDasharray={completed[i] ? undefined : "1 14"}
          className={completed[i] ? "stroke-signal" : "stroke-ink-soft/60"}
        />
      ))}

      {JOURNEY.map((story, i) => {
        const p = pts[i];
        const reached = unlocked[i];
        const done = completed[i];
        const isCurrent = reached && !done && i === current;
        const clickable = Boolean(onSelect) && reached;
        const sideLabel = layout === "tall";
        const labelRight = p.x < w / 2;
        return (
          <g
            key={story.planet}
            transform={`translate(${p.x} ${p.y})`}
            role={clickable ? "button" : undefined}
            tabIndex={clickable ? 0 : undefined}
            aria-label={clickable ? `Go to ${story.name}` : undefined}
            onClick={clickable ? () => onSelect?.(i) : undefined}
            onKeyDown={
              clickable
                ? (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelect?.(i);
                    }
                  }
                : undefined
            }
            className={`group outline-none ${clickable ? "cursor-pointer" : ""}`}
          >
            {isCurrent && (
              <circle r={R + 8} fill="none" stroke="#f0c36a" strokeWidth="4" className="map-pulse" />
            )}
            <circle
              r={R + 6}
              fill="transparent"
              strokeWidth="3"
              className="stroke-transparent group-focus-visible:stroke-white"
            />
            <g
              transform={`translate(${-R} ${-R}) scale(${(R * 2) / 100})`}
              filter={reached ? undefined : `url(#map-gray${uid})`}
              opacity={reached ? 1 : 0.4}
            >
              <PlanetArt id={story.planet} uid={uid} />
            </g>
            {done && (
              <g transform={`translate(${R * 0.72} ${-R * 0.72})`}>
                <circle r="11" fill="#34d399" stroke="#0b0820" strokeWidth="2" />
                <text textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="700" fill="#0b0820">
                  ✓
                </text>
              </g>
            )}
            <text
              x={sideLabel ? (labelRight ? R + 16 : -(R + 16)) : 0}
              y={sideLabel ? 7 : R + 26}
              textAnchor={sideLabel ? (labelRight ? "start" : "end") : "middle"}
              fontSize={sideLabel ? 22 : 19}
              fontWeight={isCurrent ? 700 : 500}
              className={reached ? "fill-ink" : "fill-ink-soft/50"}
            >
              {story.name}
            </text>
          </g>
        );
      })}

      {/* Home: the end of the line */}
      <g transform={`translate(${pts[6].x} ${pts[6].y})`}>
        {atHome && <circle r="40" fill="none" stroke="#f0c36a" strokeWidth="4" className="map-pulse" />}
        <text
          fontSize="50"
          textAnchor="middle"
          dominantBaseline="central"
          opacity={atHome || completed[5] ? 1 : 0.4}
          filter={atHome || completed[5] ? undefined : `url(#map-gray${uid})`}
        >
          ⭐
        </text>
        <text
          x={layout === "tall" ? (pts[6].x < w / 2 ? 44 : -44) : 0}
          y={layout === "tall" ? 7 : 52}
          textAnchor={layout === "tall" ? "middle" : "middle"}
          fontSize={layout === "tall" ? 22 : 19}
          className={atHome || completed[5] ? "fill-copper" : "fill-ink-soft/50"}
          fontWeight={600}
        >
          {layout === "tall" ? "" : HOME_NAME}
        </text>
        {layout === "tall" && (
          <text
            x={0}
            y={50}
            textAnchor="middle"
            fontSize="22"
            fontWeight={600}
            className={atHome || completed[5] ? "fill-copper" : "fill-ink-soft/50"}
          >
            {HOME_NAME}
          </text>
        )}
      </g>

      {trail.map((puff, i) => (
        <circle key={i} cx={puff.x} cy={puff.y} r={puff.r} fill="#8d85a8" opacity={Math.max(puff.o, 0.08)} />
      ))}

      {pose && (
        <g transform={`translate(${pose.x} ${pose.y}) rotate(${pose.angle})`}>
          <g transform="translate(-16 -28) scale(0.8)">
            <RocketArt flame={travel?.flame ?? false} broken={travel?.broken ?? false} />
          </g>
        </g>
      )}

      {travel?.boom && pose && <Explosion key="boom" x={pose.x} y={pose.y} />}
    </svg>
  );
}

// A wide wavy line on bigger screens, a tall zig-zag on phones.
export function JourneyMap(props: MapProps) {
  return (
    <>
      <MapSvg {...props} layout="wide" className="hidden w-full md:block" />
      <MapSvg {...props} layout="tall" className="mx-auto block w-full max-w-sm md:hidden" />
    </>
  );
}
