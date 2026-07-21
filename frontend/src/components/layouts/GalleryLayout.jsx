import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BrandLogo from "../BrandLogo";
import BrandLogoLink from "../BrandLogoLink";
import LanguageSwitcher from "../LanguageSwitcher";
import ThemeSwitcher from "../ThemeSwitcher";
import { useAuth } from "../../context/AuthContext";

export default function GalleryLayout() {
  const { t } = useTranslation();
  const { user, logout, isStaff } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <div className="app-shell theme-gallery">
      <header className="gallery-header">
        <div className="gallery-header-top">
          <BrandLogoLink variant="horizontal" className="gallery-brand" onClick={closeMenu} />

          <div className="gallery-header-actions">
            <ThemeSwitcher />
            <LanguageSwitcher />
            {user ? (
              <>
                <NavLink to="/profile" className="gallery-account-link" onClick={closeMenu}>
                  {t("themes.gallery.myAccount")}
                </NavLink>
                <button type="button" className="gallery-account-link" onClick={logout}>
                  {t("nav.logout")}
                </button>
              </>
            ) : (
              <NavLink to="/login" className="gallery-account-link" onClick={closeMenu}>
                {t("themes.gallery.myAccount")}
              </NavLink>
            )}
          </div>

          <button
            type="button"
            className="gallery-menu-toggle"
            aria-expanded={menuOpen}
            aria-label={t("themes.menuToggle")}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span />
            <span />
          </button>
        </div>

        <nav className={`gallery-nav${menuOpen ? " is-open" : ""}`}>
          <NavLink to="/join-us" onClick={closeMenu}>
            {t("themes.galleryNav.about")}
          </NavLink>
          <NavLink to="/educations" onClick={closeMenu}>
            {t("themes.galleryNav.workshops")}
          </NavLink>
          <NavLink to="/announcements" onClick={closeMenu}>
            {t("themes.galleryNav.journal")}
          </NavLink>
          <NavLink to="/join-us" onClick={closeMenu}>
            {t("themes.galleryNav.contact")}
          </NavLink>
          {isStaff && (
            <NavLink to="/admin" onClick={closeMenu}>
              {t("nav.admin")}
            </NavLink>
          )}
        </nav>
      </header>

      {menuOpen && (
        <button
          type="button"
          className="gallery-nav-backdrop"
          onClick={closeMenu}
          aria-label={t("themes.closeMenu")}
        />
      )}

      <main className="gallery-stage">
        <Outlet />
      </main>

      <footer className="gallery-footer">
        <div className="gallery-footer-grid">
          <div>
            <BrandLogo variant="horizontal" className="gallery-footer-logo" />
            <p>{t("footer.tagline")}</p>
          </div>
          <div>
            <strong>{t("themes.gallery.footerInfo")}</strong>
            <Link to="/join-us">{t("themes.galleryNav.about")}</Link>
            <Link to="/educations">{t("themes.galleryNav.workshops")}</Link>
            <Link to="/announcements">{t("themes.galleryNav.journal")}</Link>
          </div>
          <div>
            <strong>{t("themes.gallery.footerUser")}</strong>
            <Link to="/register">{t("nav.signup")}</Link>
            <Link to="/login">{t("nav.login")}</Link>
            <Link to="/profile">{t("nav.profile")}</Link>
          </div>
          <div>
            <strong>{t("themes.galleryNav.contact")}</strong>
            <a href="https://www.instagram.com/tinkolektif/" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <Link to="/join-us">{t("nav.joinUs")}</Link>
          </div>
        </div>
        <p className="gallery-footer-copy">© {new Date().getFullYear()} Tin Kolektif</p>
      </footer>
    </div>
  );
}
