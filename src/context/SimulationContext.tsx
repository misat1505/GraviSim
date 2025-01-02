import { createContext, PropsWithChildren, useContext, useState } from "react";

type SimulationContextProps = PropsWithChildren & {};

type SimulationContextProvidedValues = {
  timeMultiplier: number;
  setTimeMultiplier: React.Dispatch<React.SetStateAction<number>>;
  tracesLength: number;
  setTracesLength: React.Dispatch<React.SetStateAction<number>>;
};

const SimulationContext = createContext<
  SimulationContextProvidedValues | undefined
>(undefined);

export const useSimulationContext = () => {
  const context = useContext(SimulationContext);
  if (context === undefined)
    throw new Error("useSimulationContext called outside SimulationProvider.");
  return context;
};

const SimulationProvider = ({ children }: SimulationContextProps) => {
  const [timeMultiplier, setTimeMultiplier] = useState(1);
  const [tracesLength, setTracesLength] = useState(Infinity);

  return (
    <SimulationContext.Provider
      value={{
        timeMultiplier,
        setTimeMultiplier,
        tracesLength,
        setTracesLength,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export default SimulationProvider;
