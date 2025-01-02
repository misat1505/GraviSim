import { useSimulationContext } from "@/context/SimulationContext";
import { Button } from "./ui/button";
import { FaPause, FaPlay } from "react-icons/fa6";
import { IoMdRefresh } from "react-icons/io";

const SimulationButtons = () => {
  const { isPaused, toggleIsPaused } = useSimulationContext();

  return (
    <div className="absolute top-4 right-4 flex items-center space-x-2">
      <Button onClick={() => window.location.reload()} variant="secondary">
        <IoMdRefresh />
      </Button>
      <Button onClick={toggleIsPaused} variant="secondary">
        {isPaused ? <FaPlay /> : <FaPause />}
      </Button>
    </div>
  );
};

export default SimulationButtons;
