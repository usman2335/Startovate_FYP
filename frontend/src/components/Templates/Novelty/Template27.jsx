import React from "react";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import "../../../CSS/Template27.css";

const chipColors = ["primary", "secondary", "info", "success", "warning"];

const getRandomColor = () => {
  return chipColors[Math.floor(Math.random() * chipColors.length)];
};

const Template27 = () => {
  return (
    <div className="container">
      {/* Header Section */}
      <div className="header">
        Market Mapping and Competitive Landscape Matrix
      </div>

      {/* Table Section */}
      <table className="table">
        <thead>
          <tr>
            <th>30 Elements of Value</th>
            <th>Example</th>
            <th>What value your proposed invention offers</th>
          </tr>
        </thead>
        <tbody>
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
                  />
                ))}
              </Stack>
            </td>
            <td className="input-column">
              <TextField
                id="unique-textfield"
                multiline
                rows={1}
                variant="outlined"
                className="unique-textfield"
              />
            </td>
          </tr>
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
                  />
                ))}
              </Stack>
            </td>
            <td className="input-column">
              <TextField
                id="unique-textfield"
                multiline
                rows={1}
                variant="outlined"
                className="unique-textfield"
              />
            </td>
          </tr>
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
                  />
                ))}
              </Stack>
            </td>
            <td className="input-column">
              <TextField
                id="unique-textfield"
                multiline
                rows={1}
                variant="outlined"
                className="unique-textfield"
              />
            </td>
          </tr>
          <tr>
            <td className="category-column">Social Impact</td>
            <td className="chip-column">
              <Stack direction="row" spacing={0.5} flexWrap="wrap">
                <Chip
                  label="Self-transcendence"
                  color={getRandomColor()}
                  variant="outlined"
                />
              </Stack>
            </td>
            <td className="input-column">
              <TextField
                id="unique-textfield"
                multiline
                rows={1}
                variant="outlined"
                className="unique-textfield"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Template27;
