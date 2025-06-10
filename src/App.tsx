import Solver from "./components/Solver";
import { AppProvider } from "./components/AppContext";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <AppProvider>
          <Solver /> {/* Removed user prop */}
        </AppProvider>
      </div>
    </div>
  );
}

export default App;
