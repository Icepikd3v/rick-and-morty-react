import React, { useState } from "react";
import { DEMO_EMAIL, DEMO_PASSWORD } from "../constants/demoAuth";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!onLogin(email, password)) {
      setError("Invalid demo credentials. Please use the credentials shown below.");
      return;
    }
    setError("");
  };

  return (
    <div className="rm-login-shell">
      <div className="rm-login-card">
        <p className="rm-eyebrow">Frontend Demo Access</p>
        <h1>Rick and Morty Character Console</h1>
        <p className="rm-muted">
          Login to explore character search, pagination, and submit-page flows in demo-safe mode.
        </p>
        <form className="rm-login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <p className="rm-demo-creds">
            Demo login: <strong>{DEMO_EMAIL}</strong> / <strong>{DEMO_PASSWORD}</strong>
          </p>
          {error ? <p className="rm-error">{error}</p> : null}
          <button type="submit">Enter Demo Mode</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
