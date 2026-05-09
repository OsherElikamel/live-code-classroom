import './App.css';
import LobbyPage from './components/LobbyPage/LobbyPage';
import CodeBlockPage from './components/CodeBlockPage/CodeBlockPage.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
      <Routes>
        <Route path="/" element={<LobbyPage />} />
        <Route path="/code-block/:id" element={<CodeBlockPage />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
