import Main from "./components/pages/mainPage.jsx";
import Profile from "./components/pages/profile.jsx";

import "@xyflow/react/dist/style.css";

import "./CSS/variables.css";
import "./CSS/App.css";
import "./CSS/settings.css";
import "./CSS/toolbar.css";
import "./CSS/dnd.css";
import "./CSS/backdrop.css";
import "./CSS/circuitsMenu.css";
import "./CSS/contextMenu.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./components/pages/mainPage/switch.jsx";

function App() {
  return (
    <Router>
      <div style={{ height: "100%" }}>
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Main />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
