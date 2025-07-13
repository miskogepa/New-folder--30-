import React, { useState } from "react";
import UsageCircleIcon from "./UsageCircleIcon";
import "./App.css";

export default function App() {
  const [maxUses, setMaxUses] = useState(5);
  const [used, setUsed] = useState(0);

  const handleInputChange = (e) => {
    const value = Math.max(1, Math.min(12, Number(e.target.value)));
    setMaxUses(value);
    setUsed(0);
  };

  const handleUse = () => {
    setUsed((prev) => (prev < maxUses ? prev + 1 : prev));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#181c20",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <label htmlFor="max-uses" style={{ fontSize: 20, marginRight: 12 }}>
          Koliko puta želiš da iskorišćiš alat danas?
        </label>
        <input
          id="max-uses"
          type="number"
          min={1}
          max={12}
          value={maxUses}
          onChange={handleInputChange}
          style={{
            fontSize: 20,
            width: 60,
            borderRadius: 6,
            border: "1px solid #333",
            padding: 4,
            background: "#222",
            color: "#fff",
          }}
        />
      </div>
      <div
        style={{
          width: 120,
          height: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <UsageCircleIcon
          maxUses={maxUses}
          used={used}
          onUse={handleUse}
          size={100}
        />
      </div>
      <div style={{ fontSize: 18 }}>
        iskorišćeno: {used} / {maxUses}
      </div>
    </div>
  );
}
