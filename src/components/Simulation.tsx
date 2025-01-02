import { useState } from "react";
import BodiesDisplayer from "./BodiesDisplayer";
import { Slider } from "./ui/slider";
import SimulationCanvas from "./SimulationCanvas";

const Simulation = () => {
  const [timeMultiplier, setTimeMultiplier] = useState(1);
  const [tracesLength, setTracesLength] = useState(Infinity);

  return (
    <div className="flex justify-center pt-20">
      <div className="flex space-x-4 overflow-x-hidden justify-around items-start px-4">
        <SimulationCanvas
          timeMultiplier={timeMultiplier}
          tracesLength={tracesLength}
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

export default Simulation;
