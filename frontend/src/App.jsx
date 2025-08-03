import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import DimensionHub from './pages/DimensionHub';
import GameInterface from './pages/GameInterface';
import ProfileDashboard from './pages/ProfileDashboard';
import TutorialCenter from './pages/TutorialCenter';
import Quiz from './pages/Quiz';

function App() {
  return (
    <Provider store={store}>
        <Routes>
          <Route path="/" element={<Layout><LandingPage /></Layout>} />
          <Route path="/dimensions" element={<Layout><DimensionHub /></Layout>} />
          <Route path="/game/:scenarioId" element={<Layout><GameInterface /></Layout>} />
          <Route path="/profile" element={<Layout><ProfileDashboard /></Layout>} />
          <Route path="/tutorial" element={<Layout><TutorialCenter /></Layout>} />
          <Route path="/quiz" element={<Layout><Quiz /></Layout>} />
        </Routes>
    </Provider>
  );
}

export default App;
