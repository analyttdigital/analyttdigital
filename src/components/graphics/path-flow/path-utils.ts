export type Point = { x: number; y: number };

const dist = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y);

/** Point `d` pixels away from `from`, heading toward `to`. */
const toward = (from: Point, to: Point, d: number): Point => {
  const len = dist(from, to) || 1;
  return {
    x: from.x + ((to.x - from.x) / len) * d,
    y: from.y + ((to.y - from.y) / len) * d,
  };
};

/**
 * Offsets an ORTHOGONAL polyline (only horizontal / vertical segments) sideways
 * by `d` px using mitered corners. Positive `d` = left of travel direction.
 * This is what produces the parallel "rails" around the main path.
 */
export function offsetPolyline(points: Point[], d: number): Point[] {
  if (d === 0 || points.length < 2) return points;

  const normals: Point[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const len = dist(a, b) || 1;
    const ux = (b.x - a.x) / len;
    const uy = (b.y - a.y) / len;
    normals.push({ x: -uy, y: ux });
  }

  return points.map((p, i) => {
    const prev = normals[i - 1];
    const next = normals[i];
    let nx = 0;
    let ny = 0;
    if (prev) (nx += prev.x), (ny += prev.y);
    if (next) (nx += next.x), (ny += next.y);
    return { x: p.x + nx * d, y: p.y + ny * d };
  });
}

/** Converts a polyline into an SVG path string with rounded corners. */
export function toRoundedPath(points: Point[], radius: number): string {
  if (points.length === 0) return "";
  const f = (n: number) => +n.toFixed(2);
  let d = `M ${f(points[0].x)} ${f(points[0].y)}`;

  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const cur = points[i];
    const next = points[i + 1];
    const r = Math.min(radius, dist(prev, cur) / 2, dist(cur, next) / 2);
    const start = toward(cur, prev, r);
    const end = toward(cur, next, r);
    d += ` L ${f(start.x)} ${f(start.y)} Q ${f(cur.x)} ${f(cur.y)} ${f(end.x)} ${f(end.y)}`;
  }

  const last = points[points.length - 1];
  if (points.length > 1) d += ` L ${f(last.x)} ${f(last.y)}`;
  return d;
}
