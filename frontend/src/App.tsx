import { AppProvider } from "./context/AppStore";
import Sidebar from "./components/Sidebar";
import GraphCanvas from "./components/GraphCanvas";
import UserPanel from "./components/UserPanel";

export default function App() {
  return (
    <AppProvider>
      <div className="layout">
        <Sidebar />
        <GraphCanvas />
        <UserPanel />
      </div>
    </AppProvider>
  );
}
