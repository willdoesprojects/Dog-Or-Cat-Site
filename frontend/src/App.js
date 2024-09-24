import './css/App.css';
import Main from './pages/Main';
import AboutMe from './pages/AboutMe'
import Implementation from './pages/Implementation';
import Navigation from './components/Navigation';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <body>
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/aboutme" element={<AboutMe />} />
          <Route path="/implementation" element={<Implementation />} />
        </Routes>
      </main>
    </body>
  );
}

export default App;
