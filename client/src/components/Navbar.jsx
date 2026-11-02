import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import profile from '../profile.js';

export default function Navbar() {
  const { isAdmin, logout } = useAuth();

  return (
    <header className="navbar">
      <a href="#home" className="logo">
        {profile.firstName} <span className="accent">{profile.lastName}</span>
      </a>
      <nav className="nav-links">
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#skills">Skills</a>
        <a href="#projects">Projects</a>
         <a href="#certificates">Certificates</a>
        <a href="#contact">Contact</a>
        {isAdmin ? (
          <button className="link-btn" onClick={logout}>
            Logout
          </button>
        ) : (
          <Link to="/admin" className="admin-link">
            Admin
          </Link>
        )}
      </nav>
    </header>
  );
}
