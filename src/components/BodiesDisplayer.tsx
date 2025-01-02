import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useBodiesContext } from "@/context/BodiesContext";
import { Slider } from "./ui/slider";
import { Body } from "@/types/Body";
import { useState } from "react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";

const BodiesDisplayer = () => {
  const { bodies } = useBodiesContext();
  const [massMultipliers, setMassMultipliers] = useState<
    Record<string, number>
  >(() =>
    bodies.reduce((acc, body) => {
      acc[body.name] = 1;
      return acc;
    }, {} as Record<string, number>)
  );

  const updateMassMultiplier = (name: string, multiplier: number) => {
    setMassMultipliers((prev) => ({
      ...prev,
      [name]: multiplier,
    }));
  };

  return (
    <div className="w-[98%] mx-auto bg-slate-100">
      <Accordion type="single" collapsible className="w-full">
        {bodies.map((body, idx) => (
          <AccordionItem value={`item-${idx}`} key={idx}>
            <AccordionTrigger className="bg-slate-100 capitalize">
              {body.name}
            </AccordionTrigger>
            <AccordionContent className="pb-0">
              <MassSlider
                body={body}
                multiplier={massMultipliers[body.name]}
                onMultiplierChange={(multiplier) =>
                  updateMassMultiplier(body.name, multiplier)
                }
              />
              <TraceToggle body={body} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

type MassSliderProps = {
  body: Body;
  multiplier: number;
  onMultiplierChange: (multiplier: number) => void;
};

const MassSlider = ({
  body,
  multiplier,
  onMultiplierChange,
}: MassSliderProps) => {
  const { setBodies, initBodies } = useBodiesContext();

  const handleMassChange = (newMultiplier: number) => {
    onMultiplierChange(newMultiplier);
    setBodies((prevBodies) =>
      prevBodies.map((b) =>
        b.name === body.name
          ? {
              ...b,
              mass:
                newMultiplier *
                initBodies.find((ib) => ib.name === body.name)!.mass,
            }
          : b
      )
    );
  };

  return (
    <div className="m-2 bg-slate-300/80 p-1 rounded-sm">
      <h2 className="mb-4">
        <span className="font-semibold">Mass:</span> {multiplier.toFixed(1)}x
      </h2>
      <div className="flex items-center space-x-2">
        <Button
          className="font-semibold w-8 h-8 text-xl"
          onClick={() => handleMassChange(Math.max(0.1, multiplier - 0.1))}
        >
          <div className="mt-[-0.2rem]">-</div>
        </Button>
        <Slider
          min={0.1}
          step={0.1}
          max={10}
          value={[multiplier]}
          onValueChange={(value) => handleMassChange(value[0])}
        />
        <Button
          className="font-semibold w-8 h-8 text-xl"
          onClick={() => handleMassChange(Math.min(10, multiplier + 0.1))}
        >
          <div className="mt-[-0.2rem]">+</div>
        </Button>
      </div>
    </div>
  );
};

type TraceToggleProps = { body: Body };

const TraceToggle = ({ body }: TraceToggleProps) => {
  const { setBodies } = useBodiesContext();

  const handleToggleTraceVisibility = () => {
    setBodies((prev) =>
      prev.map((b) => {
        if (b.name !== body.name) return b;
        return { ...b, isShowingTrace: !b.isShowingTrace };
      })
    );
  };

  return (
    <div className="m-2 bg-slate-300/80 p-1 rounded-sm flex items-center justify-between h-12">
      <h2 className="font-semibold">Toggle trace visibilty</h2>
      <Switch
        checked={body.isShowingTrace}
        onClick={handleToggleTraceVisibility}
      />
    </div>
  );
};

export default BodiesDisplayer;
