import Main from './pages/mainPage.jsx';
import Profile from "./pages/profile.jsx"

import '@xyflow/react/dist/style.css';

import './components/CSS/variables.css';
import './components/CSS/App.css';
import './components/CSS/settings.css';
import './components/CSS/toolbar.css';
import './components/CSS/dnd.css';
import './components/CSS/backdrop.css';
import './components/CSS/circuitsMenu.css';
import './components/CSS/contextMenu.css';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import './components/codeComponents/mainPage/switch.jsx';

function App() {
  return (
    <Router>
      <div style={{ height: '100%' }}>
        <Routes>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/" element={<Main/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App
