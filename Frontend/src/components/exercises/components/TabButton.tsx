import "../Exercises.css";

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

export const TabButton = ({ active, onClick, label }: TabButtonProps) => (
  <button onClick={onClick} className={`tab-button ${active ? "active" : ""}`}>
    {label}
  </button>
);
