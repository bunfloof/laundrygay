import React from 'react';
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

const Settings: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    defaultTab,
    setDefaultTab,
    selectedAPI,
    setSelectedAPI,
  } = useSettings();

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