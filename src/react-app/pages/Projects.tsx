import './Projects.css';

const projects = [
  {
    name: 'ChatBOSS',
    url: 'https://chatboss.co.za',
    description: 'WhatsApp automation platform designed for small businesses. Provides instant replies, lead capture, and professional customer engagement without coding.',
    fullDescription: 'Custom-built WhatsApp automation system that handles customer inquiries 24/7, captures leads automatically, and maintains professional communication while keeping business owners in control.',
    category: 'Business Automation',
    tech: ['WordPress', 'Custom Plugins', 'WhatsApp API', 'PHP']
  },
  {
    name: 'Nudgie',
    url: 'https://nudgie.co.za',
    description: 'WhatsApp automation specifically for South African accommodation businesses. Helps reply instantly, follow up professionally, and convert inquiries into confirmed bookings.',
    fullDescription: 'Industry-specific solution for hospitality businesses that automates guest communication, manages booking inquiries, and provides consistent professional responses even during busy periods.',
    category: 'Hospitality Tech',
    tech: ['WordPress', 'Custom Plugins', 'WhatsApp Integration', 'Booking Systems']
  },
  {
    name: 'WaFlowBot',
    url: 'https://waflowbot.com',
    description: 'Advanced WhatsApp marketing automation for digital marketers. Features lead capture, automated follow-ups, and hyper-personalized engagement without coding.',
    fullDescription: 'Comprehensive WhatsApp automation platform with visual flow builder, lead segmentation, campaign triggers, and CRM integration. Designed for marketers to achieve higher ROAS through automated engagement.',
    category: 'Marketing Automation',
    tech: ['WordPress', 'Custom Plugins', 'WhatsApp API', 'Calendar Integration']
  },
  {
    name: 'AnytimeChat',
    url: 'https://anytimechat.co.za',
    description: 'AI-powered WhatsApp assistant that handles customer conversations from first contact to confirmed sale. Features automatic follow-ups, quote generation, and built-in CRM.',
    fullDescription: 'Intelligent conversational AI that qualifies leads, provides instant responses 24/7, facilitates complete transactions through chat, and automatically logs all interactions for seamless customer relationship management.',
    category: 'AI Communication',
    tech: ['WordPress', 'Custom Plugins', 'AI/ML Integration', 'WhatsApp Business API']
  },
  {
    name: 'RetreatHub',
    url: 'https://retreathub.co.za',
    description: 'WhatsApp-based booking automation for retreat centers and accommodation providers. Converts conversations into bookings 24/7 with automated follow-ups.',
    fullDescription: 'Specialized booking platform that integrates WhatsApp automation with calendar systems, payment processing, and guest management. Proven to increase conversion rates up to 5x while reducing workload by 70-80%.',
    category: 'Hospitality Platform',
    tech: ['WordPress', 'Custom Plugins', 'iCal/Google Calendar', 'Payment Integration']
  },
  {
    name: 'Sarcastic SHTF',
    url: 'https://sarcastic.shtf.co.za',
    description: 'E-commerce platform for "The Sarcastic Gardener" featuring poetry books and creative content. Clean, modern design with Amazon integration.',
    fullDescription: 'Custom-built content and e-commerce website showcasing creative works including "Poems of a Tired Mom" - a collection exploring the beautiful chaos of motherhood with humor and heart.',
    category: 'E-Commerce',
    tech: ['WordPress', 'Custom Plugins', 'WooCommerce', 'Amazon Integration']
  },
  {
    name: 'Zetac Engineering',
    url: 'https://zetac.co.za',
    description: 'Professional website for precision engineering and metal fabrication company. Showcases services including laser cutting, bending, welding, and CAD design.',
    fullDescription: 'Corporate website for Germiston-based engineering firm specializing in fiber laser cutting, CNC bending, custom fabrication, and technical drafting. Features service portfolio, capabilities showcase, and client contact system.',
    category: 'Manufacturing',
    tech: ['WordPress', 'Custom Plugins', 'Portfolio Management', 'Contact Forms']
  }
];

export default function Projects() {
  // Function to get screenshot URL from static files
  const getScreenshotUrl = (url: string) => {
    // Map URL to screenshot filename
    const urlToFilename: { [key: string]: string } = {
      'https://chatboss.co.za': 'chatboss.jpg',
      'https://nudgie.co.za': 'nudgie.jpg',
      'https://waflowbot.com': 'waflowbot.jpg',
      'https://anytimechat.co.za': 'anytimechat.jpg',
      'https://retreathub.co.za': 'retreathub.jpg',
      'https://sarcastic.shtf.co.za': 'sarcastic-shtf.jpg',
      'https://zetac.co.za': 'zetac.jpg'
    };
    
    return `/screenshots/${urlToFilename[url] || 'placeholder.jpg'}`;
  };

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
                <div className="project-screenshot">
                  <img 
                    src={getScreenshotUrl(project.url)} 
                    alt={`${project.name} screenshot`}
                    loading="lazy"
                    onError={(e) => {
                      // Fallback to gradient if screenshot fails
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="project-screenshot-overlay">
                    <span className="view-site-text">View Site →</span>
                  </div>
                </div>
                <div className="project-content">
                  <div className="project-category">{project.category}</div>
                  <h3 className="project-name">{project.name}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tech">
                    {project.tech.map((tech, index) => (
                      <span key={index} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
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
