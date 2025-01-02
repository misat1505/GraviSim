import { createContext, PropsWithChildren, useContext, useState } from "react";

type SimulationContextProps = PropsWithChildren & {};

type SimulationContextProvidedValues = {
  timeMultiplier: number;
  setTimeMultiplier: React.Dispatch<React.SetStateAction<number>>;
  tracesLength: number;
  setTracesLength: React.Dispatch<React.SetStateAction<number>>;
  isPaused: boolean;
  toggleIsPaused: () => void;
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
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
  const [isPaused, setIsPaused] = useState(false);
  const [date, setDate] = useState(new Date());

  const toggleIsPaused = () => setIsPaused((prev) => !prev);

  return (
    <SimulationContext.Provider
      value={{
        timeMultiplier,
        setTimeMultiplier,
        tracesLength,
        setTracesLength,
        isPaused,
        toggleIsPaused,
        date,
        setDate,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export default SimulationProvider;
