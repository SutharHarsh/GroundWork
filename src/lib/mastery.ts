/** Mastery rubrics. Mastery requires every criterion at "independent" (3) or higher plus linked proof of work. */
export interface Criterion {
  key: string;
  label: string;
  prompt: string;
}

export const MASTERY_CRITERIA: Record<string, Criterion[]> = {
  frontend: [
    { key: "explain", label: "Explain the concept", prompt: "Could you explain this to another developer without notes?" },
    { key: "implement", label: "Implement independently", prompt: "Can you build it from a blank file without copying a tutorial or an AI answer?" },
    { key: "debug", label: "Debug problems", prompt: "When it breaks, can you find the cause with DevTools, logs or tests?" },
    { key: "architecture", label: "Explain architectural decisions", prompt: "Can you justify when to use it, when not to, and what the trade-offs are?" },
    { key: "apply", label: "Apply it in a real project", prompt: "Have you used it in a project you can link to?" },
  ],
  designer: [
    { key: "understand", label: "Understand the principle", prompt: "Could you explain the principle and why it works?" },
    { key: "apply", label: "Apply it independently", prompt: "Can you use it on a new problem without a reference?" },
    { key: "explain", label: "Explain design decisions", prompt: "Can you defend your decisions with evidence and principles?" },
    { key: "critique", label: "Critique alternatives", prompt: "Can you critique other solutions and say why one is better?" },
    { key: "demonstrate", label: "Demonstrate in a real product", prompt: "Have you shown it in real product work you can link to?" },
  ],
};

export const RATING_LABELS = ["", "Not yet", "With help", "Independently", "Could teach it"] as const;

export const MASTERY_THRESHOLD = 3;
export const MIN_EXPLANATION_CHARS = 80;
