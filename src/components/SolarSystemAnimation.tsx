import { useBodiesContext } from "@/context/BodiesContext";
import { Body } from "@/types/Body";
import React, { useRef, useEffect, useState } from "react";
import BodiesDisplayer from "./BodiesDisplayer";
import { Slider } from "./ui/slider";
import { updatePositionsAndVelocities } from "./physcis/gravity";

const SolarSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { bodies, setBodies } = useBodiesContext();
  const [timeMultiplier, setTimeMultiplier] = useState(1);
  const [tracesLength, setTracesLength] = useState(Infinity);

  const [zoom, setZoom] = useState(0.00000_00001);
  const [offset, setOffset] = useState<[number, number]>([0, 0]);
  const isDragging = useRef(false);
  const dragStart = useRef<[number, number] | null>(null);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawBodies(ctx, bodies);
  }, [zoom, offset]);

  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const centerX = canvas.width / 2 + offset[0];
    const centerY = canvas.height / 2 + offset[1];
    const worldX = (mouseX - centerX) / zoom;
    const worldY = (mouseY - centerY) / zoom;

    const newZoom = Math.max(
      0.00000_00001,
      zoom - event.deltaY * 0.000000000001
    );

    const newOffset: [number, number] = [
      offset[0] - worldX * (newZoom - zoom),
      offset[1] - worldY * (newZoom - zoom),
    ];

    setZoom(newZoom);
    setOffset(newOffset);

    const ctx = canvas?.getContext("2d");
    if (ctx && timeMultiplier > 0)
      setBodies((prevBodies) => {
        const updatedBodies = updatePositionsAndVelocities(prevBodies);
        drawBodies(ctx, updatedBodies);
        return updatedBodies;
      });
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

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx && timeMultiplier > 0)
        setBodies((prevBodies) => {
          const updatedBodies = updatePositionsAndVelocities(prevBodies);
          drawBodies(ctx, updatedBodies);
          return updatedBodies;
        });
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
