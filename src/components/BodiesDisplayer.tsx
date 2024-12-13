import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useBodiesContext } from "@/context/BodiesContext";
import { Slider } from "./ui/slider";
import { Body } from "@/types/Body";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";

const BodiesDisplayer = () => {
  const { bodies } = useBodiesContext();

  return (
    <div className="w-96 bg-slate-100">
      <h2 className="font-bold text-xl p-4 rounded-sm">Bodies</h2>
      <Accordion type="single" collapsible className="w-full">
        {bodies.map((body, idx) => (
          <AccordionItem value={`item-${idx}`} key={idx}>
            <AccordionTrigger className="bg-slate-100 capitalize">
              {body.name}
            </AccordionTrigger>
            <AccordionItemContent body={body} />
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

type AccordionItemContentProps = { body: Body };

const AccordionItemContent = ({ body }: AccordionItemContentProps) => {
  return (
    <AccordionContent className="pb-0">
      <MassSlider body={body} />
      <TraceToggle body={body} />
    </AccordionContent>
  );
};

type MassSliderProps = { body: Body };

const MassSlider = ({ body }: MassSliderProps) => {
  const [massMultiplier, setMassMultiplier] = useState(1);
  const { setBodies, initBodies } = useBodiesContext();

  const handleMassChange = (name: string, newMass: number) => {
    setBodies((prevBodies) =>
      prevBodies.map((body) =>
        body.name === name ? { ...body, mass: newMass } : body
      )
    );
  };

  useEffect(() => {
    handleMassChange(
      body.name,
      massMultiplier * initBodies.find((b) => b.name === body.name)!.mass
    );
  }, [massMultiplier]);

  return (
    <div className="m-2 bg-slate-300/80 p-1 rounded-sm">
      <h2 className="mb-4">
        <span className="font-semibold">Mass:</span> {massMultiplier.toFixed(1)}
        x
      </h2>
      <div className="flex items-center space-x-2">
        <Button
          className="font-semibold w-8 h-8 text-xl"
          onClick={() => setMassMultiplier((prev) => Math.max(0.1, prev - 0.1))}
        >
          -
        </Button>
        <Slider
          min={0.1}
          step={0.1}
          max={10}
          value={[massMultiplier]}
          onValueChange={(value) => {
            setMassMultiplier(value[0]);
          }}
        />
        <Button
          className="font-semibold w-8 h-8 text-xl"
          onClick={() => setMassMultiplier((prev) => Math.min(10, prev + 0.1))}
        >
          +
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
        className="block"
        checked={body.isShowingTrace}
        onClick={handleToggleTraceVisibility}
      />
    </div>
  );
};

export default BodiesDisplayer;
