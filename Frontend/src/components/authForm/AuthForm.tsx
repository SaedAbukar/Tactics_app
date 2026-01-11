import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // 1. Import useTranslation
import "./AuthForm.css";

const AuthForm: React.FC = () => {
  const { user, loading, error, login, signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoginView, setIsLoginView] = useState(true);

  const navigate = useNavigate();
  const { t } = useTranslation("auth"); // 2. Initialize hook

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

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
      setMessage(t("success_signup")); // Translated success message
      setIsLoginView(true);
      setEmail("");
      setPassword("");
    } catch (err: any) {
      console.error(err);
      setMessage("");
    }
  };

  if (user) return null;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">
            {isLoginView ? t("title_login") : t("title_signup")}
          </h1>
          <p className="auth-subtitle">
            {isLoginView ? t("subtitle_login") : t("subtitle_signup")}
          </p>
        </div>

        <form
          onSubmit={isLoginView ? handleLogin : handleSignup}
          className="auth-form"
        >
          <div className="form-group">
            <label htmlFor="email">{t("email_label")}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("email_placeholder")}
              className="auth-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t("password_label")}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("password_placeholder")}
              className="auth-input"
              required
            />
          </div>

          {error && <div className="auth-message error">{error.message}</div>}
          {message && <div className="auth-message success">{message}</div>}

          <button type="submit" disabled={loading} className="auth-btn primary">
            {loading
              ? t("button_loading")
              : isLoginView
              ? t("button_login")
              : t("button_signup")}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLoginView ? t("footer_no_account") : t("footer_has_account")}{" "}
            <button
              type="button"
              className="link-btn"
              onClick={() => {
                setIsLoginView(!isLoginView);
                setMessage("");
              }}
            >
              {isLoginView ? t("link_signup") : t("link_login")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
