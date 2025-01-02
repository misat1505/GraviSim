import SimulationCanvas from "./SimulationCanvas";
import SimulationSettings from "./SimulationSettings";
import SimulationButtons from "./SimulationButtons";
import DateDisplay from "./DateDisplay";

const Simulation = () => {
  return (
    <div className="flex justify-center pt-20">
      <div className="flex space-x-4 overflow-x-hidden justify-around items-start px-4">
        <div className="relative">
          <SimulationCanvas />
          <SimulationButtons />
          <DateDisplay />
        </div>
        <SimulationSettings />
      </div>
    </div>
  );
};

export default Simulation;
