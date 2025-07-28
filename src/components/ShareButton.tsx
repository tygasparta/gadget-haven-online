
import React, { useState } from 'react';
import { Share2, Facebook, Twitter, Mail, Link, Copy, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';

interface ShareButtonProps {
  productId: number;
  productName: string;
  productPrice: number;
  productImage?: string;
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ 
  productId, 
  productName, 
  productPrice, 
  productImage,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const productUrl = `${window.location.origin}/product/${productId}`;
  const shareText = `Check out this amazing product: ${productName} - Only $${productPrice}!`;
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      toast.success('Link copied to clipboard!');
      setIsOpen(false);
    } catch (err) {
      console.error('Failed to copy link:', err);
      toast.error('Failed to copy link');
    }
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${productUrl}`)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Check out this product: ${productName}`);
    const body = encodeURIComponent(`${shareText}\n\nView product: ${productUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
    setIsOpen(false);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName,
          text: shareText,
          url: productUrl,
        });
        setIsOpen(false);
      } catch (err) {
        console.error('Error sharing:', err);
        // Fallback to copy link if native sharing fails
        handleCopyLink();
      }
    } else {
      // Fallback for browsers that don't support native sharing
      handleCopyLink();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors ${className}`}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4" align="end">
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-900 mb-3">Share this product</h4>
          
          <div className="grid grid-cols-2 gap-2">
            {/* Native Share (mobile) */}
            {navigator.share && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleNativeShare}
                className="flex items-center gap-2 text-left justify-start"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-sm">Share</span>
              </Button>
            )}
            
            {/* Copy Link */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="flex items-center gap-2 text-left justify-start"
            >
              <Copy className="w-4 h-4" />
              <span className="text-sm">Copy Link</span>
            </Button>
            
            {/* Facebook */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleFacebookShare}
              className="flex items-center gap-2 text-left justify-start hover:bg-blue-50"
            >
              <Facebook className="w-4 h-4 text-blue-600" />
              <span className="text-sm">Facebook</span>
            </Button>
            
            {/* Twitter */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleTwitterShare}
              className="flex items-center gap-2 text-left justify-start hover:bg-blue-50"
            >
              <Twitter className="w-4 h-4 text-blue-400" />
              <span className="text-sm">Twitter</span>
            </Button>
            
            {/* WhatsApp */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleWhatsAppShare}
              className="flex items-center gap-2 text-left justify-start hover:bg-green-50"
            >
              <MessageCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">WhatsApp</span>
            </Button>
            
            {/* Email */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleEmailShare}
              className="flex items-center gap-2 text-left justify-start hover:bg-gray-50"
            >
              <Mail className="w-4 h-4 text-gray-600" />
              <span className="text-sm">Email</span>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ShareButton;
