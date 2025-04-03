import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import "../../../CSS/Template27.css";

const chipColors = ["primary", "secondary", "info", "success", "warning"];
const getRandomColor = () =>
  chipColors[Math.floor(Math.random() * chipColors.length)];

const Template27 = () => {
  // State to manage input values for each category
  const [inputs, setInputs] = useState({
    functional: "",
    emotional: "",
    lifeChanging: "",
    socialImpact: "",
  });

  // Function to update input when a chip is clicked
  const handleChipClick = (category, value) => {
    setInputs((prev) => ({
      ...prev,
      [category]: prev[category] ? `${prev[category]}, ${value}` : value,
    }));
  };

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
        <tbody>
          {/* Functional Category */}
          <tr>
            <td className="category-column">Functional</td>
            <td className="chip-column">
              <Stack direction="row" spacing={0.5} flexWrap="wrap">
                {[
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
                ].map((label, index) => (
                  <Chip
                    key={index}
                    label={label}
                    color={getRandomColor()}
                    variant="outlined"
                    onClick={() => handleChipClick("functional", label)}
                  />
                ))}
              </Stack>
            </td>
            <td className="input-column">
              <TextField
                multiline
                rows={1}
                variant="outlined"
                value={inputs.functional}
                fullWidth
              />
            </td>
          </tr>

          {/* Emotional Category */}
          <tr>
            <td className="category-column">Emotional</td>
            <td className="chip-column">
              <Stack direction="row" spacing={0.5} flexWrap="wrap">
                {[
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
                ].map((label, index) => (
                  <Chip
                    key={index}
                    label={label}
                    color={getRandomColor()}
                    variant="outlined"
                    onClick={() => handleChipClick("emotional", label)}
                  />
                ))}
              </Stack>
            </td>
            <td className="input-column">
              <TextField
                multiline
                rows={1}
                variant="outlined"
                value={inputs.emotional}
                fullWidth
              />
            </td>
          </tr>

          {/* Life Changing Category */}
          <tr>
            <td className="category-column">Life Changing</td>
            <td className="chip-column">
              <Stack direction="row" spacing={0.5} flexWrap="wrap">
                {[
                  "Motivation",
                  "Heirloom",
                  "Affiliation and belonging",
                  "Provide hopes",
                  "Self-actualization",
                ].map((label, index) => (
                  <Chip
                    key={index}
                    label={label}
                    color={getRandomColor()}
                    variant="outlined"
                    onClick={() => handleChipClick("lifeChanging", label)}
                  />
                ))}
              </Stack>
            </td>
            <td className="input-column">
              <TextField
                multiline
                rows={1}
                variant="outlined"
                value={inputs.lifeChanging}
                fullWidth
              />
            </td>
          </tr>

          {/* Social Impact Category */}
          <tr>
            <td className="category-column">Social Impact</td>
            <td className="chip-column">
              <Stack direction="row" spacing={0.5} flexWrap="wrap">
                <Chip
                  label="Self-transcendence"
                  color={getRandomColor()}
                  variant="outlined"
                  onClick={() =>
                    handleChipClick("socialImpact", "Self-transcendence")
                  }
                />
              </Stack>
            </td>
            <td className="input-column">
              <TextField
                multiline
                rows={1}
                variant="outlined"
                value={inputs.socialImpact}
                fullWidth
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Template27;
