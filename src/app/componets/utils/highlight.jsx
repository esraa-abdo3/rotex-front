
export function renderHighlighted(text, highlightColor) {
  if (!text) return null;
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} style={{ color: highlightColor, fontWeight: 700 }}>
        {part}
      </span>
    ) : (
      part
    )
  );
}
