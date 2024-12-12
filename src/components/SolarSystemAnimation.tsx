import React, { useRef, useEffect, useState } from "react";
import { Body } from "../types/Body";
import MassSlider from "./MassSlider";
import { useBodiesContext } from "../context/BodiesContext";
import BodiesDisplayer from "./BodiesDisplayer";

const G = 6.6743e-11;
const dt = 3600 * 24;

const SolarSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { bodies, setBodies } = useBodiesContext();
  const [timeMultiplier, setTimeMultiplier] = useState(1);

  const [zoom, setZoom] = useState(0.00000_00001);
  const [offset, setOffset] = useState<[number, number]>([0, 0]);
  const isDragging = useRef(false);
  const dragStart = useRef<[number, number] | null>(null);

  const computeGravitationalForce = (
    body1: Body,
    body2: Body
  ): [number, number] => {
    const r = [
      body2.position[0] - body1.position[0],
      body2.position[1] - body1.position[1],
    ];
    const distance = Math.sqrt(r[0] ** 2 + r[1] ** 2);
    if (distance === 0) return [0, 0];
    const forceMagnitude = (G * body1.mass * body2.mass) / distance ** 2;
    const forceDirection = [r[0] / distance, r[1] / distance];
    return [
      forceMagnitude * forceDirection[0],
      forceMagnitude * forceDirection[1],
    ];
  };

  const updatePositionsAndVelocities = (bodies: Body[]): Body[] => {
    const forces = bodies.map(() => [0, 0] as [number, number]);

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
      const acceleration = [
        forces[index][0] / body.mass,
        forces[index][1] / body.mass,
      ];
      const newVelocity = [
        body.velocity[0] + acceleration[0] * dt * timeMultiplier,
        body.velocity[1] + acceleration[1] * dt * timeMultiplier,
      ];
      const newPosition = [
        body.position[0] + newVelocity[0] * dt * timeMultiplier,
        body.position[1] + newVelocity[1] * dt * timeMultiplier,
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
      body.trace.forEach(([x, y], i) => {
        const traceX = centerX + x * zoom;
        const traceY = centerY + y * zoom;
        if (i === 0) ctx.moveTo(traceX, traceY);
        else ctx.lineTo(traceX, traceY);
      });
      ctx.stroke();

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

    ctx.font = `${30}px Arial`;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(`time: ${timeMultiplier}x`, 700, 50);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const intervalId = setInterval(() => {
      setBodies((prevBodies) => {
        const updatedBodies = updatePositionsAndVelocities(prevBodies);
        drawBodies(ctx, updatedBodies);
        return updatedBodies;
      });
    }, 20);

    return () => clearInterval(intervalId);
  }, [zoom, offset, timeMultiplier]);

  const handleMassChange = (name: string, newMass: number) => {
    setBodies((prevBodies) =>
      prevBodies.map((body) =>
        body.name === name ? { ...body, mass: newMass } : body
      )
    );
  };

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
    <div style={{ display: "flex" }}>
      <canvas
        ref={canvasRef}
        width={800}
        height={800}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <div style={{ marginLeft: "1rem" }}>
        <BodiesDisplayer />
        {/* {bodies.map((body) => (
          <MassSlider
            key={body.name}
            body={body}
            defaultValue={1}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleMassChange(
                body.name,
                body.mass * parseFloat(e.target.value)
              )
            }
          />
        ))} */}

        <h2>Time Multiplier</h2>
        <input
          type="range"
          min={0.1}
          step={0.1}
          max={10}
          defaultValue={1}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTimeMultiplier(parseFloat(e.target.value))
          }
        />
      </div>
    </div>
  );
};

export default SolarSystem;
