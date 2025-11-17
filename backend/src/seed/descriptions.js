require("dotenv").config();
const mongoose = require("mongoose");
const StepDescription = require("../models/StepDescriptions");

// Use MongoDB connection string from .env file, with fallback to default
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/startovate";

const stepDescriptions = [
  {
    componentName: "Problem Identification",
    stepNumber: 1,
    description: "Identification of the real-world practical problem.",
  },
  {
    componentName: "Problem Identification",
    stepNumber: 2,
    description:
      "Incident, event, or condition causing and characterizing the real world practical problem.",
  },
  {
    componentName: "Problem Identification",
    stepNumber: 3,
    description:
      "Motivation and justification of the proposed invention for solving the real-world practical problem.",
  },
  {
    componentName: "Problem Identification",
    stepNumber: 4,
    description:
      "Existence and intensity of the problem with reference to websites, news, conference proceedings, research articles and reports etc.",
  },
  {
    componentName: "Problem Identification",
    stepNumber: 5,
    description:
      "Stakeholders (end users, industrial experts, inventors, researchers, collaborators, federal/provincial organizations etc.) related to the problem.",
  },
  {
    componentName: "Problem Identification",
    stepNumber: 6,
    description:
      "Details of informal/formal meetings and academic/industrial conferences where the real-world problem is discussed.",
  },
  {
    componentName: "Problem Identification",
    stepNumber: 7,
    description:
      "Supportive Associations/ Foundations/ Standards/ Regulations e.g., Food and Drug Administration, Federal Communications Commission, Federal Energy Regulatory Commission, Federal Trade Commission, IEEE Standards Committees etc.",
  },
  {
    componentName: "Problem Identification",
    stepNumber: 8,
    description:
      "Code of relevant industry available at Standard Industry Classification, North American Industry Classification, and any other relevant websites.",
  },
  {
    componentName: "Existing Solutions",
    stepNumber: 1,
    description:
      "Listing of solutions of the real-world problem already available in the market.",
  },
  {
    componentName: "Existing Solutions",
    stepNumber: 2,
    description:
      "Exploration of similar problems and solutions beyond the single industry.",
  },
  {
    componentName: "Existing Solutions",
    stepNumber: 3,
    description:
      "Limitations of the existing solutions and reasons behind failing to exactly solve the real-world problem.",
  },
  {
    componentName: "Existing Solutions",
    stepNumber: 4,
    description:
      "Patents associated with the existing solutions and their market status.",
  },
  {
    componentName: "Existing Solutions",
    stepNumber: 5,
    description:
      "Patents associated with the existing solutions and their market status.",
  },
  {
    componentName: "Existing Solutions",
    stepNumber: 6,
    description:
      "Justification behind how the proposed invention can meet the highlighted limitations of the existing solutions",
  },
  {
    componentName: "Literature Search",
    stepNumber: 1,
    description:
      "Keywords representing Problem, Proposed Solution and Context for research application.",
  },
  {
    componentName: "Literature Search",
    stepNumber: 2,
    description:
      "Research gap conceived through observations and discussions with stakeholders.",
  },
  {
    componentName: "Literature Search",
    stepNumber: 3,
    description:
      "Research gap conceived through research articles and patents via keywords and semantic search techniques.",
  },
  {
    componentName: "Literature Search",
    stepNumber: 4,
    description:
      "Comparisons of findings, similarities, and differences in features of existing research.",
  },
  {
    componentName: "Literature Search",
    stepNumber: 5,
    description: "Reference list of research articles and patents etc.",
  },
  {
    componentName: "Market Landscape",
    stepNumber: 1,
    description:
      "List of company names, websites, and contacts details offering the existing solutions in market.",
  },
  {
    componentName: "Market Landscape",
    stepNumber: 2,
    description:
      "Number of end-users and annual revenue of companies offering existing solutions in the market.",
  },
  {
    componentName: "Market Landscape",
    stepNumber: 3,
    description:
      "Evidence from news, reports and articles showing chance of potential growth or decline of the industry hosting the existing solutions in the market (e.g., CAGR).",
  },
  {
    componentName: "Market Landscape",
    stepNumber: 4,
    description:
      "Identification of potential end-users who are ready to pay for the proposed invention.",
  },
  {
    componentName: "Market Landscape",
    stepNumber: 5,
    description:
      "Identification of similar inventions in the R&D pipeline, found during conferences and meetings with stakeholders.",
  },
  {
    componentName: "Market Landscape",
    stepNumber: 6,
    description:
      "Justification of market acceptance of proposed invention and chances of its growth in presence of existing solutions",
  },
  {
    componentName: "Market Landscape",
    stepNumber: 7,
    description:
      "Payment mode for proposed invention (paid by direct end-user or by indirect end-users via intermediate business or channel).",
  },
  {
    componentName: "Novelty",
    stepNumber: 1,
    description:
      "Key feature(s) of proposed invention linking to its value proposition with 30 elements of value (e.g., functional, emotional, life changing or social impact).",
  },
  {
    componentName: "Novelty",
    stepNumber: 2,
    description:
      "Mapping between identified problem and novelty feature(s) of proposed invention.",
  },
  {
    componentName: "Novelty",
    stepNumber: 3,
    description:
      "Discussions on whether proposed invention claims for similarities with other inventors’ work or offers a critique that led to the novelty feature(s).",
  },
  {
    componentName: "Research Question",
    stepNumber: 1,
    description:
      "Single statement most valuable research question (MVRq) describing the real-world problem to be solved.",
  },
  {
    componentName: "Research Question",
    stepNumber: 2,
    description:
      "Alignment of research question with research gap, found through literature search and observed through stakeholders’ interactions.",
  },
  {
    componentName: "Research Question",
    stepNumber: 3,
    description:
      "Convergence from limitations identified in existing solutions.",
  },
  {
    componentName: "Research Question",
    stepNumber: 4,
    description:
      "Demonstration of originality and relevancy with different theories/models.",
  },
  {
    componentName: "Research Question",
    stepNumber: 5,
    description: "Supportive objectives and tentative hypotheses.",
  },
  {
    componentName: "Research Question",
    stepNumber: 6,
    description:
      "Consistency between research problem, research question, research objectives, hypotheses and research approach",
  },
];

async function seedDescriptions() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    await StepDescription.deleteMany({});
    console.log("Cleared existing step descriptions");

    await StepDescription.insertMany(stepDescriptions);
    console.log("Seeded step descriptions successfully");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedDescriptions();
