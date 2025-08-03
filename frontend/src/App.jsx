import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import DimensionHub from './pages/DimensionHub';
import GameInterface from './pages/GameInterface';
import ProfileDashboard from './pages/ProfileDashboard';
import Leaderboard from './pages/Leaderboard';
import TutorialCenter from './pages/TutorialCenter';
import DuelArena from './pages/DuelArena';

function App() {
  return (
    <Provider store={store}>
        <Routes>
          <Route path="/" element={<Layout><LandingPage /></Layout>} />
          <Route path="/dimensions" element={<Layout><DimensionHub /></Layout>} />
          <Route path="/game/:scenarioId" element={<Layout><GameInterface /></Layout>} />
          <Route path="/profile" element={<Layout><ProfileDashboard /></Layout>} />
          <Route path="/leaderboard" element={<Layout><Leaderboard /></Layout>} />
          <Route path="/tutorial" element={<Layout><TutorialCenter /></Layout>} />
          <Route path="/duel/:id" element={<Layout><DuelArena /></Layout>} />
        </Routes>
    </Provider>
  );
}

export default App;
