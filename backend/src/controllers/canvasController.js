const Canvas = require("../models/Canvas");

exports.createCanvas = async (req, res) => {
  try {
    const { researchTitle, authorName } = req.body;
    const userId = req.user.id;

    const existingCanvas = await Canvas.findOne({ user: userId });
    if (existingCanvas) {
      return res.status(400).json({ message: "User already has a canvas" });
    }

    const newCanvas = new Canvas({
      user: userId,
      researchTitle: researchTitle,
      authorName: authorName,
      components: [
        { name: "Problem Identification", status: "not started" },
        { name: "Literature Search", status: "not started" },
        { name: "Existing Solutions", status: "not started" },
        { name: "Market Landscape", status: "not started" },
        { name: "Novelty", status: "not started" },
        { name: "Research Question", status: "not started" },
        { name: "Research Methodology", status: "not started" },
        { name: "Key Resources", status: "not started" },
        { name: "Funding", status: "not started" },
        { name: "Team Capacities", status: "not started" },
        { name: "Research Outcome", status: "not started" },
      ],
    });

    await newCanvas.save();
    res.status(201).json({ message: "Canvas created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCanvas = async (req, res) => {
  try {
    const userId = req.user.id;
    const canvas = await Canvas.findOne({ user: userId });
    if (!canvas) {
      return res.status(404).json({ message: "Canvas not found" });
    }
    res.status(200).json(canvas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
