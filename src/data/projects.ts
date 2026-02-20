export type ProjectLink = {
  label: "GitHub" | "Medium" | "LinkedIn" | "X";
  url: string;
};

export type ProjectItem = {
  name: string;
  description: string;
  links: ProjectLink[];
};

export const projects: ProjectItem[] = [
  {
    name: "Terminal Monochrome Portfolio",
    description:
      "A minimal React + TypeScript portfolio with terminal-inspired typography and a custom R3F wireframe field.",
    links: [
      { label: "GitHub", url: "https://github.com/furkankaynak" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/furkankaynak/" }
    ]
  },
  {
    name: "US Stock Analyzer Agent",
    description:
      "Multi-agent system that combines SEC filings, options flow, and sentiment inputs for early opportunity signals.",
    links: [
      { label: "GitHub", url: "https://github.com/furkankaynak" },
      { label: "Medium", url: "https://medium.com/@furkankaynak.74" }
    ]
  },
  {
    name: "EU Project Research & Writing Agent",
    description:
      "RAG-based assistant for discovering EU funding opportunities and generating structured proposal drafts.",
    links: [
      { label: "GitHub", url: "https://github.com/furkankaynak" },
      { label: "Medium", url: "https://medium.com/@furkankaynak.74" }
    ]
  },
  {
    name: "SCADA Real-Time Monitoring",
    description:
      "Real-time monitoring and visualization system for national pipelines with high-frequency sensor telemetry.",
    links: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/furkankaynak/" },
      { label: "X", url: "https://x.com/furkannkaynak" }
    ]
  },
  {
    name: "B2B Travel and Payment Platforms",
    description:
      "Frontend architecture and design system contributions for enterprise B2B travel and payment products.",
    links: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/furkankaynak/" },
      { label: "Medium", url: "https://medium.com/@furkankaynak.74" }
    ]
  }
];
