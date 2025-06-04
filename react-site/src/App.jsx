import { useState } from 'react';
import Intro from './components/Intro';
import Projects from './components/Projects';
import './App.css';

function App() {
  const [page, setPage] = useState('Intro');
  return (
    <div className="pages">
      {page === 'Intro' && <div className="page"><Intro onShowProjects={() => setPage('Projects')} /></div>}
      {page === 'Projects' && <div className="page"><Projects onBack={() => setPage('Intro')} /></div>}
    </div>
  );
}

export default App;
