import React, { useState } from "react";

const LoginPage = ({ onLogin, apiBaseUrl }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState("login");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const endpoint = mode === "signup" ? "signup" : "login";
      const response = await fetch(`${apiBaseUrl}/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || "Authentication failed");
      }
      const payload = await response.json();
      onLogin(payload);
    } catch (authError) {
      setError(authError.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rm-login-shell">
      <div className="rm-login-card">
        <p className="rm-eyebrow">Frontend Demo Access</p>
        <h1>Rick and Morty Character Console</h1>
        <p className="rm-muted">
          Sign in to run live character search and persist your own submissions with image uploads.
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
          {error ? <p className="rm-error">{error}</p> : null}
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Please wait..." : mode === "signup" ? "Create Account" : "Login"}
          </button>
          <button
            type="button"
            className="rm-secondary-btn"
            onClick={() => setMode((current) => (current === "signup" ? "login" : "signup"))}
          >
            {mode === "signup" ? "Have an account? Login" : "Need an account? Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
