import Simulation from "./components/Simulation";
import BodiesProvider from "./context/BodiesContext";

function App() {
  return (
    <BodiesProvider>
      <Simulation />
    </BodiesProvider>
  );
}

export default App;
