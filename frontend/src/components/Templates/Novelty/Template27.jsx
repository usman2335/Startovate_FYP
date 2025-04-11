import React, { useState, useMemo } from "react";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import "../../../CSS/Template27.css";

const chipColors = ["primary", "secondary", "info", "success", "warning"];

const Template27 = ({ answers, onInputChange }) => {
  const categories = {
    functional: [
      "Save time",
      "Simplifies",
      "Makes money",
      "Reduces risk",
      "Organizes",
      "Integrates",
      "Connect",
      "Reduces efforts",
      "Avoid hassles",
      "Reduce cost",
      "Quality",
      "Variety",
      "Sensory appeal",
      "Inform",
    ],
    emotional: [
      "Wellness",
      "Therapeutic value",
      "Fun and entertainment",
      "Attractiveness",
      "Provide access",
      "Reduce anxiety",
      "Reward me",
      "Nostalgia",
      "Design / aesthetics",
      "Badge value",
    ],
    lifeChanging: [
      "Motivation",
      "Heirloom",
      "Affiliation and belonging",
      "Provide hopes",
      "Self-actualization",
    ],
    socialImpact: ["Self-transcendence"],
  };

  // Random colors locked with useMemo
  const chipColorMap = useMemo(() => {
    const map = {};
    Object.values(categories)
      .flat()
      .forEach((label) => {
        map[label] = chipColors[Math.floor(Math.random() * chipColors.length)];
      });
    return map;
  }, []);

  const [inputs, setInputs] = useState({
    functional: [],
    emotional: [],
    lifeChanging: [],
    socialImpact: [],
  });

  const handleChipClick = (category, value) => {
    setInputs((prev) => {
      if (prev[category].includes(value)) return prev; // Avoid duplicates
      return {
        ...prev,
        [category]: [...prev[category], value],
      };
    });
  };

  const handleInputChange = (category, text) => {
    const values = text
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v !== "");
    setInputs((prev) => ({
      ...prev,
      [category]: values,
    }));
  };

  const renderRow = (category) => (
    <tr key={category}>
      <td className="category-column">{category.replace(/([A-Z])/g, " $1")}</td>
      <td className="chip-column">
        <Stack direction="row" spacing={0.5} flexWrap="wrap">
          {categories[category].map((label, idx) => (
            <Chip
              key={idx}
              label={label}
              color={chipColorMap[label]}
              variant="outlined"
              onClick={() => handleChipClick(category, label)}
            />
          ))}
        </Stack>
      </td>
      <td className="input-column">
        <TextField
          multiline
          rows={2}
          variant="outlined"
          fullWidth
          value={inputs[category].join(", ")}
          onChange={(e) => handleInputChange(category, e.target.value)}
        />
      </td>
    </tr>
  );

  return (
    <div className="container">
      <div className="header">
        Market Mapping and Competitive Landscape Matrix
      </div>
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>30 Elements of Value</th>
            <th>What value your proposed invention offers</th>
          </tr>
        </thead>
        <tbody>{Object.keys(categories).map(renderRow)}</tbody>
      </table>
    </div>
  );
};

export default Template27;
