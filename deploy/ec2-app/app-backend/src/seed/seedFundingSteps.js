/**
 * Seed script to add Funding step descriptions to the database
 * Run with: node src/seeds/seedFundingSteps.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const StepDescription = require("../models/StepDescriptions");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/startovate";

const fundingSteps = [
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

async function seedFundingSteps() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    for (const step of fundingSteps) {
      await StepDescription.findOneAndUpdate(
        { componentName: step.componentName, stepNumber: step.stepNumber },
        step,
        { upsert: true, new: true }
      );
      console.log(`✅ Seeded: ${step.componentName} - Step ${step.stepNumber}`);
    }

    console.log("\n✅ All Funding step descriptions seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding Funding steps:", error);
    process.exit(1);
  }
}

seedFundingSteps();
