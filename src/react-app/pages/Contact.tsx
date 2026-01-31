import { useState, FormEvent } from 'react';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });
    } catch (error) {
      setStatus('error');
      setErrorMessage('Failed to send message. Please try again or email us directly.');
    }
  };

  return (
    <div className="contact-page">
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Start a Conversation</h2>
              <p>
                Every successful project begins with understanding your unique challenges
                and goals. Reach out for a no-obligation consultation where we can explore
                how custom software can drive your business forward.
              </p>
              
              <div className="contact-details">
                <div className="contact-item">
                  <h3>Email</h3>
                  <a href="mailto:info@uptocode.co.za">info@uptocode.co.za</a>
                </div>
                
                <div className="contact-item">
                  <h3>Location</h3>
                  <p>South Africa</p>
                </div>
              </div>

              <div className="contact-note">
                <p>
                  <strong>What to expect:</strong> We'll respond within 24 hours to schedule
                  a consultation call where we can discuss your requirements in detail and
                  provide initial recommendations.
                </p>
              </div>
            </div>

            <div className="contact-form-wrapper">
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">WhatsApp Number (e.g., 0821234567 or 27821234567)</label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="0821234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="company">Company</label>
                  <input
                    type="text"
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Tell us about your project *</label>
                  <textarea
                    id="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>

                {status === 'success' && (
                  <div className="form-message success">
                    Thank you! We'll be in touch soon.
                  </div>
                )}

                {status === 'error' && (
                  <div className="form-message error">
                    {errorMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
