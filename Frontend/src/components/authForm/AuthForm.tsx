import React, { useState } from "react";
import { useAuth } from "../../context/Auth/AuthContext";

const AuthForm: React.FC = () => {
  const { user, loading, error, login, signup, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // for notifications

  const handleLogin = async () => {
    try {
      await login({ email, password });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignup = async () => {
    try {
      await signup({ email, password }); // single argument
      setMessage("Account created successfully! Please log in.");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      console.error(err);
      setMessage(""); // clear success if there was an error
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.email || user.id}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button onClick={handleLogin} disabled={loading}>
            Login
          </button>
          <button onClick={handleSignup} disabled={loading}>
            Signup
          </button>
          {error && <p style={{ color: "red" }}>{error.message}</p>}
          {message && <p style={{ color: "green" }}>{message}</p>}
        </div>
      )}
    </div>
  );
};

export default AuthForm;
