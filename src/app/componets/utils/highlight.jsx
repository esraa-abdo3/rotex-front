
// export function renderHighlighted(text, highlightColor) {
//   if (!text) return null;
//   const parts = text.split(/\*\*(.*?)\*\*/g);
//   return parts.map((part, i) =>
//     i % 2 === 1 ? (
//       <span key={i} style={{ color: highlightColor, fontWeight: 700 }}>
//         {part}
//       </span>
//     ) : (
//       part
//     )
//   );
// }
export function renderHighlighted(text, highlightColor) {
  if (!text) return null;

  const lines = text.split(/\r?\n/);

  return lines.map((line, lineIndex) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);

    return (
      <span key={lineIndex}>
        {parts.map((part, i) =>
          i % 2 === 1 ? (
            <span
              key={i}
              style={{
                color: highlightColor,
                fontWeight: 700,
              }}
            >
              {part}
            </span>
          ) : (
            part
          )
        )}

        {lineIndex < lines.length - 1 && <br />}
      </span>
    );
  });
}
