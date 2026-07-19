export default function ArtGrid({ children, className = "" }) {
  return <div className={`card-grid-art ${className}`.trim()}>{children}</div>;
}
