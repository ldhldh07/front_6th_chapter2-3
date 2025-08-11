import type { HighlightSegment } from "@shared/lib/split-by-highlight";

type HighlightTextProps = {
  segments: HighlightSegment[];
};

export const HighlightText = ({ segments }: HighlightTextProps) => {
  return (
    <span>
      {segments.map((s, i) => (s.highlighted ? <mark key={i}>{s.value}</mark> : <span key={i}>{s.value}</span>))}
    </span>
  );
};
