'use client'

import React, { useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from '@/components/ui/separator';
import { ModeToggle } from '@/components/mode-toggle';
import { useSettings } from '@/app/SettingsContext';
import { CustomEmailInput } from "@/app/CustomEmailInput"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

const Settings: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    defaultTab,
    setDefaultTab,
    selectedAPI,
    setSelectedAPI,
    email,
    setEmail,
    offsetTime,
    setOffsetTime,
    backgroundUrl,
    setBackgroundUrl,
  } = useSettings();

  const saveSettings = useCallback(async (newEmail: string, newOffsetTime: string) => {
    if (newEmail === '') {
      setEmail('');
      localStorage.setItem('email', '');
      return;
    }

    const laundryMachines = JSON.parse(localStorage.getItem('laundryMachines') || '[]');
    
    for (const machine of laundryMachines) {
      try {
        const response = await fetch('https://laundry.ucsc.gay/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            location: machine.location,
            room: machine.room,
            machine: machine.machine,
            email: newEmail,
            offset_time: parseInt(newOffsetTime),
          }),
        });

        if (!response.ok) {
          console.error(`Failed to update settings for machine ${machine.machine}`);
        }
      } catch (error) {
        console.error(`Error updating settings for machine ${machine.machine}:`, error);
      }
    }
  }, [setEmail]);

  const handleEmailSave = (newEmail: string) => {
    setEmail(newEmail);
    if (newEmail !== '') {
      saveSettings(newEmail, offsetTime);
    }
  };

  const handleOffsetTimeChange = (newOffsetTime: string) => {
    setOffsetTime(newOffsetTime);
    if (email !== '') {
      saveSettings(email, newOffsetTime);
    }
  };

  return (
    <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="py-1">
          <h4 className="mb-2 text-sm font-medium">Default Tab</h4>
          <p className="text-sm text-muted-foreground mb-4">Choose which tab to show when you first open the app.</p>
          <RadioGroup
            value={defaultTab}
            onValueChange={setDefaultTab}
          >
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="laundrymachineselector" id="selector" />
              <Label htmlFor="selector">Selector</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="laundryqrscanner" id="qrscanner" />
              <Label htmlFor="qrscanner">QR Scanner</Label>
            </div>
          </RadioGroup>
        </div>
        <Separator />
        <div className="py-1">
          <h4 className="mb-2 text-sm font-medium">API</h4>
          <p className="text-sm text-muted-foreground mb-4">Choose which API to use for laundry machine data.</p>
          <RadioGroup
            value={selectedAPI}
            onValueChange={setSelectedAPI}
          >
            <div className="flex items-start space-x-2 mb-2">
              <RadioGroupItem value="" id="csc" className="mt-1" />
              <div>
                <Label htmlFor="csc">Default</Label>
                <p className="text-xs text-muted-foreground">This uses our backdoor with GET requests to the cscgo server.</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="internal" id="internal" className="mt-1" />
              <div>
                <Label htmlFor="internal">Internal</Label>
                <p className="text-xs text-muted-foreground">This uses our internal API with websockets. This never communicates with the cscgo server.</p>
              </div>
            </div>
          </RadioGroup>
        </div>
        <Separator />
        <div className="py-1">
          <h4 className="mb-2 text-sm font-medium">Email Notifications</h4>
          <p className="text-sm text-muted-foreground mb-4">Set your email for notifications and reminder time in minutes before your load is finished.</p>
          <div className="flex items-start space-x-2">
            <div className="flex-grow">
              <CustomEmailInput
                placeholder="Enter your email"
                initialValue={email}
                onSave={handleEmailSave}
              />
            </div>
            <Select value={offsetTime} onValueChange={handleOffsetTimeChange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Remind me" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 min</SelectItem>
                <SelectItem value="3">3 mins</SelectItem>
                <SelectItem value="5">5 mins</SelectItem>
                <SelectItem value="10">10 mins</SelectItem>
                <SelectItem value="15">15 mins</SelectItem>
                <SelectItem value="20">20 mins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Separator />
        <div className="py-1">
          <h4 className="mb-2 text-sm font-medium">Background Image</h4>
          <p className="text-sm text-muted-foreground mb-4">Enter a URL for the background image.</p>
          <Input
            type="text"
            placeholder="Enter image URL"
            value={backgroundUrl}
            onChange={(e) => setBackgroundUrl(e.target.value)}
          />
        </div>
        <Separator />
        <div className="py-1">
          <h4 className="mb-2 text-sm font-medium">Theme</h4>
          <p className="text-sm text-muted-foreground mb-4">Toggle between light and dark mode.</p>
          <div className="flex items-center justify-between">
            <ModeToggle />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Settings;