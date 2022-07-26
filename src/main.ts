import { Camera, Vector2 } from "./camera";
import { PhysicCircle } from "./PhysicObject";
import "./style.css";

export type Ctx = CanvasRenderingContext2D;

const canvas = document.getElementById("simulationCanvas") as HTMLCanvasElement;
const canCon = document.getElementById("canvasContainer") as HTMLDivElement;
const infoMenu = document.getElementById("infoMenu") as HTMLDivElement;
const speedSlider = document.getElementById("speedSlider") as HTMLInputElement;
const speedChkBox = document.getElementById("speedChkBox") as HTMLInputElement;
const speedDisplay = document.getElementById("speedDisplay") as HTMLSpanElement;

const ctx = canvas.getContext("2d")!;

const SUB_STEPS = 10;

let speedScale = 1;
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
    update((dt / 1000 / SUB_STEPS) * speedScale);
  }
  draw();
};

requestAnimationFrame(mainLoop);

//-------------------------------------

const PLANET_RADIUS = 50;
const OBJECT_COUNT = 100;

const cam = new Camera(ctx, { x: 300, y: 300 });
let objects: PhysicCircle[];
let centerObject: PhysicCircle;
let selectedObject: PhysicCircle | undefined;

function init() {
  centerObject = new PhysicCircle(
    { x: 0, y: 0 },
    Math.PI * PLANET_RADIUS ** 2,
    undefined,
    PLANET_RADIUS,
    "orange"
  );
  centerObject.name = "The Center Object";

  (window as any).objects = objects = [...Array(OBJECT_COUNT)].map((_, i) => {
    const angle = /*Math.random()*/ (i / OBJECT_COUNT) * Math.PI * 2;
    const radius = 30; //Math.random() * 45 + 5;
    // const min = PLANET_RADIUS + radius + 5;
    const dist = 300; //Math.random() * (400 - min) + min;
    return new PhysicCircle(
      //position
      { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist },
      //size
      Math.PI * radius ** 2,
      //speed
      {
        x: Math.cos(angle + Math.PI / 2) * 50,
        y: Math.sin(angle + Math.PI / 2) * 30,
      }
    );
  });

  //event
  canvas.addEventListener("click", (evt) => {
    const pos = cam.unproject({ x: evt.offsetX, y: evt.offsetY });
    if (evt.shiftKey) {
      objects.push(new PhysicCircle(pos, 1, undefined, 25, "#ffc"));
      return;
    }

    if (selectedObject) {
      infoMenu.style.display = "none";
      selectedObject.selected = false;
      selectedObject = undefined;
    }

    const foundObject = [centerObject, ...objects]
      .reverse()
      .find(
        (obj) =>
          Math.sqrt(
            (pos.x - obj.position.x) ** 2 + (pos.y - obj.position.y) ** 2
          ) < obj.radius
      );

    if (foundObject) {
      selectedObject = foundObject;
      selectedObject.selected = true;
      infoMenu.style.display = "block";
      return;
    }
  });

  speedSlider.addEventListener("input", handleSpeedInput);
  speedChkBox.addEventListener("input", handleSpeedInput);
  speedDisplay.addEventListener("click", () => {
    speedSlider.valueAsNumber = 50;
    handleSpeedInput();
  });
  function handleSpeedInput() {
    const value = parseInt(speedSlider.value);
    const scaledVal = 100 ** ((value / 100) * 2);
    updateSpeed(speedChkBox.checked ? -scaledVal : scaledVal);
  }
}
function updateSpeed(speedPercent: number) {
  speedScale = speedPercent / 100;
  speedDisplay.textContent =
    (speedPercent < 20
      ? Math.floor(speedPercent * 10) / 10
      : Math.floor(speedPercent)) + "%";
}

function update(dt: number) {
  objects.forEach((obj) => obj.attractTo(centerObject, dt));
  objects.forEach((obj) => obj.update(dt));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  centerObject.draw(cam);

  //shitty line draw
  // objects.forEach((obj, i) =>
  //   drawLine(cam, objects.at(i - 1)!.position, obj.position, "blue")
  // );

  objects.forEach((obj) => obj.draw(cam));

  drawInfoMenu();
}

function drawInfoMenu() {
  if (selectedObject) {
    const { position, speed } = selectedObject;
    infoMenu.textContent =
      `[${selectedObject.name}]\n` +
      `position: X${Math.round(position.x)} Y${Math.round(position.y)}\n` +
      `speed: X${Math.round(speed.x)} Y${Math.round(speed.y)}\n` +
      `mass: ${Math.round(selectedObject.mass)}\n` +
      `radius: ${Math.round(selectedObject.radius)}`;
  }
}

export function drawLine(
  cam: Camera,
  pFrom: Vector2,
  pTo: Vector2,
  stroke: string,
  width = 1
) {
  const { x: xFrom, y: yFrom } = cam.project(pFrom);
  const { x: xTo, y: yTo } = cam.project(pTo);

  cam.ctx.beginPath();
  cam.ctx.moveTo(xFrom, yFrom);
  cam.ctx.lineTo(xTo, yTo);
  cam.ctx.strokeStyle = stroke;
  cam.ctx.lineWidth = width;
  cam.ctx.stroke();
}

export function drawCircle(
  cam: Camera,
  position: Vector2,
  radius: number,
  fill: string,
  strokeColor?: string,
  strokeWidth?: number
) {
  const { x, y } = cam.project(position);
  cam.ctx.beginPath();
  cam.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  cam.ctx.fillStyle = fill;
  cam.ctx.fill();
  if (strokeWidth) {
    cam.ctx.strokeStyle = strokeColor!;
    cam.ctx.lineWidth = strokeWidth;
    cam.ctx.stroke();
  }
}
