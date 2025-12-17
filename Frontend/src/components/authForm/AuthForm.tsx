import React, { useState } from "react";
import { useAuth } from "../../context/Auth/AuthContext";
import "./AuthForm.css";

const AuthForm: React.FC = () => {
  const { user, loading, error, login, signup, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoginView, setIsLoginView] = useState(true); // Toggle between Login/Signup view

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup({ email, password });
      setMessage("Account created successfully! Please log in.");
      setIsLoginView(true); // Switch back to login view
      setEmail("");
      setPassword("");
    } catch (err: any) {
      console.error(err);
      setMessage("");
    }
  };

  if (user) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Welcome back!</h2>
          <p className="auth-subtitle">You are logged in as {user.email}</p>
          <button onClick={logout} className="auth-btn secondary">
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">
            {isLoginView ? "Sign In" : "Create Account"}
          </h1>
          <p className="auth-subtitle">
            {isLoginView
              ? "Welcome back to Tactics App"
              : "Start organizing your training today"}
          </p>
        </div>

        <form
          onSubmit={isLoginView ? handleLogin : handleSignup}
          className="auth-form"
        >
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="auth-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="auth-input"
              required
            />
          </div>

          {error && <div className="auth-message error">{error.message}</div>}
          {message && <div className="auth-message success">{message}</div>}

          <button type="submit" disabled={loading} className="auth-btn primary">
            {loading ? "Please wait..." : isLoginView ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLoginView
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              className="link-btn"
              onClick={() => {
                setIsLoginView(!isLoginView);
                setMessage("");
              }}
            >
              {isLoginView ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
