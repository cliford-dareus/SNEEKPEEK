/** Parse comma/space-separated usernames for post tags. */
export const parseTagUsernames = (input: string): string[] =>
  input
    .split(/[,\s]+/)
    .map((t) => t.replace(/^@/, "").trim().toLowerCase())
    .filter(Boolean);

/** Safe display snippet for feed/trending lists. */
export const snippet = (text: string | undefined, max = 80): string => {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "…" : text;
};
