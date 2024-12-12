import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useBodiesContext } from "@/context/BodiesContext";
import { Slider } from "./ui/slider";

const BodiesDisplayer = () => {
  const { bodies, setBodies } = useBodiesContext();

  const handleMassChange = (name: string, newMass: number) => {
    setBodies((prevBodies) =>
      prevBodies.map((body) =>
        body.name === name ? { ...body, mass: newMass } : body
      )
    );
  };

  return (
    <div className="w-96 bg-slate-100">
      <Accordion type="single" collapsible className="w-full">
        {bodies.map((body, idx) => (
          <AccordionItem value={`item-${idx}`} key={idx}>
            <AccordionTrigger className="bg-slate-100 capitalize">
              {body.name}
            </AccordionTrigger>
            <AccordionContent className="p-4">
              <Slider
                min={0.1}
                step={0.1}
                max={10}
                defaultValue={[1]}
                onValueChange={(value) => {
                  console.log(value);
                  handleMassChange(body.name, value[0]);
                }}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default BodiesDisplayer;
