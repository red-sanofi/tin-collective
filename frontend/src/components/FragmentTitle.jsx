const fragmentStyles = [
  "fragment-a",
  "fragment-b",
  "fragment-c",
  "fragment-d",
  "fragment-e",
];

export default function FragmentTitle({ fragments }) {
  return (
    <h1 className="fragment-title" aria-label={fragments.join(" ")}>
      {fragments.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className={`fragment-word ${fragmentStyles[index % fragmentStyles.length]}`}
        >
          {word}
        </span>
      ))}
    </h1>
  );
}
