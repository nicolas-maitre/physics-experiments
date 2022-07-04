import { Camera, Vector2 } from "./camera";
import { drawCircle } from "./main";

export class PhysicCircle {
  public selected = false;
  public name = "PhysicCircle";
  constructor(
    public position: Vector2,
    public mass: number,
    public speed: Vector2 = { x: 0, y: 0 },
    public radius = 20,
    public color = "white"
  ) {}

  draw(cam: Camera) {
    drawCircle(
      cam,
      this.position,
      this.radius,
      this.selected ? "red" : this.color,
      "black",
      1
    );
  }
  update(dt: number) {
    this.position.x += this.speed.x * dt;
    this.position.y += this.speed.y * dt;
  }

  attractTo(obj: PhysicCircle, dt: number) {
    const diffX = this.position.x - obj.position.x;
    const diffY = this.position.y - obj.position.y;

    const distSqu = diffX ** 2 + diffY ** 2;
    const dist = Math.sqrt(distSqu);

    //bump when too close
    if (dist < this.radius + obj.radius) {
      // this shit is wrong
      // this.speed.x = -this.speed.x;
      // this.speed.y = -this.speed.y;
      return;
    }

    const angle = Math.atan2(diffY, diffX);

    const force = 60 * dt * ((obj.mass + this.mass) / distSqu);

    const accX = Math.cos(angle) * force;
    const accY = Math.sin(angle) * force;

    this.speed.x -= accX;
    this.speed.y -= accY;
  }
}
