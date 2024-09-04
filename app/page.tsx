'use client'

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from '@/components/ui/separator';
import { ModeToggle } from '@/components/mode-toggle';
import QrReader from './QrReader';
import LaundryMachineSelector from './LaundryMachineSelector';
import Link from 'next/link';

const TabbedCardInterface: React.FC = () => {
  const [discordUsername, setDiscordUsername] = useState('furcon');
  const [copyButtonText, setCopyButtonText] = useState('Copy Username');
  const [defaultTab, setDefaultTab] = useState('laundrymachineselector');
  const [currentTab, setCurrentTab] = useState('laundrymachineselector');

  useEffect(() => {
    const storedDefaultTab = localStorage.getItem('defaultTab');
    console.log('Stored default tab:', storedDefaultTab);
    if (storedDefaultTab) {
      console.log('Setting default tab to:', storedDefaultTab);
      setDefaultTab(storedDefaultTab);
      setCurrentTab(storedDefaultTab);
    } else {
      console.log('No stored default tab found, using:', defaultTab);
    }
  }, []);

  const handleTabChange = (value: string) => {
    console.log('Tab changed to:', value);
    setCurrentTab(value);
  };

  const handleSetDefaultTab = (tab: string) => {
    console.log('Setting default tab to:', tab);
    localStorage.setItem('defaultTab', tab);
    setDefaultTab(tab);
  };

  const handleTelegramLink = () => {
    window.open('https://t.me/bun2003', '_blank');
  };
  
  const handleCopyUsername = () => {
    navigator.clipboard.writeText(discordUsername);
    setCopyButtonText('Copied!');
    setTimeout(() => setCopyButtonText('Copy Username'), 2000);
  };

  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
  
    setVH();
    window.addEventListener('resize', setVH);
  
    return () => window.removeEventListener('resize', setVH);
  }, []);

  return (
    <div className="flex items-center justify-center bg-background min-h-screen" style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}>
      <Card className="w-full max-w-md border-0 shadow-none">
        <Tabs value={currentTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="laundrymachineselector">Selector</TabsTrigger>
            <TabsTrigger value="laundryqrscanner">QR Scanner</TabsTrigger>
          </TabsList>
          <TabsContent value="laundrymachineselector">
            <CardContent className="p-0">
              <LaundryMachineSelector/>
            </CardContent>
          </TabsContent>
          <TabsContent value="laundryqrscanner">
            <CardContent className="p-0">
              <QrReader />
            </CardContent>
          </TabsContent>
        </Tabs>
        <CardFooter className="text-sm text-foreground flex justify-between items-center pt-2">
          <div className="flex space-x-4">
            <Popover>
              <PopoverTrigger asChild>
                <div className="cursor-pointer p-0 h-auto text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact support
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <div className="grid gap-1">
                      <div className="text-sm text-yellow-600 font-semibold mb-2">
                        ⓘ Support does not have technical knowledge and cannot provide technical support. Please keep inquiries simple and non-technical.
                      </div>
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
              </PopoverContent>
            </Popover>
            <div className="p-0 h-auto text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Link href="/about">
                About
              </Link>
            </div>
            <div className="p-0 h-auto text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Link href="/api">
                API
              </Link>
            </div>
          </div>
          <ModeToggle />
        </CardFooter>
      </Card>
    </div>
  );
};

export default TabbedCardInterface;