import { MessageCircle, X } from 'lucide-react';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { useState } from 'react';

const WhatsAppFloat = () => {
  const { storeSettings } = useStoreSettings();
  const [isVisible, setIsVisible] = useState(true);
  
  if (!isVisible) return null;

  const handleWhatsAppClick = () => {
    window.open(storeSettings.whatsapp_number, '_blank');
  };

  return (
    <div className="fixed bottom-24 right-4 z-50 md:bottom-8">
      <div className="relative">
        <button
          onClick={handleWhatsAppClick}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
          aria-label="Contact us on WhatsApp"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">WhatsApp us</span>
        </button>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-2 -right-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full p-1 shadow-md transition-colors"
          aria-label="Hide WhatsApp button"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default WhatsAppFloat;