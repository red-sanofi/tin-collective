import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ArtBackground from "./ArtBackground";
import LanguageSwitcher from "./LanguageSwitcher";
import MarqueeStrip from "./MarqueeStrip";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { t } = useTranslation();
  const { user, logout, isStaff } = useAuth();
  const location = useLocation();

  return (
    <div className="app-shell">
      <ArtBackground />
      <aside className="site-rail">
        <Link to="/" className="brand-stamp">
          <span>TIN</span>
          <small>KOLEKTIF</small>
        </Link>
        <nav className="rail-nav">
          <NavLink to="/educations">{t("nav.educations")}</NavLink>
          <NavLink to="/announcements">{t("nav.announcements")}</NavLink>
          <NavLink to="/join-us">{t("nav.joinUs")}</NavLink>
          {isStaff && <NavLink to="/admin">{t("nav.admin")}</NavLink>}
        </nav>
        <div className="rail-note">{location.pathname.replace("/", "") || "home"}</div>
      </aside>

      <div className="site-floaters">
        <LanguageSwitcher />
        {user ? (
          <>
            <NavLink to="/profile" className="floater-chip">
              {user.username}
            </NavLink>
            <button type="button" className="floater-chip floater-chip-ghost" onClick={logout}>
              {t("nav.logout")}
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="floater-chip">
              {t("nav.login")}
            </NavLink>
            <NavLink to="/register" className="floater-chip floater-chip-accent">
              {t("nav.signup")}
            </NavLink>
          </>
        )}
      </div>

      <MarqueeStrip />

      <main className="page-stage">
        <Outlet />
      </main>

      <footer className="site-footer-chaotic">
        <div className="footer-ticker">@tinkolektif</div>
        <p>{t("footer.tagline")}</p>
        <a
          className="footer-link-sticker"
          href="https://www.instagram.com/tinkolektif/"
          target="_blank"
          rel="noreferrer"
        >
          Instagram
        </a>
      </footer>
    </div>
  );
}
