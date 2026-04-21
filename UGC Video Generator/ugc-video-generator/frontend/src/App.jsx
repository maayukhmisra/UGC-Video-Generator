import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Create from "./pages/Create";
import Videos from "./pages/Videos";
import Actors from "./pages/Actors";
import Settings from "./pages/Settings";
import "./index.css";

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Create />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/actors" element={<Actors />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}