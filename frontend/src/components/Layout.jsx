import { Link, NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ArtBackground from "./ArtBackground";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { t } = useTranslation();
  const { user, logout, isStaff } = useAuth();

  return (
    <div className="app-shell">
      <ArtBackground />
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            <span className="brand-mark">TIN</span>
            <span className="brand-name">Kolektif</span>
          </Link>
          <nav className="main-nav">
            <NavLink to="/educations">{t("nav.educations")}</NavLink>
            <NavLink to="/announcements">{t("nav.announcements")}</NavLink>
            <NavLink to="/join-us">{t("nav.joinUs")}</NavLink>
            {isStaff && <NavLink to="/admin">{t("nav.admin")}</NavLink>}
          </nav>
          <div className="auth-nav">
            <LanguageSwitcher />
            {user ? (
              <>
                <NavLink to="/profile" className="profile-link">
                  {user.username}
                </NavLink>
                <button type="button" className="btn btn-ghost" onClick={logout}>
                  {t("nav.logout")}
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">{t("nav.login")}</NavLink>
                <NavLink to="/register" className="btn btn-primary">
                  {t("nav.signup")}
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="container page-content">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-copy">
            <span className="footer-mark">TK</span>
            <p>{t("footer.tagline")}</p>
          </div>
          <a
            className="footer-social"
            href="https://www.instagram.com/tinkolektif/"
            target="_blank"
            rel="noreferrer"
          >
            @tinkolektif
          </a>
        </div>
      </footer>
    </div>
  );
}
