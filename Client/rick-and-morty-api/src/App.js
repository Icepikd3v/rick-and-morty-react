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
import "./App.css";

const API_BASE_URL = process.env.REACT_APP_RM_API_URL || "http://localhost:5051/api";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("rmToken");
    const savedUser = localStorage.getItem("rmUser");
    setToken(savedToken || "");
    setCurrentUser(savedUser ? JSON.parse(savedUser) : null);
    setIsAuthenticated(Boolean(savedToken));
  }, []);

  const handleLogin = ({ token: nextToken, user }) => {
    setToken(nextToken);
    setCurrentUser(user);
    localStorage.setItem("rmToken", nextToken);
    localStorage.setItem("rmUser", JSON.stringify(user || {}));
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("rmToken");
    localStorage.removeItem("rmUser");
    setToken("");
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} apiBaseUrl={API_BASE_URL} />;
  }

  return (
    <Router>
      <div className="App rm-shell">
        <Header/>
        <div className="rm-top-actions">
          <span className="rm-login-pill">{currentUser?.email || "Authenticated User"}</span>
          <button onClick={handleLogout} className="rm-logout-btn">Logout</button>
        </div>
        <AudioPlayer />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage apiBaseUrl={API_BASE_URL} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/submit" element={<SubmitPage apiBaseUrl={API_BASE_URL} token={token} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
