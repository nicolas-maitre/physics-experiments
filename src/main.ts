import { Camera, vec2, Vector2 } from "./camera";
import { PhysicCircle } from "./PhysicObject";
import "./style.css";

export type Ctx = CanvasRenderingContext2D;

const infoBar = document.getElementById("infoBar") as HTMLDivElement;
const canvas = document.getElementById("simulationCanvas") as HTMLCanvasElement;
const canCon = document.getElementById("canvasContainer") as HTMLDivElement;
const ctx = canvas.getContext("2d")!;

const SUB_STEPS = 1;

let lastStamp: number;
let oldHeight: number, winWidth: number;
const mainLoop: FrameRequestCallback = (timestamp) => {
  requestAnimationFrame(mainLoop);

  //canvas size
  const { width, height } = canCon.getBoundingClientRect();
  if (width !== winWidth || height !== oldHeight) {
    [canvas.height, canvas.width] = [oldHeight, winWidth] = [height, width];
    [cam.position.x, cam.position.y] = [width / 2, height / 2];
  }

  //timestamp
  if (!lastStamp) {
    init();
    lastStamp = timestamp;
    return;
  }
  const dt = timestamp - lastStamp;
  lastStamp = timestamp;

  //sub steps
  for (let i = 0; i < SUB_STEPS; i++) {
    update(dt / 1000 / SUB_STEPS);
  }
  draw();
};

requestAnimationFrame(mainLoop);

//-------------------------------------

const cam = new Camera(ctx, { x: 300, y: 300 });
let objects: PhysicCircle[];
let centerObject: PhysicCircle;

function init() {
  (window as any).objects = objects = [...Array(20)].map(() =>
    //should generate in a circle instead
    {
      const radius = Math.random() * 45 + 5;
      return new PhysicCircle(
        //position
        {
          x: Math.random() * 800 - 400,
          y: Math.random() * 800 - 400,
        },
        //size
        Math.PI * radius ** 2
      );
    }
  );

  centerObject = new PhysicCircle(
    { x: 0, y: 0 },
    100000,
    undefined,
    50,
    "orange"
  );
}

function update(dt: number) {
  objects.forEach((obj) => obj.attractTo(centerObject, dt));
  objects.forEach((obj) => obj.update(dt));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  centerObject.draw(cam);
  objects.forEach((obj) => obj.draw(cam));
}

export function drawCircle(
  cam: Camera,
  position: Vector2,
  radius: number,
  fill: string
) {
  const { x, y } = cam.project(position);
  cam.ctx.beginPath();
  cam.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  cam.ctx.fillStyle = fill;
  cam.ctx.fill();
}
