import { Camera } from "./camera";
import { drawCircle } from "./main";
import { Vector2 } from "./utils";

const GRAVITY_CONST = 5;
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

    //handle objects too close
    if (dist < this.radius + obj.radius) {
      // this bumping shit is wrong
      // this.speed.x = -this.speed.x;
      // this.speed.y = -this.speed.y;
      return;
    }

    const angle = Math.atan2(diffY, diffX);

    // f = G * (m1*m2)/d**2
    const force = GRAVITY_CONST * ((obj.mass * this.mass) / distSqu);

    //f = m*a => a = f/m
    const acceleration = force / this.mass;

    const accX = Math.cos(angle) * acceleration;
    const accY = Math.sin(angle) * acceleration;

    this.speed.x -= accX * dt;
    this.speed.y -= accY * dt;
  }
}
