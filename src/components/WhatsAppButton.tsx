import React from 'react';

const WHATSAPP_NUMBER = '263719337910';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20GadgetGenie!`;

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.924 15.924 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.312 22.594c-.39 1.1-1.932 2.014-3.168 2.282-.846.18-1.95.324-5.67-1.218-4.762-1.972-7.826-6.796-8.064-7.112-.23-.316-1.932-2.572-1.932-4.904s1.222-3.476 1.656-3.952c.434-.476.948-.596 1.264-.596.316 0 .632.002.908.016.292.014.682-.11 1.068.814.39.938 1.33 3.27 1.448 3.506.118.238.196.514.04.83-.158.316-.236.514-.474.79-.238.278-.5.62-.714.832-.238.238-.486.496-.208.972.276.476 1.23 2.03 2.642 3.288 1.816 1.62 3.348 2.122 3.824 2.36.476.238.754.198 1.032-.118.276-.316 1.186-1.382 1.502-1.858.316-.476.632-.396 1.068-.238.434.158 2.768 1.306 3.242 1.542.476.238.79.356.908.554.118.196.118 1.14-.272 2.24z"/>
  </svg>
);

const WhatsAppButton = () => {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-20 md:bottom-6 right-4 z-50 bg-[#25D366] hover:bg-[#1ebe57] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
    >
      <WhatsAppIcon className="w-7 h-7" />
    </a>
  );
};

export default WhatsAppButton;
