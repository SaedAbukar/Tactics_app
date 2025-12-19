import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/Auth/AuthContext";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import "./AuthForm.css";

const AuthForm: React.FC = () => {
  const { user, loading, error, login, signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoginView, setIsLoginView] = useState(true);

  const navigate = useNavigate(); // 2. Initialize hook

  // 3. Redirect to home if user is logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      // Navigation will happen automatically via the useEffect above
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup({ email, password });
      setMessage("Account created successfully! Please log in.");
      setIsLoginView(true);
      setEmail("");
      setPassword("");
    } catch (err: any) {
      console.error(err);
      setMessage("");
    }
  };

  // 4. If user exists, return null (or a spinner) while redirecting
  if (user) return null;

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
