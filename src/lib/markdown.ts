import { marked } from "marked";

/**
 * Renders syllabus Markdown to HTML. Input comes only from the two syllabus files in the repository
 * (trusted, author-controlled content) — never from user input, which is always rendered as text.
 */
export function renderSyllabusMarkdown(md: string): string {
  const html = marked.parse(md, { async: false, gfm: true }) as string;
  // Open external links safely in a new tab.
  return html.replace(/<a href="(https?:[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');
}
