/**
 * Seed script to add Team Capacities step descriptions (Steps 3 & 4) to the database
 * Run with: node src/seeds/seedTeamCapacitiesSteps.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const StepDescription = require("../models/StepDescriptions");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/startovate";

const teamCapacitiesSteps = [
  {
    componentName: "Team Capacities",
    stepNumber: 3,
    description: `Skills and Capacities Required in Team Members

This step focuses on identifying the specific skills and capacities needed in your team to achieve key deliverables.

The template categorizes skills into three orientations:

1. **Thinking Oriented Tasks**
   - Analytical and problem-solving skills
   - Research and data analysis capabilities
   - Strategic planning and decision-making
   - Technical expertise and domain knowledge
   - Innovation and creative thinking

2. **Action Oriented Tasks**
   - Implementation and execution skills
   - Technical development capabilities
   - Project management and coordination
   - Hands-on experimentation and prototyping
   - Quality assurance and testing

3. **People Oriented Tasks**
   - Communication and presentation skills
   - Stakeholder management and networking
   - Team leadership and mentoring
   - Collaboration and teamwork
   - Negotiation and conflict resolution

For each key deliverable:
- Identify what thinking-oriented skills are needed (analysis, design, planning)
- Specify action-oriented skills required (development, testing, implementation)
- List people-oriented skills necessary (communication, coordination, leadership)

This mapping helps ensure your team has the right mix of capabilities to successfully complete each deliverable.`,
  },
  {
    componentName: "Team Capacities",
    stepNumber: 4,
    description: `Presence or Absence of Skills and Capacities in Team Members

This step focuses on assessing whether your team currently possesses the required skills and capacities, and planning for any gaps.

For each key deliverable, evaluate:

1. **Required Skills & Capacities**
   - List specific technical skills (programming languages, tools, methodologies)
   - Include domain expertise (industry knowledge, research experience)
   - Note soft skills needed (communication, leadership, collaboration)

2. **Status Assessment**
   - Present: Team has the required capability
   - Absent: Team lacks this capability
   - Partially Available: Limited capability exists

3. **If Skills are Present**
   - Name the team member(s) who possess these skills
   - Note their availability and commitment level
   - Consider backup options if primary person is unavailable

4. **If Skills are Absent**
   - Explain why the skill is missing (specialized expertise, resource constraints)
   - Assess the impact on project deliverables
   - Prioritize which gaps are most critical to address

5. **Action Plan for Absent Skills**
   - Hire new team member or consultant
   - Collaborate with industry expert or academic partner
   - Provide training for existing team members
   - Outsource specific tasks
   - Partner with another research group

This assessment helps identify skill gaps early and develop strategies to address them before they impact project success.`,
  },
];

async function seedTeamCapacitiesSteps() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    for (const step of teamCapacitiesSteps) {
      await StepDescription.findOneAndUpdate(
        { componentName: step.componentName, stepNumber: step.stepNumber },
        step,
        { upsert: true, new: true }
      );
      console.log(`✅ Seeded: ${step.componentName} - Step ${step.stepNumber}`);
    }

    console.log("\n✅ All Team Capacities step descriptions seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding Team Capacities steps:", error);
    process.exit(1);
  }
}

seedTeamCapacitiesSteps();
