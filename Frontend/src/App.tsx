import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppHeader from './components/layout/AppHeader';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import FloatingResumes from './components/FloatingResumes';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        <FloatingResumes />

        <AppHeader />
        
        <main className="flex-1 w-full relative">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/analyze" element={<HomePage />} />
            <Route path="/results" element={<ResultsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
