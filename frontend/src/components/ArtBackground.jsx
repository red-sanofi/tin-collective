export default function ArtBackground() {
  return (
    <div className="art-background" aria-hidden="true">
      <span className="art-shape art-shape-a" />
      <span className="art-shape art-shape-b" />
      <span className="art-shape art-shape-c" />
      <span className="art-shape art-shape-d" />
      <span className="art-shape art-shape-e" />
      <svg className="art-scribble art-scribble-a" viewBox="0 0 200 80" fill="none">
        <path d="M5 40 C40 5, 80 75, 120 30 S180 10, 195 35" stroke="currentColor" strokeWidth="3" />
      </svg>
      <svg className="art-scribble art-scribble-b" viewBox="0 0 120 120" fill="none">
        <circle cx="60" cy="60" r="48" stroke="currentColor" strokeWidth="3" strokeDasharray="8 10" />
      </svg>
      <span className="art-grid" />
      <span className="art-halftone" />
    </div>
  );
}
