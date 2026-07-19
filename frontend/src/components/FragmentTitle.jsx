const fragmentStyles = [
  "fragment-chip-a",
  "fragment-chip-b",
  "fragment-chip-c",
  "fragment-chip-d",
  "fragment-chip-e",
];

export default function FragmentTitle({ fragments }) {
  return (
    <h1 className="fragment-title" aria-label={fragments.join(" ")}>
      {fragments.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className={`fragment-chip ${fragmentStyles[index % fragmentStyles.length]}`}
        >
          {word}
        </span>
      ))}
    </h1>
  );
}
