import { useBodiesContext } from "@/context/BodiesContext";
import { useEffect, useRef, useState } from "react";
import { updatePositionsAndVelocities } from "../physcis/gravity";
import { Body } from "@/types/Body";
import { useSimulationContext } from "@/context/SimulationContext";

type SimulationCanvasProps = React.CanvasHTMLAttributes<HTMLCanvasElement>;

const SimulationCanvas = ({ ...rest }: SimulationCanvasProps) => {
  const { tracesLength, timeMultiplier, isPaused, setDate } =
    useSimulationContext();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { bodies, setBodies } = useBodiesContext();

  const [zoom, setZoom] = useState(0.00000_00001);
  const [offset, setOffset] = useState<[number, number]>([0, 0]);
  const isDragging = useRef(false);
  const dragStart = useRef<[number, number] | null>(null);

  const updateDate = () => {
    setDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
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

  const updateSimulation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setBodies((prevBodies) => {
      const updatedBodies = updatePositionsAndVelocities(prevBodies);
      drawBodies(ctx, updatedBodies);
      return updatedBodies;
    });
    updateDate();
  };

  useEffect(() => {
    const intervalId = setInterval(
      updateSimulation,
      timeMultiplier === 0 || isPaused ? 1_000_000 : 40 / timeMultiplier
    );

    return () => clearInterval(intervalId);
  }, [zoom, offset, timeMultiplier, tracesLength, isPaused]);

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

    if (timeMultiplier > 0 && !isPaused) updateSimulation();
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

      if (timeMultiplier > 0 && !isPaused) updateSimulation();
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    dragStart.current = null;
  };

  return (
    <canvas
      ref={canvasRef}
      width={1200}
      height={800}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      {...rest}
    />
  );
};

export default SimulationCanvas;
