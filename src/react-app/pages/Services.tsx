import { Link } from 'react-router-dom';
import './Services.css';

export default function Services() {
  return (
    <div className="services-page">
      <section className="services-detail">
        <div className="container">
          <div className="service-detail">
            <div className="service-icon">🔄</div>
            <h2>Business Process Automation</h2>
            <p>
              Eliminate repetitive tasks and reduce human error with intelligent automation.
              We analyze your workflows and build custom solutions that integrate seamlessly
              with your existing systems, freeing your team to focus on high-value work.
            </p>
            <ul className="service-features">
              <li>Workflow automation and orchestration</li>
              <li>Data synchronization between systems</li>
              <li>Automated reporting and analytics</li>
              <li>Document processing and management</li>
            </ul>
          </div>

          <div className="service-detail">
            <div className="service-icon">🔌</div>
            <h2>Legacy System Integration</h2>
            <p>
              Don't let outdated software hold you back. We build microservices and APIs that
              bridge the gap between your legacy systems and modern platforms, enabling data
              flow and functionality without costly replacements.
            </p>
            <ul className="service-features">
              <li>Custom API development and integration</li>
              <li>Microservices architecture</li>
              <li>Real-time data synchronization</li>
              <li>Database migration and modernization</li>
            </ul>
          </div>

          <div className="service-detail">
            <div className="service-icon">🏭</div>
            <h2>Manufacturing & Industrial Solutions</h2>
            <p>
              Purpose-built applications for the manufacturing sector. From inventory management
              to production tracking, we create tools that understand the unique challenges of
              industrial operations.
            </p>
            <ul className="service-features">
              <li>Custom ERP and MES solutions</li>
              <li>Inventory and supply chain management</li>
              <li>Production monitoring and analytics</li>
              <li>Quality control systems</li>
            </ul>
          </div>

          <div className="service-detail">
            <div className="service-icon">⚙️</div>
            <h2>Custom Web Applications</h2>
            <p>
              When off-the-shelf software doesn't fit, we build exactly what you need.
              Scalable, secure, and designed around your specific requirements and workflows.
            </p>
            <ul className="service-features">
              <li>Full-stack web application development</li>
              <li>Progressive web apps (PWAs)</li>
              <li>Admin dashboards and portals</li>
              <li>Customer-facing applications</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2>Ready to Transform Your Business?</h2>
            <p>
              Every project starts with a conversation. Let's discuss your challenges
              and explore how custom software can drive your business forward.
            </p>
            <Link to="/contact" className="btn btn-primary">
              Schedule a Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
