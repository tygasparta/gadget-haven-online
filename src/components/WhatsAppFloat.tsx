import { MessageCircle } from 'lucide-react';
import { useStoreSettings } from '@/hooks/useStoreSettings';

const WhatsAppFloat = () => {
  const { storeSettings } = useStoreSettings();

  const handleWhatsAppClick = () => {
    window.open(storeSettings.whatsapp_number, '_blank');
  };

  return (
    <div className="fixed bottom-24 right-4 z-50 md:bottom-8">
      <button
        onClick={handleWhatsAppClick}
        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-sm font-medium">WhatsApp us</span>
      </button>
    </div>
  );
};

export default WhatsAppFloat;