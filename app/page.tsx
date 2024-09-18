'use client'

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabsimprovised';
import QrReader from './QrReader';
import LaundryMachineSelector from './LaundryMachineSelector';
import EnhancedPopover from './EnhancedPopover';
import Link from 'next/link';
import AboutDialog from './AboutDialogue';
import RunningDialog from './RunningDialogue';
import Settings from '@/app/SettingsDialogue';
import { useSettings } from '@/app/SettingsContext';

const TabbedCardInterface: React.FC = () => {
  const { defaultTab, selectedAPI, setIsSettingsOpen, backgroundUrl } = useSettings();
  const [currentTab, setCurrentTab] = useState(defaultTab);
  const [agreedToSupport, setAgreedToSupport] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isRunningOpen, setIsRunningOpen] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setCurrentTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    setKey(prevKey => prevKey + 1);
  }, [selectedAPI]);

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
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
    <>
      <style jsx global>{`
        @keyframes zoomOutBackground {
          0% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        .bg-zoom-out {
          animation: zoomOutBackground 3s ease-out forwards;
        }
      `}</style>
      <div className="relative flex items-center justify-center min-h-screen overflow-hidden" style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-zoom-out"
          style={{ 
            backgroundImage: `url('${backgroundUrl}')`,
          }}
        />
        <Card className="relative z-10 w-full max-w-md border-0 shadow-none bg-background">
          <Tabs value={currentTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2 mt-2 rounded-b-none">
              <TabsTrigger value="laundrymachineselector">Selector</TabsTrigger>
              <TabsTrigger value="laundryqrscanner">QR Scanner</TabsTrigger>
            </TabsList>
            <TabsContent value="laundrymachineselector">
              <CardContent className="p-0">
                <LaundryMachineSelector key={`selector-${key}`} selectedAPI={selectedAPI} />
              </CardContent>
            </TabsContent>
            <TabsContent value="laundryqrscanner">
              <CardContent className="p-0">
                <QrReader key={`qr-${key}`} selectedAPI={selectedAPI} />
              </CardContent>
            </TabsContent>
          </Tabs>
          <CardFooter className="text-sm text-foreground pt-4 overflow-x-auto hidden md:block">
            <div className="flex space-x-4 whitespace-nowrap">
              <div className="p-0 h-auto text-sm text-muted-foreground hover:text-foreground transition-colors">
                <AboutDialog isOpen={isAboutOpen} onOpenChange={setIsAboutOpen}>
                  <div 
                    className="p-0 h-auto text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    onClick={() => setIsAboutOpen(true)}
                  >
                    About
                  </div>
                </AboutDialog>
              </div>
              <div className="p-0 h-auto text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Link href="/api">
                  API
                </Link>
              </div>
              <EnhancedPopover agreed={agreedToSupport} setAgreed={setAgreedToSupport} />
              <div className="p-0 h-auto text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Link href="/paper">
                  Paper
                </Link>
              </div>
              <div className="p-0 h-auto text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Link href="/privacy">
                  Privacy
                </Link>
              </div>
              <div className="p-0 h-auto text-sm text-muted-foreground hover:text-foreground transition-colors">
                <RunningDialog isOpen={isRunningOpen} onOpenChange={setIsRunningOpen}>
                  <div 
                    className="p-0 h-auto text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    onClick={() => setIsRunningOpen(true)}
                  >
                    Running
                  </div>
                </RunningDialog>
              </div>
              <div 
                className="p-0 h-auto text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                onClick={() => setIsSettingsOpen(true)}
              >
                Settings
              </div>
            </div>
          </CardFooter>
        </Card>
        <Settings />
      </div>
    </>
  );
};

export default TabbedCardInterface;