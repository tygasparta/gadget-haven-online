import React from 'react';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '263776337910';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20GadgetGenie!`;

const WhatsAppButton = () => {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-20 md:bottom-6 right-4 z-50 bg-[#25D366] hover:bg-[#1ebe57] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
};

export default WhatsAppButton;
