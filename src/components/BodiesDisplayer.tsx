import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useBodiesContext } from "@/context/BodiesContext";

const BodiesDisplayer = () => {
  const { bodies } = useBodiesContext();

  return (
    <div className="w-96 bg-slate-100">
      <Accordion type="single" collapsible className="w-full">
        {bodies.map((body, idx) => (
          <AccordionItem value={`item-${idx}`} key={idx}>
            <AccordionTrigger className="bg-slate-100 capitalize">
              {body.name}
            </AccordionTrigger>
            <AccordionContent className="p-4">
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default BodiesDisplayer;
