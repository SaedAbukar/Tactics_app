import React from "react";
import "./LoadingSpinner.css";

interface LoadingSpinnerProps {
  /** Optional text to display below the spinner */
  message?: string;
  /** Full screen overlay (true) or inline block (false)? Default: false */
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  fullScreen = false,
}) => {
  return (
    <div className={`spinner-container ${fullScreen ? "fullscreen" : ""}`}>
      <div className="spinner-ring"></div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
};
