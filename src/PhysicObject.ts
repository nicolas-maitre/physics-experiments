import { Camera, Vector2 } from "./camera";
import { drawCircle } from "./main";
export class PhysicCircle {
  constructor(
    public position: Vector2,
    public speed: Vector2 = { x: 0, y: 0 },
    public radius = 20,
    public color = "white"
  ) {}

  public get mass(): number {
    return Math.PI * this.radius * this.radius;
  }

  draw(cam: Camera) {
    drawCircle(cam, this.position, this.radius, this.color);
  }
  update(dt: number) {
    this.position.x += this.speed.x * dt;
    this.position.y += this.speed.y * dt;
  }

  attractTo(obj: PhysicCircle, dt: number) {}
}
