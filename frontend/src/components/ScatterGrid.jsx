export default function ScatterGrid({ children, className = "" }) {
  return <div className={`scatter-stage ${className}`.trim()}>{children}</div>;
}
