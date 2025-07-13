import React from "react";
import { Button } from "@chakra-ui/react";
import { FaRotateLeft } from "react-icons/fa6";

export default function UsageCircleIcon({
  maxUses,
  used,
  onUse,
  onReset,
  size = 80,
  icon,
  activeColor = "yellow",
  disabled = false,
}) {
  const radius = size / 2 - 10;
  const strokeWidth = 6;
  const center = size / 2;
  const angleStep = 360 / maxUses;
  const gapAngle = 18;
  const segmentAngle = angleStep - gapAngle;

  return (
    <div style={{ textAlign: "center" }}>
      <svg
        width={size}
        height={size}
        style={{
          display: "block",
          margin: "0 auto",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
        }}
        onClick={disabled ? undefined : onUse}
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
        <foreignObject
          x={center - 24}
          y={center - 24}
          width={48}
          height={48}
          pointerEvents="none"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              pointerEvents: "none",
            }}
          >
            {icon}
          </div>
        </foreignObject>
      </svg>

      {/* Reset dugme - prikazuje se samo ako je used > 0 */}
      {used > 0 && onReset && (
        <Button
          size="xs"
          onClick={onReset}
          variant="ghost"
          colorScheme="red"
          mt={2}
          leftIcon={<FaRotateLeft />}
          disabled={disabled}
          _hover={{ bg: "red.100" }}
        >
          Reset
        </Button>
      )}
    </div>
  );
}
