import './css/App.css';
import Main from './pages/Main';
import AboutMe from './pages/AboutMe'
import Implementation from './pages/Implementation';
import Navigation from './components/Navigation';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Analytics } from "@vercel/analytics/react";
import useLocalStorage from 'use-local-storage';

function App() {
  const [darkMode, setDarkMode] = useLocalStorage("darkMode", false)

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Navigation />
      <main className='h-[100vh] dark:bg-neutral-900'>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/aboutme" element={<AboutMe />} />
          <Route path="/implementation" element={<Implementation />} />
        </Routes>
      </main>
      <Analytics />
    </div>
  );
}

export default App;
