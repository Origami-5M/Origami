import { Routes, Route } from 'react-router-dom';
import Play from './Play.jsx';
import MainPage from './MainPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/play" element={<Play />} />
    </Routes>
  );
}

export default App;
