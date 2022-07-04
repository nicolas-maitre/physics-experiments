import { Ctx } from "./main";

export interface Vector2 {
  x: number;
  y: number;
}

export class Camera {
  constructor(public ctx: Ctx, public position: Vector2 = { x: 0, y: 0 }) {}
  public project({ x, y }: Vector2) {
    return { x: this.position.x - x, y: this.position.y - y };
  }
  public unproject({ x, y }: Vector2): Vector2 {
    return { x: this.position.x - x, y: this.position.y - y };
  }
}

export function vec2(x: number, y: number): Vector2 {
  return { x, y };
}
