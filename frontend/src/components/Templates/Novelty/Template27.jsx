import React, { useMemo } from "react";
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

  const handleChipClick = (category, value) => {
    const currentValue = answers?.[`value_${category}_`] || "";
    const currentValues = currentValue
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v !== "");

    if (currentValues.includes(value)) return; // Avoid duplicates

    const newValues = [...currentValues, value];
    const fieldName = `value_${category}_`;
    // Create a synthetic event for onInputChange
    const syntheticEvent = {
      target: { value: newValues.join(", ") },
    };
    onInputChange(syntheticEvent, fieldName);
  };

  const handleInputChange = (category, text) => {
    const fieldName = `value_${category}_`;
    const syntheticEvent = {
      target: { value: text },
    };
    onInputChange(syntheticEvent, fieldName);
  };

  const renderRow = (category) => {
    const fieldName = `value_${category}_`;
    const currentValue = answers?.[fieldName] || "";

    return (
      <tr key={category}>
        <td className="category-column">
          {category.replace(/([A-Z])/g, " $1")}
        </td>
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
            value={currentValue}
            onChange={(e) => handleInputChange(category, e.target.value)}
          />
        </td>
      </tr>
    );
  };

  return (
    <div className="container" data-export-section="main-section">
      <h3 className="header">
        Market Mapping and Competitive Landscape Matrix
      </h3>
      <div data-export-section="table">
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
    </div>
  );
};

export default Template27;
