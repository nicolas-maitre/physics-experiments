export const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

export const sphereVolume = (radius: number) => (4 / 3) * Math.PI * radius ** 3;

export interface Vector2 {
  x: number;
  y: number;
}
export function vec2(x: number, y: number): Vector2 {
  return { x, y };
}
export function vec2Len(vector: Vector2): number {
  return Math.sqrt(vector.x ** 2 + vector.y ** 2);
}
