import React from "react";

type PenaltyBoxProps = {
  width: number; // total width of the pitch
  height: number; // total height of the pitch
};

const PenaltyBox: React.FC<PenaltyBoxProps> = ({ width, height }) => {
  // Box dimensions
  const penaltyWidth = 180;
  const penaltyDepth = 120;
  const fiveYardWidth = 50;
  const fiveYardDepth = 50;

  // Position from left
  const startX = (width - penaltyWidth) / 2;
  const startY = height - penaltyDepth;

  const fiveStartX = (width - fiveYardWidth) / 2;
  const fiveStartY = height - fiveYardDepth;

  // SVG paths
  const penaltyBoxPath = `
    M ${startX} ${height} 
    L ${startX} ${startY} 
    L ${startX + penaltyWidth} ${startY} 
    L ${startX + penaltyWidth} ${height} 
  `;

  const fiveYardBoxPath = `
    M ${fiveStartX} ${height} 
    L ${fiveStartX} ${fiveStartY} 
    L ${fiveStartX + fiveYardWidth} ${fiveStartY} 
    L ${fiveStartX + fiveYardWidth} ${height} 
  `;

  return (
    <svg width={width} height={height} style={{ border: "1px solid green" }}>
      {/* Penalty box */}
      <path
        d={penaltyBoxPath}
        stroke="white"
        strokeWidth={2}
        fill="transparent"
      />

      {/* Five-yard box */}
      <path
        d={fiveYardBoxPath}
        stroke="white"
        strokeWidth={2}
        fill="transparent"
      />
    </svg>
  );
};

export default PenaltyBox;
