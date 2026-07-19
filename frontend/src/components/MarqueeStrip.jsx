import { useTranslation } from "react-i18next";

export default function MarqueeStrip() {
  const { t } = useTranslation();
  const text = t("home.marquee");

  return (
    <div className="marquee-strip" aria-hidden="true">
      <div className="marquee-track">
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </div>
  );
}
