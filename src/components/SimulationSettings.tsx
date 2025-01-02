import { useSimulationContext } from "@/context/SimulationContext";
import { Slider } from "./ui/slider";
import BodiesDisplayer from "./BodiesDisplayer";

const SimulationSettings = () => {
  const { timeMultiplier, setTimeMultiplier, tracesLength, setTracesLength } =
    useSimulationContext();

  return (
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
            Control the speed of the animation. A higher multiplier makes the
            simulation faster. If your PC struggles, the animation speed can be
            throttled.
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
  );
};

export default SimulationSettings;
