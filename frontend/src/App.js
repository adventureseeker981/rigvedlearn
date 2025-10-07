import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import LessonsPage from "./components/LessonsPage";
import LessonView from "./components/LessonView";
import AchievementsPage from "./components/AchievementsPage";
import QuestsPage from "./components/QuestsPage";
import PracticePage from "./components/PracticePage";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lessons" element={<LessonsPage />} />
          <Route path="/lesson/:hymnId/:lessonId" element={<LessonView />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/quests" element={<QuestsPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
