import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import DimensionHub from "./pages/DimensionHub";
import GameInterface from "./pages/GameInterface";
import TradingInterface from "./pages/TradingInterface";
import ProfileDashboard from "./pages/ProfileDashboard";
import Leaderboard from "./pages/Leaderboard";
import TutorialCenter from "./pages/TutorialCenter";
import Settings from "./pages/Settings";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dimensions" element={<DimensionHub />} />
        <Route path="/game" element={<GameInterface />} />
        <Route path="/trade" element={<TradingInterface />} />
        <Route path="/profile" element={<ProfileDashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/tutorial" element={<TutorialCenter />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes> 
    </Layout>
  );
}

export default App;
