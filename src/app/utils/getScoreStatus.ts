import { cache } from "react";
import { getBaseId, getBaseTable } from "../api/utils";

export type Test = {
  name: string;
  href: string;
  unit: string;
  description: string;
  implemented: boolean;
};

export const allTests: Test[] = [
  {
    name: "Typing Speed",
    description: "Test your typing speed! How many wpm can you type?",
    unit: "WPM",
    href: "/typing-speed",
    implemented: true,
  },
  {
    name: "Keyboard Shortcuts",
    description:
      "Everytime you use the mouse, a fairy loses her wings! Practice your keyboard shortcuts now.",
    unit: "points",
    href: "/keyboard-shortcut-test",
    implemented: true,
  },
  {
    name: "Support Response",
    description:
      "Practice how to talk to customers!  Remember to use your AI assistant and snippets.",
    unit: "points",
    href: "/support-test",
    implemented: true,
  },
  {
    name: "Figma Wireframe Speed",
    description:
      "How fast can you create a wireframe for the prompt? Remember to open figma before starting!",
    unit: "seconds",
    href: "/figma-wireframe-speed",
    implemented: true,
  },
  {
    name: "UI Element Recognition",
    description: "Can you identify the given UI element?",
    unit: "% correct",
    href: "/ui-element-recognition",
    implemented: true,
  },

  {
    name: "Color Harmony Test",
    description: "Are these colours harmonious? Remember your colour theory!",
    unit: "% correct",
    href: "/color-harmony",
    implemented: true,
  },
  {
    name: "User Flow Completion Time",
    description: "How fast can you complete the user flow?",
    unit: "seconds",
    href: "/user-flow-completion",
    implemented: true,
  },
  {
    name: "Accessibility Checklist",
    description: "Can you recognise good accessibility practice?",
    unit: "% correct",
    href: "/accessibility-checklist",
    implemented: true,
  },
  {
    name: "Heuristic Evaluation Test",
    description: "Use your knowledge of heuristics to review the interface!",
    unit: "% correct",
    href: "/heuristic-evaluation",
    implemented: true,
  },
  {
    name: "Interaction Design Speed",
    description:
      "How fast can you complete the random task given? Remember to open figma before starting.",
    unit: "interactions/minute",
    href: "/interaction-design-speed",
    implemented: true,
  },
  {
    name: "Information Architecture Sorting",
    description: "Can you sort the information architecture?",
    unit: "% correct",
    href: "/information-architecture-sorting",
    implemented: false,
  },
  {
    name: "Visual Hierarchy Analysis",
    description: "Can you identify the visual hierarchy?",
    unit: "% correct",
    href: "/visual-hierarchy-analysis",
    implemented: false,
  },
];

export type ScoreStatus = {
  [key: string]: boolean;
};

export function testId(test: Test) {
  return `${test.name} (${test.unit})`;
}

export const getScoreStatus = cache(
  async (userId: string): Promise<ScoreStatus> => {
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = getBaseId(userId);
    const baseName = getBaseTable(userId);

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error("Missing required environment variables");
    }

    const currentDate = new Date().toISOString().split("T")[0];

    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${baseName}?filterByFormula={Date}='${currentDate}'`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
        next: {
          revalidate:
            currentDate === new Date().toISOString().split("T")[0] ? 0 : false,
        }, // cache forever unless currentDate is today
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch score status");
    }

    const data = (await res.json()) as { records: { fields: ScoreStatus }[] };
    //console.log("fetched from airtable", JSON.stringify(data, null, 2));
    const scoreStatus: ScoreStatus = {};

    // Check if a record exists for the current date
    if (data.records.length > 0) {
      const fields = data.records[0].fields;

      // Only process scores if there's a record for today
      for (const test of allTests) {
        const id = testId(test);
        if (fields[id] !== undefined && fields[id] !== null) {
          scoreStatus[id] = true;
        } else {
          scoreStatus[id] = false;
        }
      }
    } else {
      // If no record exists for today, set all scores to false
      for (const test of allTests) {
        const id = testId(test);
        scoreStatus[id] = false;
      }
    }

    return scoreStatus;
  }
);
