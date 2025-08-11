export interface HighlightSegment {
  value: string;
  highlighted: boolean;
}

export const splitByHighlight = (text: string, highlight: string): HighlightSegment[] => {
  if (!text) return [];
  if (!highlight.trim()) return [{ value: text, highlighted: false }];
  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);

  return parts.map((v, i) => ({ value: v, highlighted: i % 2 === 1 }));
};
