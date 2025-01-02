import { useSimulationContext } from "@/context/SimulationContext";

const DateDisplay = () => {
  const { date } = useSimulationContext();

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="absolute top-4 left-4 text-white text-lg">
      {formatDate(date)}
    </div>
  );
};

export default DateDisplay;
