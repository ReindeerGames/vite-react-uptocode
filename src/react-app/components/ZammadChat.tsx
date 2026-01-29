import { useEffect } from 'react';
import './ZammadChat.css';

declare global {
  interface Window {
    ZammadChat: any;
  }
}

export default function ZammadChat() {
  useEffect(() => {
    // Check if script is already loaded
    if (document.querySelector('script[src*="chat-no-jquery.min.js"]')) {
      return;
    }

    // Load Zammad Chat script (no jQuery version)
    const zammadScript = document.createElement('script');
    zammadScript.src = 'https://support.uptocode.co.za/assets/chat/chat-no-jquery.min.js';
    document.body.appendChild(zammadScript);

    // Initialize Zammad Chat after it loads
    zammadScript.onload = () => {
      if (window.ZammadChat) {
        new window.ZammadChat({
          title: '<strong>Uptocode</strong> Support',
          fontSize: '12px',
          chatId: 2,
          show: false,
          buttonClass: 'open-zammad-chat'
        });
      }
    };
  }, []);

  return (
    <button 
      className="open-zammad-chat" 
      aria-label="Open chat support"
    >
      Chat with us
    </button>
  );
}
