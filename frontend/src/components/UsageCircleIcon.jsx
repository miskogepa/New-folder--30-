import React from "react";

export default function UsageCircleIcon({ maxUses, used, onUse, size = 80, icon, activeColor = "yellow" }) {
  const radius = size / 2 - 10;
  const strokeWidth = 6;
  const center = size / 2;
  const angleStep = 360 / maxUses;
  const gapAngle = 18;
  const segmentAngle = angleStep - gapAngle;

  return (
    <svg
      width={size}
      height={size}
      style={{ display: "block", margin: "0 auto", cursor: "pointer" }}
      onClick={onUse}
    >
      {[...Array(maxUses)].map((_, i) => {
        const startAngle = angleStep * i - 90 + gapAngle / 2;
        const endAngle = startAngle + segmentAngle;
        const startRad = startAngle * (Math.PI / 180);
        const endRad = endAngle * (Math.PI / 180);
        const x1 = center + radius * Math.cos(startRad);
        const y1 = center + radius * Math.sin(startRad);
        const x2 = center + radius * Math.cos(endRad);
        const y2 = center + radius * Math.sin(endRad);
        const largeArc = segmentAngle > 180 ? 1 : 0;
        const isActive = i < used;
        return (
          <path
            key={i}
            d={`M${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2}`}
            stroke={isActive ? activeColor : "#888"}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            opacity={isActive ? 1 : 0.3}
          />
        );
      })}
      <foreignObject x={center - 24} y={center - 24} width={48} height={48} pointerEvents="none">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 48,
            height: 48,
            pointerEvents: "none"
          }}
        >
          {icon}
        </div>
      </foreignObject>
    </svg>
  );
}
