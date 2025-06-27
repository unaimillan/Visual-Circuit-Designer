import Main from "./pages/mainPage.jsx";
import Profile from "./pages/profile.jsx";

import "@xyflow/react/dist/style.css";
import { Toaster } from "react-hot-toast";

import "./CSS/variables.css";
import "./CSS/App.css";
import "./CSS/settings.css";
import "./CSS/toolbar.css";
import "./CSS/dnd.css";
import "./CSS/backdrop.css";
import "./CSS/circuitsMenu.css";
import "./CSS/contextMenu.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./components/mainPage/switch.jsx";

function App() {
  return (
    <Router>
      <div style={{ height: "100%" }}>
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Main />} />
        </Routes>
        <Toaster
          position="top-center"
          toastOptions={{

            style: {
              backgroundColor: 'var(--menu-bg-color)',
              color:'var(--text-color)',
              fontSize: '12px',
              borderRadius: '0.5rem',
              padding: '10px 10px 10px 10px',
              border: '0.05rem solid var(--external-border-color)',
              fontFamily: 'Montserrat, serif',

            },
            duration: 10000,
            error: {
              style: {
                padding: '10px 30px 10px 10px',
                // background: '#ff5252',
              },
            },

          }}
        />
      </div>
    </Router>
  );
}


export default App;
