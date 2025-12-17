import React from "react";
import "../../Exercises.css"; // Ensure styles are imported if not global

interface DetailHeaderProps {
  item: { id: number; name: string };
  label: string;
}

export const DetailHeader: React.FC<DetailHeaderProps> = ({ item, label }) => {
  return (
    <div className="detail-header">
      <div>
        <h1 className="detail-title">{item.name}</h1>
      </div>
      <span className="type-badge">{label}</span>
    </div>
  );
};
