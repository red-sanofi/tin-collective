import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BrandLogoLink from "../BrandLogoLink";
import LanguageSwitcher from "../LanguageSwitcher";
import ThemeSwitcher from "../ThemeSwitcher";
import { useAuth } from "../../context/AuthContext";

export default function ArtisanLayout() {
  const { t } = useTranslation();
  const { user, logout, isStaff } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <div className="app-shell theme-artisan">
      <header className="artisan-header">
        <BrandLogoLink variant="horizontal" className="artisan-brand" onClick={closeMenu} />

        <button
          type="button"
          className="artisan-menu-toggle"
          aria-expanded={menuOpen}
          aria-label={t("themes.menuToggle")}
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`artisan-nav${menuOpen ? " is-open" : ""}`}>
          <NavLink to="/join-us" onClick={closeMenu}>
            {t("themes.artisanNav.about")}
          </NavLink>
          <NavLink to="/educations" onClick={closeMenu}>
            {t("themes.artisanNav.workshops")}
          </NavLink>
          <NavLink to="/announcements" onClick={closeMenu}>
            {t("themes.artisanNav.gallery")}
          </NavLink>
          {isStaff && (
            <NavLink to="/admin" onClick={closeMenu}>
              {t("nav.admin")}
            </NavLink>
          )}
          <div className="artisan-nav-mobile-tools">
            {user ? (
              <>
                <NavLink to="/profile" onClick={closeMenu}>
                  {user.username}
                </NavLink>
                <button type="button" className="artisan-tool-button" onClick={logout}>
                  {t("nav.logout")}
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={closeMenu}>
                  {t("nav.login")}
                </NavLink>
                <NavLink to="/register" onClick={closeMenu}>
                  {t("nav.signup")}
                </NavLink>
              </>
            )}
          </div>
        </nav>

        <div className="artisan-header-tools">
          <ThemeSwitcher />
          <LanguageSwitcher />
          {user ? (
            <>
              <NavLink to="/profile" className="artisan-tool-link" onClick={closeMenu}>
                {user.username}
              </NavLink>
              <button type="button" className="artisan-tool-link artisan-tool-button" onClick={logout}>
                {t("nav.logout")}
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="artisan-tool-link" onClick={closeMenu}>
                {t("nav.login")}
              </NavLink>
              <NavLink to="/register" className="artisan-tool-link artisan-tool-accent" onClick={closeMenu}>
                {t("nav.signup")}
              </NavLink>
            </>
          )}
        </div>
      </header>

      {menuOpen && <button type="button" className="artisan-nav-backdrop" onClick={closeMenu} aria-label={t("themes.closeMenu")} />}

      <main className="artisan-stage">
        <Outlet />
      </main>

      <footer className="artisan-footer">
        <p>{t("footer.tagline")}</p>
        <a href="https://www.instagram.com/tinkolektif/" target="_blank" rel="noreferrer">
          Instagram
        </a>
      </footer>
    </div>
  );
}
