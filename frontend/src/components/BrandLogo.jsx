const variants = {
  full: {
    src: "/brand/logo-full.png",
    width: 700,
    height: 463,
  },
  mark: {
    src: "/brand/logo-mark.png",
    width: 700,
    height: 383,
  },
  horizontal: {
    src: "/brand/logo-horizontal.png",
    width: 900,
    height: 160,
  },
};

export default function BrandLogo({ variant = "horizontal", className = "" }) {
  const logo = variants[variant] || variants.horizontal;

  return (
    <img
      src={logo.src}
      alt="Tin Kolektif"
      className={`brand-logo brand-logo-${variant} ${className}`.trim()}
      width={logo.width}
      height={logo.height}
      loading="eager"
    />
  );
}
