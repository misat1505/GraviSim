import { useSimulationContext } from "@/context/SimulationContext";
import { Button } from "./ui/button";
import { FaPause, FaPlay } from "react-icons/fa6";

const PauseButton = () => {
  const { isPaused, toggleIsPaused } = useSimulationContext();

  return (
    <Button
      onClick={toggleIsPaused}
      variant="secondary"
      className="absolute top-4 right-4"
    >
      {isPaused ? <FaPlay /> : <FaPause />}
    </Button>
  );
};

export default PauseButton;
