import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">UptoCode</span>
            <p className="footer-tagline">Custom Software Solutions & Business Automation</p>
          </div>
          <div className="footer-links">
            <Link to="/legal" className="footer-link">Terms & Privacy</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} UptoCode. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
