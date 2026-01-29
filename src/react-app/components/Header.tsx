import { Link, useLocation } from 'react-router-dom';
import ZammadChat from './ZammadChat';
import './Header.css';

export default function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <img src="/uptocode.png" alt="UptoCode" className="logo-image" />
          <span className="logo-text">UptoCode</span>
        </Link>
        <nav className="nav">
          <Link to="/" className={isActive('/') ? 'nav-link active' : 'nav-link'}>
            Home
          </Link>
          <Link to="/services" className={isActive('/services') ? 'nav-link active' : 'nav-link'}>
            Services
          </Link>
          <Link to="/projects" className={isActive('/projects') ? 'nav-link active' : 'nav-link'}>
            Projects
          </Link>
          <Link to="/contact" className={isActive('/contact') ? 'nav-link active' : 'nav-link'}>
            Contact
          </Link>
          <ZammadChat />
        </nav>
      </div>
    </header>
  );
}
