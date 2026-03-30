import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import AboutPage from "./pages/AboutPage";
import SubmitPage from "./pages/SubmitPage";
import LoginPage from "./pages/LoginPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AudioPlayer from "./components/AudioPlayer";
import { DEMO_EMAIL, DEMO_PASSWORD } from "./constants/demoAuth";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("rmDemoAuth");
    setIsAuthenticated(auth === "true");
  }, []);

  const handleLogin = (email, password) => {
    const ok = email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;
    if (!ok) return false;
    localStorage.setItem("rmDemoAuth", "true");
    setIsAuthenticated(true);
    return true;
  };

  const handleLogout = () => {
    localStorage.removeItem("rmDemoAuth");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="App rm-shell">
        <Header/>
        <div className="rm-top-actions">
          <button onClick={handleLogout} className="rm-logout-btn">Logout</button>
        </div>
        <AudioPlayer />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/submit" element={<SubmitPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
