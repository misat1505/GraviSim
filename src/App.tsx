import SolarSystem from "./components/SolarSystemAnimation";
import BodiesProvider from "./context/BodiesContext";

function App() {
  return (
    <BodiesProvider>
      <SolarSystem />
    </BodiesProvider>
  );
}

export default App;
