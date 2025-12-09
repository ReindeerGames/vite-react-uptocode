import './Projects.css';

const projects = [
  {
    name: 'Nudgie',
    url: 'https://nudgie.co.za',
    description: 'Intelligent notification and reminder system',
    category: 'SaaS Platform'
  },
  {
    name: 'WaFlowBot',
    url: 'https://waflowbot.com',
    description: 'WhatsApp automation and workflow management',
    category: 'Business Automation'
  },
  {
    name: 'AnytimeChat',
    url: 'https://anytimechat.co.za',
    description: 'Real-time communication platform',
    category: 'Communication'
  },
  {
    name: 'RetreatHub',
    url: 'https://retreathub.co.za',
    description: 'Retreat and venue booking management system',
    category: 'Hospitality'
  },
  {
    name: 'Sarcastic SHTF',
    url: 'https://sarcastic.shtf.co.za',
    description: 'Custom web application',
    category: 'Web Application'
  },
  {
    name: 'Spotted Zebra Safaris',
    url: 'https://spottedzebrasafaris.co.za',
    description: 'Safari booking and tour management platform',
    category: 'Tourism'
  },
  {
    name: 'Zetac',
    url: 'https://zetac.co.za',
    description: 'Business solutions platform',
    category: 'Enterprise'
  }
];

export default function Projects() {
  return (
    <div className="projects-page">
      <section className="projects-section">
        <div className="container">
          <div className="projects-grid">
            {projects.map((project) => (
              <a
                key={project.url}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="project-card"
              >
                <div className="project-category">{project.category}</div>
                <h3 className="project-name">{project.name}</h3>
                <p className="project-description">{project.description}</p>
                <span className="project-link">
                  Visit site →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="projects-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Let's Build Something Great Together</h2>
            <p>
              Each project is unique, and we approach every challenge with fresh perspective
              and technical expertise. Ready to discuss your next project?
            </p>
            <a href="/contact" className="btn btn-primary">
              Start a Conversation
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
