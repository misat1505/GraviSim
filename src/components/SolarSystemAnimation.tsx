import { useBodiesContext } from "@/context/BodiesContext";
import { Body } from "@/types/Body";
import React, { useRef, useEffect, useState } from "react";
import BodiesDisplayer from "./BodiesDisplayer";
import { Slider } from "./ui/slider";

const G = 6.6743e-11;
const dt = 3600 * 24;

const SolarSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { setBodies } = useBodiesContext();
  const [timeMultiplier, setTimeMultiplier] = useState(1);
  const [tracesLength, setTracesLength] = useState(Infinity);

  const [zoom, setZoom] = useState(0.00000_00001);
  const [offset, setOffset] = useState<[number, number]>([0, 0]);
  const isDragging = useRef(false);
  const dragStart = useRef<[number, number] | null>(null);

  const computeGravitationalForce = (
    body1: Body,
    body2: Body
  ): [number, number] => {
    // odległość między ciałami jako wektor [x, y]
    const r = [
      body2.position[0] - body1.position[0],
      body2.position[1] - body1.position[1],
    ];

    // odległość
    const distance = Math.sqrt(r[0] ** 2 + r[1] ** 2);
    if (distance === 0) return [0, 0];

    // F = G * m1 * m2 / r^2
    const forceMagnitude = (G * body1.mass * body2.mass) / distance ** 2;

    // normalizacja
    const forceDirection = [r[0] / distance, r[1] / distance];

    // wektor sił [x, y]
    return [
      forceMagnitude * forceDirection[0],
      forceMagnitude * forceDirection[1],
    ];
  };

  const updatePositionsAndVelocities = (bodies: Body[]): Body[] => {
    const forces = bodies.map(() => [0, 0] as [number, number]);

    // dla każdego ciała obliczenie siły wobec wszystkich pozostałych
    for (let i = 0; i < bodies.length; i++) {
      for (let j = 0; j < bodies.length; j++) {
        if (i !== j) {
          const force = computeGravitationalForce(bodies[i], bodies[j]);
          forces[i][0] += force[0];
          forces[i][1] += force[1];
        }
      }
    }

    return bodies.map((body, index) => {
      // a = F / m
      const acceleration = [
        forces[index][0] / body.mass,
        forces[index][1] / body.mass,
      ];

      // v = v0 + a * t
      const newVelocity = [
        body.velocity[0] + acceleration[0] * dt,
        body.velocity[1] + acceleration[1] * dt,
      ];

      // x = x0 + v * t
      const newPosition = [
        body.position[0] + newVelocity[0] * dt,
        body.position[1] + newVelocity[1] * dt,
      ];

      return {
        ...body,
        velocity: newVelocity,
        position: newPosition,
        trace: [...body.trace, newPosition],
      } as Body;
    });
  };

  const drawBodies = (ctx: CanvasRenderingContext2D, bodies: Body[]) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const centerX = ctx.canvas.width / 2 + offset[0];
    const centerY = ctx.canvas.height / 2 + offset[1];

    bodies.forEach((body) => {
      ctx.beginPath();
      ctx.strokeStyle = body.color;
      ctx.lineWidth = 0.5;
      if (body.isShowingTrace && tracesLength > 0) {
        body.trace.forEach(([x, y], i) => {
          if (i < body.trace.length - tracesLength) return;
          const traceX = centerX + x * zoom;
          const traceY = centerY + y * zoom;
          if (i === 0) ctx.moveTo(traceX, traceY);
          else ctx.lineTo(traceX, traceY);
        });
        ctx.stroke();
      }

      const x = centerX + body.position[0] * zoom;
      const y = centerY + body.position[1] * zoom;
      const size = body.size * zoom;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fillStyle = body.color;
      ctx.fill();

      ctx.font = `${12}px Arial`;
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText(body.name, x, y - size - 10);
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const intervalId = setInterval(
      () => {
        setBodies((prevBodies) => {
          const updatedBodies = updatePositionsAndVelocities(prevBodies);
          drawBodies(ctx, updatedBodies);
          return updatedBodies;
        });
      },
      timeMultiplier === 0 ? 1_000_000 : 40 / timeMultiplier
    );

    return () => clearInterval(intervalId);
  }, [zoom, offset, timeMultiplier, tracesLength]);

  const handleWheel = (event: React.WheelEvent) => {
    setZoom((prevZoom) =>
      Math.max(0.00000_00001, prevZoom - event.deltaY * 0.000000000001)
    );
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    isDragging.current = true;
    dragStart.current = [event.clientX, event.clientY];
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDragging.current && dragStart.current) {
      const dx = event.clientX - dragStart.current[0];
      const dy = event.clientY - dragStart.current[1];
      setOffset((prevOffset) => [prevOffset[0] + dx, prevOffset[1] + dy]);
      dragStart.current = [event.clientX, event.clientY];
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    dragStart.current = null;
  };

  return (
    <div className="flex justify-center pt-20">
      <div className="flex space-x-4 overflow-x-hidden justify-around items-start px-4">
        <canvas
          ref={canvasRef}
          width={1200}
          height={800}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
        <div className="h-[800px] overflow-y-auto overflow-x-hidden no-scrollbar">
          <div className="w-[420px]">
            <div className="border rounded-sm p-4">
              <h2 className="font-bold text-lg text-nowrap">
                Time Multiplier (
                {timeMultiplier === 0
                  ? "stopped"
                  : `${timeMultiplier}x - 
                ${(25 * timeMultiplier).toFixed(1)} days / sec.`}
                )
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Control the speed of the animation. A higher multiplier makes
                the simulation faster. If your PC struggles, the animation speed
                can be throttled.
              </p>
              <Slider
                min={0}
                step={0.1}
                max={10}
                defaultValue={[1]}
                onValueChange={(value) => setTimeMultiplier(value[0])}
              />
            </div>
            <div className="border rounded-sm my-4 p-4">
              <h2 className="font-bold text-lg">
                Traces Length (
                {tracesLength > 0 ? `${tracesLength} days` : "hidden"})
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Adjust the length of the traces. The shorter the trace, the less
                stress it puts on your computer's performance.
              </p>
              <Slider
                min={0}
                step={10}
                max={1010}
                defaultValue={[1010]}
                onValueChange={(value) =>
                  setTracesLength(value[0] > 1000 ? Infinity : value[0])
                }
              />
            </div>
          </div>
          <BodiesDisplayer />
        </div>
      </div>
    </div>
  );
};

export default SolarSystem;
