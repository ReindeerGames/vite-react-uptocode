import './Legal.css';

export default function Legal() {
  return (
    <div className="legal-page">
      <section className="legal-content">
        <div className="container">
          <h1 className="page-title">Terms & Privacy Policy</h1>
          <div className="legal-section">
            <h2>Terms and Conditions</h2>
            
            <h3>1. Services</h3>
            <p>
              UptoCode provides custom software development, business automation solutions,
              and related consulting services. All services are provided on a project basis
              with terms agreed upon in individual contracts or statements of work.
            </p>

            <h3>2. Intellectual Property</h3>
            <p>
              Unless otherwise specified in writing, all custom software and solutions developed
              for clients become the property of the client upon full payment. UptoCode retains
              the right to use general methodologies, techniques, and non-proprietary code in
              future projects.
            </p>

            <h3>3. Confidentiality</h3>
            <p>
              We maintain strict confidentiality regarding all client information, business
              processes, and proprietary data. Non-disclosure agreements are available upon
              request and are standard practice for all engagements.
            </p>

            <h3>4. Warranties and Limitations</h3>
            <p>
              We warrant that services will be performed in a professional manner consistent
              with industry standards. However, we cannot guarantee specific business outcomes
              or results. Liability is limited to the fees paid for the specific service in question.
            </p>

            <h3>5. Payment Terms</h3>
            <p>
              Payment terms are specified in individual project agreements. Typically, projects
              require a deposit before work begins, with remaining payments tied to milestones
              or project completion.
            </p>
          </div>

          <div className="legal-section">
            <h2>Privacy Policy</h2>
            
            <h3>Information We Collect</h3>
            <p>
              When you contact us through our website, we collect information you provide such
              as your name, email address, company name, and project details. This information
              is used solely to respond to your inquiry and provide our services.
            </p>

            <h3>How We Use Your Information</h3>
            <p>
              We use the information you provide to:
            </p>
            <ul>
              <li>Respond to your inquiries and consultation requests</li>
              <li>Provide quotes and proposals for services</li>
              <li>Deliver contracted services</li>
              <li>Communicate about ongoing projects</li>
            </ul>

            <h3>Information Sharing</h3>
            <p>
              We do not sell, trade, or share your personal information with third parties.
              Your information may only be shared with service providers necessary to deliver
              our services (such as hosting providers), and only to the extent required.
            </p>

            <h3>Data Security</h3>
            <p>
              We implement appropriate technical and organizational measures to protect your
              personal information against unauthorized access, alteration, disclosure, or
              destruction.
            </p>

            <h3>Your Rights</h3>
            <p>
              You have the right to request access to, correction of, or deletion of your
              personal information. Contact us at info@uptocode.co.za to exercise these rights.
            </p>

            <h3>Cookies</h3>
            <p>
              This website does not use tracking cookies. We may use essential cookies necessary
              for the website to function properly.
            </p>

            <h3>Changes to This Policy</h3>
            <p>
              We may update this privacy policy from time to time. The latest version will
              always be available on this page.
            </p>

            <h3>Contact Us</h3>
            <p>
              If you have questions about these terms or our privacy practices, please contact
              us at info@uptocode.co.za.
            </p>

            <p className="legal-updated">
              Last updated: December 2025
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
