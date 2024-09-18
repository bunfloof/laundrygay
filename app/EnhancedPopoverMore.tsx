import React, { useState, useEffect } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MailPlus, ChevronRight } from 'lucide-react';

interface EnhancedPopoverProps {
  agreed: boolean;
  setAgreed: React.Dispatch<React.SetStateAction<boolean>>;
}

const EnhancedPopoverMore: React.FC<EnhancedPopoverProps> = ({ agreed, setAgreed }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy Username');
  const [countdown, setCountdown] = useState(5);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let timer: number | undefined;
    if (isOpen && !agreed && countdown > 0) {
      timer = window.setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [countdown, agreed, isOpen]);

  const handleAgree = () => {
    setAgreed(true);
  };

  const handleTelegramLink = () => {
    window.open('https://t.me/bun2003', '_blank');
  };

  const handleCopyUsername = () => {
    navigator.clipboard.writeText('furcon');
    setCopyButtonText('Copied!');
    setTimeout(() => setCopyButtonText('Copy Username'), 2000);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setCountdown(5);
    }
  };

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div 
          className="flex items-center justify-between py-3 text-sm cursor-pointer hover:bg-secondary/50 rounded-md transition-colors"
        >
          <div className='pl-2'>
            <div className="flex items-center">
              <MailPlus className="w-5 h-5 mr-3 text-muted-foreground" />
              <span>Contact Support</span>
            </div>
          </div>
          <div className='pr-1'>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 overflow-hidden">
        <div className="relative">
          <div className={`p-4 ${!agreed ? 'filter blur-sm' : ''}`}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <p className="text-yellow-600 text-sm font-semibold">ⓘ These are all off-shore support and may not speak English. Please keep inquiries simple and concise.</p>
                <div className="grid gap-1">
                  <div className="font-medium">Message Bun on Telegram</div>
                  <div className="text-sm">
                    Message Bun directly on Telegram.
                  </div>
                  <Button className="mt-2" variant="outline" size="sm" onClick={handleTelegramLink}>
                    t.me/bun2003
                  </Button>
                </div>
                <Separator className="my-2"/>
                <div className="grid gap-1">
                  <div className="font-medium">Message Bun on Discord</div>
                  <div className="text-sm">
                    Send Bun a friend request on Discord and message them directly.
                  </div>
                  <Button className="mt-2" variant="outline" size="sm" onClick={handleCopyUsername}>
                    {copyButtonText}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {!agreed && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <div className="w-11/12 max-w-sm p-2">
                <div className="text-lg font-semibold mb-2">ⓘ Important Notice</div>
                <div className="text-sm mb-4">
                  Support is discretionary. We deny service to whites, zionists, racists, and bigots. For such individuals, the service is provided as-is without support.
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleAgree} 
                  disabled={countdown > 0}
                >
                  {countdown > 0 ? `Please wait ${countdown}s` : 'I Agree and Understand'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EnhancedPopoverMore;