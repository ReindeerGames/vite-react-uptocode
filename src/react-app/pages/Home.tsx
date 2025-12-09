import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-container">
          <h1 className="hero-title">
            Custom Software Solutions<br />
            Built for Your Business
          </h1>
          <p className="hero-subtitle">
            We specialize in business automation, legacy system integration, and custom applications
            for the manufacturing sector. Transform your operations with tailored software solutions.
          </p>
          <div className="hero-cta">
            <Link to="/contact" className="btn btn-primary">
              Get a Consultation
            </Link>
            <Link to="/projects" className="btn btn-secondary">
              View Our Work
            </Link>
          </div>
        </div>
      </section>

      <section className="about">
        <div className="container">
          <h2 className="section-title">About UptoCode</h2>
          <div className="about-content">
            <p>
              Founded by an experienced web developer who transitioned into custom software and automation,
              UptoCode brings deep technical expertise and a practical understanding of business needs.
            </p>
            <p>
              We don't offer one-size-fits-all packages. Every business is unique, and your software should be too.
              Our approach is consultative—we take the time to understand your challenges and build solutions
              that drive real results.
            </p>
          </div>
        </div>
      </section>

      <section className="services-preview">
        <div className="container">
          <h2 className="section-title">What We Do</h2>
          <div className="services-grid">
            <div className="service-card">
              <h3>Business Automation</h3>
              <p>Streamline operations and eliminate manual processes with intelligent automation solutions.</p>
            </div>
            <div className="service-card">
              <h3>Legacy Integration</h3>
              <p>Connect your existing systems to modern platforms through custom microservices and APIs.</p>
            </div>
            <div className="service-card">
              <h3>Custom Applications</h3>
              <p>Purpose-built tools designed specifically for manufacturing and industrial workflows.</p>
            </div>
          </div>
          <div className="services-cta">
            <Link to="/services" className="link-arrow">
              Explore all services →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
