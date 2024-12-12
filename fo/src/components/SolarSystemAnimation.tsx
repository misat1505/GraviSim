import React, { useRef, useEffect, useState } from "react";

const G = 6.6743e-11;
const AU = 1.496e11;
const dt = 3600 * 24;
const SCALE_FACTOR = 0.000005;

interface Body {
  name: string;
  mass: number;
  position: [number, number];
  velocity: [number, number];
  size: number;
  trace: [number, number][];
}

interface SliderProps {
  name: string;
  initialValue: number;
  onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ name, initialValue, onChange }) => {
  return (
    <div>
      <label>{name}: </label>
      <input
        type="range"
        min="0.1"
        max="10"
        step="0.1"
        defaultValue={initialValue}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
};

const SolarSystem: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [bodies, setBodies] = useState<Body[]>([
    {
      name: "Sun",
      mass: 1.989e30,
      position: [0, 0],
      velocity: [0, 0],
      size: 1_391_000,
      trace: [[0, 0]],
    },
    {
      name: "Mercury",
      mass: 3.285e23,
      position: [0.39 * AU, 0],
      velocity: [0, 47.87e3],
      size: 4_880,
      trace: [[0.39 * AU, 0]],
    },
    {
      name: "Venus",
      mass: 4.867e24,
      position: [0.723 * AU, 0],
      velocity: [0, 35.02e3],
      size: 12_104,
      trace: [[0.723 * AU, 0]],
    },
    {
      name: "Earth",
      mass: 5.972e24,
      position: [AU, 0],
      velocity: [0, 29.78e3],
      size: 12_742,
      trace: [[AU, 0]],
    },
    {
      name: "Mars",
      mass: 6.39e23,
      position: [1.5 * AU, 0],
      velocity: [0, 24.077e3],
      size: 6_779,
      trace: [[1.5 * AU, 0]],
    },
  ]);

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
        body.velocity[0] + acceleration[0] * dt,
        body.velocity[1] + acceleration[1] * dt,
      ];
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

  useEffect(() => {
    console.log(bodies);
  }, []);

  const drawBodies = (ctx: CanvasRenderingContext2D, bodies: Body[]) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const centerX = ctx.canvas.width / 2 + offset[0];
    const centerY = ctx.canvas.height / 2 + offset[1];

    bodies.forEach((body) => {
      // Draw trace
      ctx.beginPath();
      ctx.strokeStyle = body.name === "Sun" ? "orange" : "gray";
      ctx.lineWidth = 0.5;
      body.trace.forEach(([x, y], i) => {
        const traceX = centerX + x * zoom;
        const traceY = centerY + y * zoom;
        if (i === 0) ctx.moveTo(traceX, traceY);
        else ctx.lineTo(traceX, traceY);
      });
      ctx.stroke();

      // Draw body
      const x = centerX + body.position[0] * zoom;
      const y = centerY + body.position[1] * zoom;
      const size = body.size * zoom;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fillStyle = body.name === "Sun" ? "yellow" : "white";
      ctx.fill();

      ctx.font = `${1200000 * zoom}px Arial`;
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      console.log(x, y - size - 10);
      ctx.fillText(body.name, x, y - size - 10);
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame: number;

    const animate = () => {
      setBodies((prevBodies) => {
        const updatedBodies = updatePositionsAndVelocities(prevBodies);
        drawBodies(ctx, updatedBodies);
        return updatedBodies;
      });
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, [zoom, offset]);

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
    <div>
      <canvas
        ref={canvasRef}
        width={800}
        height={800}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <div>
        {bodies.map((body) => (
          <Slider
            key={body.name}
            name={body.name}
            initialValue={1}
            onChange={(value) => handleMassChange(body.name, body.mass * value)}
          />
        ))}
      </div>
    </div>
  );
};

export default SolarSystem;
