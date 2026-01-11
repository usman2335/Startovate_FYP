const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

console.log("mongoURI:", process.env.MONGO_URI); // should print your URI

const mongoose = require("mongoose");
const StepDescription = require("../models/StepDescriptions");

// Replace with your MongoDB connection string
const mongoURI = process.env.MONGO_URI;
console.log("mongoURI:", mongoURI);

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
  // Funding Templates
  {
    componentName: "Funding",
    stepNumber: 1,
    description: `Total Grant Desired for Research Process

This step focuses on determining the total funding required for your research project supporting the invention.

Key aspects to consider:
- Calculate the comprehensive budget needed for all research activities
- Include direct costs (equipment, materials, personnel) and indirect costs (overhead, administration)
- Consider the timeline and phases of your research
- Account for contingencies and unexpected expenses
- Align the budget with your research objectives and expected outcomes

The justification should clearly explain:
- Why this amount is necessary
- How the funds will be allocated across different research activities
- The expected return on investment in terms of research outcomes
- Comparison with similar research projects if available`,
  },
  {
    componentName: "Funding",
    stepNumber: 2,
    description: `Tangible Resources & Equipment Budget

This step focuses on budgeting for physical resources and equipment required for different key deliverables.

Key aspects to consider:
- List all tangible resources needed (lab equipment, materials, hardware, software licenses)
- Associate each resource with specific key deliverables
- Estimate quantities required for each resource
- Research current market prices for accurate cost estimation
- Consider whether to purchase, lease, or rent equipment
- Include installation, maintenance, and calibration costs

For each row, specify:
- Key Deliverable: The research output this resource supports
- Resource/Equipment: Specific item name and specifications
- Quantity: Number of units needed
- Estimated Cost: Total cost including any associated expenses`,
  },
  {
    componentName: "Funding",
    stepNumber: 3,
    description: `Skills & Capacities Budget (Intangible Resources)

This step focuses on budgeting for human resources, skills, and expertise required for the research.

Key aspects to consider:
- Identify all roles needed (researchers, technicians, consultants, students)
- Define the specific skills and capacities required for each role
- Estimate the duration of engagement for each team member
- Calculate costs based on salary scales, hourly rates, or consulting fees
- Include benefits, training costs, and professional development
- Consider both internal team members and external consultants

For each row, specify:
- Role: Position or title (e.g., Research Assistant, Lab Technician, Domain Expert)
- Skill/Capacity: Specific expertise required
- Duration: Time commitment (hours, months, or project phases)
- Cost: Total compensation including all associated costs`,
  },
  {
    componentName: "Funding",
    stepNumber: 4,
    description: `Visits & Stakeholder Meetings Budget

This step focuses on budgeting for travel, visits, and meetings with stakeholders to discover end-user needs and industrial interest.

Key aspects to consider:
- Plan visits to potential end-users, industry partners, and collaborators
- Include conference attendance for networking and knowledge sharing
- Budget for organizing workshops or focus groups
- Consider both domestic and international travel if applicable
- Include accommodation, transportation, and per diem expenses
- Account for virtual meeting tools and platforms if needed

For each row, specify:
- Activity: Type of visit or meeting (site visit, conference, workshop, etc.)
- Stakeholder: Who you will meet (industry partner, end-user, collaborator)
- Purpose: Objective of the meeting (needs discovery, validation, partnership)
- Cost: Total estimated cost including travel, accommodation, and incidentals`,
  },
  {
    componentName: "Funding",
    stepNumber: 5,
    description: `Funding with respect to Technology Readiness Level (TRL)

This step focuses on mapping funding requirements to different stages of technology development.

Technology Readiness Levels:
1. Basic Principles - Fundamental research and observation
2. Technology Concept - Practical applications identified
3. Proof of Concept - Analytical and experimental validation
4. Laboratory Validation - Component validation in lab environment
5. Model Demonstration - Integration in relevant environment
6. Functional Prototype - System prototype demonstration
7. Test Qualified - System demonstration in operational environment
8. Commercial Evaluation - Actual system proven in operational environment

For each TRL stage:
- Estimate the budget required to achieve that level
- Identify potential funding sources (grants, investors, industry partners)
- Consider which TRL stages are most relevant to your current research phase
- Plan for progressive funding as you advance through TRL stages

Potential funding sources include:
- Government research grants (NSF, NIH, DOE, etc.)
- University internal funding
- Industry partnerships and sponsorships
- Venture capital and angel investors
- Crowdfunding platforms
- Technology transfer office support`,
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
