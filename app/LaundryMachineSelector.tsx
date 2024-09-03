'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { locations } from './locations';
import { Loader2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from '@/components/ui/separator';
import { ModeToggle } from '@/components/mode-toggle';
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

interface Location {
  id: string;
  name: string;
  rooms: Room[];
}

interface Room {
  id: string;
  name: string;
}

interface Machine {
  licensePlate: string;
  type: 'washer' | 'dryer';
  stickerNumber: number;
  settings: {
    soil?: string;
    cycle?: string;
    washerTemp?: string;
    dryerTemp?: string;
  };
  timeRemaining: number;
}

interface ApiResponse {
  status: number;
  message: string;
}

interface AvailableClient {
  location: string;
  room: string;
}

const LaundryMachineSelector: React.FC = () => {
  const [availableClients, setAvailableClients] = useState<AvailableClient[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [machines, setMachines] = useState<Machine[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<string>('');
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const latestMachinesRef = useRef<Machine[]>([]);
  
  const handleMachineSelect = (value: string) => {
    setSelectedMachine(value);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  useEffect(() => {
    fetchAvailableClients();
  }, []);

  const fetchAvailableClients = async () => {
    try {
      const res = await fetch('https://laundry.ucsc.gay/clients');
      const data: AvailableClient[] = await res.json();
      setAvailableClients(data);
      
      const availableLocationIds = Array.from(new Set(data.map(client => client.location)));
      if (availableLocationIds.length === 1) {
        setSelectedLocation(availableLocationIds[0]);
      }
    } catch (error) {
      console.error('Error fetching available clients:', error);
    }
  };

  const availableLocations = locations.filter(location =>
    availableClients.some(client => client.location === location.id)
  );

  const availableRooms = selectedLocation
    ? locations
        .find(loc => loc.id === selectedLocation)
        ?.rooms.filter(room =>
          availableClients.some(
            client => client.location === selectedLocation && client.room === room.id
          )
        ) || []
    : [];
  

  const fetchMachines = useCallback(async (locationId: string, roomId: string) => {
    try {
      const res = await fetch(`https://mycscgo.com/api/v1/location/${locationId}/room/${roomId}/machines`);
      const data: Machine[] = await res.json();
      
      const updatedMachines = [
        ...data.filter(m => m.type === 'washer').sort((a, b) => b.stickerNumber - a.stickerNumber),
        ...data.filter(m => m.type === 'dryer').sort((a, b) => a.stickerNumber - b.stickerNumber)
      ];

      setMachines(updatedMachines);
      latestMachinesRef.current = updatedMachines;
    } catch (error) {
      console.error('Error fetching machines:', error);
    }
  }, []);
  

  useEffect(() => {
    if (selectedLocation && selectedRoom) {
      fetchMachines(selectedLocation, selectedRoom);
      const interval = setInterval(() => {
        fetchMachines(selectedLocation, selectedRoom);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [selectedLocation, selectedRoom, fetchMachines]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpen(true);
  };

  const confirmSubmit = async () => {
    setIsLoading(true);
    const payload = {
      location: selectedLocation,
      room: selectedRoom,
      machine: selectedMachine,
    };
    try {
      const res = await fetch('https://laundry.ucsc.gay/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data: string = await res.text();
      setResponse({ status: res.status, message: data });
    } catch (error) {
      if (error instanceof Error) {
        setResponse({ status: 500, message: error.message });
      } else {
        setResponse({ status: 500, message: 'An unknown error occurred' });
      }
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  const selectedMachineData = machines.find(m => m.licensePlate === selectedMachine);

return (
  <>
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-2xl font-bold">Selector</CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-foreground">Location</label>
            {availableLocations.length === 1 ? (
              <div className="p-2 bg-secondary text-secondary-foreground rounded-md">
                {availableLocations[0].name}
              </div>
            ) : (
              <Select
                value={selectedLocation}
                onValueChange={(value: string) => {
                  setSelectedLocation(value);
                  setSelectedRoom('');
                  setSelectedMachine('');
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  {availableLocations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          
          {selectedLocation && (
            <div className="space-y-1">
              <label className="block text-sm font-medium text-foreground">Room</label>
              <Select
                value={selectedRoom}
                onValueChange={(value: string) => {
                  setSelectedRoom(value);
                  setSelectedMachine('');
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a room" />
                </SelectTrigger>
                <SelectContent>
                  {availableRooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {selectedRoom && (
            <div className="space-y-1">
              <label className="block text-sm font-medium text-foreground">Machine</label>
              <Select value={selectedMachine} onValueChange={handleMachineSelect}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a machine" />
                </SelectTrigger>
                <SelectContent>
                  {machines.map((machine) => (
                    <SelectItem key={machine.licensePlate} value={machine.licensePlate}>
                      {machine.type.charAt(0).toUpperCase() + machine.type.slice(1)} {machine.stickerNumber} ({machine.licensePlate})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {selectedMachine && selectedMachineData && (
              <div className="space-y-1">
                <label className="block text-sm font-medium text-foreground">Machine Settings</label>
                <div className="p-2 bg-secondary text-secondary-foreground rounded-md">
                  {selectedMachineData.type === 'washer' ? (
                    <>
                      <p>Soil: {selectedMachineData.settings.soil || 'N/A'}</p>
                      <p>Cycle: {selectedMachineData.settings.cycle || 'N/A'}</p>
                      <p>Temperature: {selectedMachineData.settings.washerTemp || 'N/A'}</p>
                    </>
                  ) : (
                    <p>Temperature: {selectedMachineData.settings.dryerTemp || 'N/A'}</p>
                  )}
                  <p>Time Remaining: {selectedMachineData.timeRemaining || 'N/A'} minutes</p>
                </div>
              </div>
            )}
          
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!selectedMachine || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        </form>
        {response && (
          <Alert className={`mt-4 ${
            response.status === 200
              ? 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100'
              : 'bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100'
          }`}>
            <AlertDescription>
              Status: {response.status}<br />
              Response: {response.message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>

    {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Machine Selection</DialogTitle>
              <DialogDescription>
                Please confirm the settings for your selected machine.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <h3 className="font-medium">Selected Machine Settings:</h3>
                {selectedMachineData?.type === 'washer' ? (
                  <>
                    <p>Soil: {selectedMachineData.settings.soil || 'N/A'}</p>
                    <p>Cycle: {selectedMachineData.settings.cycle || 'N/A'}</p>
                    <p>Temperature: {selectedMachineData.settings.washerTemp || 'N/A'}</p>
                  </>
                ) : selectedMachineData?.type === 'dryer' ? (
                  <p>Temperature: {selectedMachineData.settings.dryerTemp || 'N/A'}</p>
                ) : (
                  <p>No settings available</p>
                )}
                { /* <p>Time Remaining: {selectedMachineData?.timeRemaining || 'N/A'} minutes</p> */}
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={confirmSubmit}>Confirm</Button>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Confirm Machine Selection</DrawerTitle>
              <DrawerDescription>
                Please confirm the settings for your selected machine.
              </DrawerDescription>
            </DrawerHeader>
            <div className="grid gap-4 py-4 px-4">
              <div className="grid gap-2">
                <h3 className="font-medium">Selected Machine Settings:</h3>
                {selectedMachineData?.type === 'washer' ? (
                  <>
                    <p>Soil: {selectedMachineData.settings.soil || 'N/A'}</p>
                    <p>Cycle: {selectedMachineData.settings.cycle || 'N/A'}</p>
                    <p>Temperature: {selectedMachineData.settings.washerTemp || 'N/A'}</p>
                  </>
                ) : selectedMachineData?.type === 'dryer' ? (
                  <p>Temperature: {selectedMachineData.settings.dryerTemp || 'N/A'}</p>
                ) : (
                  <p>No settings available</p>
                )}
                { /* <p>Time Remaining: {selectedMachineData?.timeRemaining || 'N/A'} minutes</p> */}
              </div>
            </div>
            <DrawerFooter>
              <Button onClick={confirmSubmit}>Confirm</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default LaundryMachineSelector;