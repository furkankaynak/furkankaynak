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
    name: "Prayer Time MacOS",
    description:
      "Native macOS prayer-time app focused on simple reminders and lightweight daily usage.",
    links: [
      {
        label: "GitHub",
        url: "https://github.com/furkankaynak/prayer-time-macos"
      },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/furkankaynak/" }
    ]
  },
  {
    name: "Bitbucket PR Reviewer MCP",
    description:
      "TypeScript MCP server for automated pull request review workflows on Bitbucket repositories.",
    links: [
      {
        label: "GitHub",
        url: "https://github.com/furkankaynak/bitbucket-pr-reviewer-mcp"
      },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/furkankaynak/" }
    ]
  },
  {
    name: "React Signal",
    description:
      "Experimental signal-based state management approach for React with lightweight reactive patterns.",
    links: [
      { label: "GitHub", url: "https://github.com/furkankaynak/react-signal" },
      {
        label: "Medium",
        url: "https://medium.com/@furkankaynak.74/unlocking-reacts-potential-with-signals-a-step-by-step-guide-to-implementing-signals-1aa7c4b45553"
      }
    ]
  },
  {
    name: "Next Twitter Clone",
    description:
      "Social feed clone built with Next.js and Firebase for realtime interactions and profile flows.",
    links: [
      { label: "GitHub", url: "https://github.com/furkankaynak/next-twitter-clone" },
      { label: "X", url: "https://x.com/furkannkaynak" }
    ]
  }
];
