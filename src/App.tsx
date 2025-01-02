import Simulation from "./components/Simulation";
import BodiesProvider from "./context/BodiesContext";
import SimulationProvider from "./context/SimulationContext";

function App() {
  return (
    <BodiesProvider>
      <SimulationProvider>
        <Simulation />
      </SimulationProvider>
    </BodiesProvider>
  );
}

export default App;
