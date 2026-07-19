import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout, isStaff } = useAuth();

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            <span className="brand-mark">TIN</span>
            <span>Kolektif</span>
          </Link>
          <nav className="main-nav">
            <NavLink to="/educations">Educations</NavLink>
            <NavLink to="/announcements">Announcements</NavLink>
            <NavLink to="/join-us">Join Us</NavLink>
            {isStaff && <NavLink to="/admin">Admin</NavLink>}
          </nav>
          <div className="auth-nav">
            {user ? (
              <>
                <NavLink to="/profile">{user.username}</NavLink>
                <button type="button" className="btn btn-ghost" onClick={logout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Log in</NavLink>
                <NavLink to="/register" className="btn btn-primary">
                  Sign up
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
          <p>Tin Kolektif — collective learning, culture, and creation.</p>
          <a href="https://www.instagram.com/tinkolektif/" target="_blank" rel="noreferrer">
            @tinkolektif
          </a>
        </div>
      </footer>
    </div>
  );
}
