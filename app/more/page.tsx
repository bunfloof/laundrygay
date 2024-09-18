'use client'

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Info, Terminal, MailPlus, FileText, ChevronRight } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import AboutDialog from '@/app/AboutDialogue';
import EnhancedPopoverMore from '@/app/EnhancedPopoverMore';

const MorePage: React.FC = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [agreedToSupport, setAgreedToSupport] = useState(false);

  return (
    <div className="min-h-screen bg-background p-4">
      <h1 className="text-2xl font-bold mb-6">More</h1>
      <nav>
        <ul className="space-y-1">
          <li>
            <div 
              className="flex items-center justify-between py-3 text-sm cursor-pointer hover:bg-secondary/50 rounded-md transition-colors"
              onClick={() => setIsAboutOpen(true)}
            >
              <div className='pl-2'>
                <div className="flex items-center">
                  <Info className="w-5 h-5 mr-3 text-muted-foreground" />
                  <span>About</span>
                </div>
              </div>
              <div className='pr-1'>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
            <AboutDialog isOpen={isAboutOpen} onOpenChange={setIsAboutOpen}>
              <span className="sr-only">Open About Dialog</span>
            </AboutDialog>
          </li>
          <Separator />
          <li>
            <Link href="/api" className="flex items-center justify-between py-3 text-sm cursor-pointer hover:bg-secondary/50 rounded-md transition-colors">
              <div className='pl-2'>
                <div className="flex items-center">
                  <Terminal className="w-5 h-5 mr-3 text-muted-foreground" />
                  <span>API</span>
                </div>
              </div>
              <div className='pr-1'>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Link>
          </li>
          <Separator />
          <li>
          <EnhancedPopoverMore agreed={agreedToSupport} setAgreed={setAgreedToSupport} />
          </li>
          <Separator />
          <li>
            <Link href="/paper" className="flex items-center justify-between py-3 text-sm cursor-pointer hover:bg-secondary/50 rounded-md transition-colors">
              <div className='pl-2'>
                <div className="flex items-center">
                  <FileText className="w-5 h-5 mr-3 text-muted-foreground" />
                  <span>Paper</span>
                </div>
              </div>
              <div className='pr-1'>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Link>
          </li>
          <Separator />
          <li>
            <Link href="/privacy" className="flex items-center justify-between py-3 text-sm cursor-pointer hover:bg-secondary/50 rounded-md transition-colors">
              <div className='pl-2'>
                <div className="flex items-center">
                  <FileText className="w-5 h-5 mr-3 text-muted-foreground" />
                  <span>Privacy</span>
                </div>
              </div>
              <div className='pr-1'>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Link>
          </li>
          <Separator />
        </ul>
      </nav>
    </div>
  );
};

export default MorePage;