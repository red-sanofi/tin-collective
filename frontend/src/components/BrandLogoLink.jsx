import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";

export default function BrandLogoLink({
  variant = "horizontal",
  className = "",
  to = "/",
  onClick,
  ...rest
}) {
  return (
    <Link
      to={to}
      className={`brand-logo-link ${className}`.trim()}
      onClick={onClick}
      {...rest}
    >
      <BrandLogo variant={variant} />
    </Link>
  );
}
