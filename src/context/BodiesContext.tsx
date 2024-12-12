import { createContext, PropsWithChildren, useContext, useState } from "react";
import { Body } from "../types/Body";
import { bodies as initBodies } from "../data/bodies";

type BodiesContextProps = PropsWithChildren & {};

type BodiesContextProvidedValues = {
  bodies: Body[];
  setBodies: React.Dispatch<React.SetStateAction<Body[]>>;
};

const BodiesContext = createContext<BodiesContextProvidedValues | undefined>(
  undefined
);

export const useBodiesContext = () => {
  const context = useContext(BodiesContext);
  if (context === undefined)
    throw new Error("useBodiesContext called outside BodiesProvider.");
  return context;
};

const BodiesProvider = ({ children }: BodiesContextProps) => {
  const [bodies, setBodies] = useState<Body[]>(initBodies);

  return (
    <BodiesContext.Provider value={{ bodies, setBodies }}>
      {children}
    </BodiesContext.Provider>
  );
};

export default BodiesProvider;
