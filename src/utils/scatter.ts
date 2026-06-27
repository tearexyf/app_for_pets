export interface ScatterPoint {
  x: number;
  y: number; 
  size: number; 
  rotate: number; 
}


function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}


export function generateScatterPositions(
  ids: number[],
  options?: { minSize?: number; maxSize?: number; padding?: number }
): Record<number, ScatterPoint> {
  const minSize = options?.minSize ?? 96;
  const maxSize = options?.maxSize ?? 128;
  const padding = options?.padding ?? 10; 

  const points: { id: number; x: number; y: number; size: number }[] = [];

  ids.forEach((id, index) => {
    const rand = mulberry32(id + index * 7919);
    let attempt = 0;
    let placed = false;
    let x = 50;
    let y = 50;
    const size = minSize + rand() * (maxSize - minSize);
    const sizePct = size / 4; 

    while (!placed && attempt < 60) {
      x = padding + rand() * (100 - padding * 2);
      y = padding + rand() * (100 - padding * 2);

      const collides = points.some((p) => {
        const dx = p.x - x;
        const dy = p.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = (p.size / 4 + sizePct) * 0.78;
        return dist < minDist;
      });

      if (!collides) placed = true;
      attempt++;
    }

    points.push({ id, x, y, size });
  });

  const result: Record<number, ScatterPoint> = {};
  points.forEach((p, i) => {
    const rand = mulberry32(p.id + i);
    result[p.id] = {
      x: p.x,
      y: p.y,
      size: p.size,
      rotate: (rand() - 0.5) * 14,
    };
  });

  return result;
}
