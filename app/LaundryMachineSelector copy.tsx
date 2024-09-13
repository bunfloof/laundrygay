'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Star } from 'lucide-react';
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
import { useMemo } from 'react';

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

interface ApiLocationData {
  locationId: string;
  label: string;
  rooms: ApiRoomData[];
}

interface ApiRoomData {
  locationId: string;
  roomId: string;
  label: string;
}

interface AvailableClient {
  location: string;
  room: string;
}

const locations = [
  {
    id: '85859b65-2b10-4ed2-8785-8473ec121ff9',
    name: 'University of California, Santa Cruz',
    rooms: [
      { id: '4403363-034', name: 'Merrill Dorms Bldg A Big Room 26' },
      { id: '4403363-035', name: 'Merrill Dorms Bldg A Smol Room 24' },
      { id: '4403363-026', name: 'Crown Apts in Front of Community Room' }
    ]
  },
];

interface InternalAPIMachine {
  controllerType: string;
  groupId: string | null;
  id: string;
  ip: string;
  license: string;
  stack: string | null;
  type: string;
}

interface WsMachine {
  cycleType: number;
  keypadSelect: string;
  machineStatus: string;
  machineType: number;
  remainingCycleMins: number;
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
  const [isDefault, setIsDefault] = useState(false);
  const [apiLocationDataMap, setApiLocationDataMap] = useState<Record<string, ApiLocationData | null>>({});
  const [selectedAPI, setSelectedAPI] = useState<string>('internal');
  const [internalAPIMachines, setInternalAPIMachines] = useState<InternalAPIMachine[]>([]);
  const latestInternalAPIMachinesRef = useRef<InternalAPIMachine[]>([]);
  const websocket = useRef<WebSocket | null>(null);
  const [selectedWsMachineData, setSelectedWsMachineData] = useState<WsMachine | null>(null);
  
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
      //console.log('Available clients:', data);
      setAvailableClients(data || []);
      
      const uniqueLocations = Array.from(new Set(data?.map(client => client.location) || []));
      //console.log('Unique locations:', uniqueLocations);

      uniqueLocations.forEach(fetchLocationData);

      if (uniqueLocations.length === 1) {
        //console.log('Only one location available. Auto-selecting:', uniqueLocations[0]);
        setSelectedLocation(uniqueLocations[0]);
      }
    } catch (error) {
      console.error('Error fetching available clients:', error);
      setAvailableClients([]);
    }
  };

  const fetchLocationData = useCallback(async (locationId: string) => {
    const url = selectedAPI === 'internal' 
      ? `https://laundry.ucsc.gay/location?location=${locationId}`
      : `https://mycscgo.com/api/v1/location/${locationId}`;

    try {
      const res = await fetch(url);
      const data: ApiLocationData = await res.json();
      //console.log('API Location Data for', locationId, ':', data);
      setApiLocationDataMap(prev => ({ ...prev, [locationId]: data || null }));
    } catch (error) {
      console.error('Error fetching location data for', locationId, ':', error);
      setApiLocationDataMap(prev => ({ ...prev, [locationId]: null }));
    }
  }, [selectedAPI]);

  useEffect(() => {
    if (selectedLocation) {
      //console.log('Selected Location:', selectedLocation);
      fetchLocationData(selectedLocation);
    }
  }, [selectedLocation, fetchLocationData]);
  
  const availableLocations = useMemo(() => {
    return Array.from(new Set(availableClients?.map(client => client.location) || []))
      .map(locationId => {
        const knownLocation = locations?.find(loc => loc.id === locationId);
        const apiData = apiLocationDataMap[locationId];
        return {
          id: locationId,
          name: knownLocation?.name || apiData?.label || locationId
        };
      });
  }, [availableClients, apiLocationDataMap]);

  const availableRooms = useMemo(() => {
    if (!selectedLocation) {
      return [];
    }

    const filteredClients = availableClients?.filter(client => client.location === selectedLocation) || [];
    const roomSet = new Set(filteredClients.map(client => client.room));

    const unsortedRooms = Array.from(roomSet).map(roomId => {
      const knownLocation = locations?.find(loc => loc.id === selectedLocation);
      const knownRoom = knownLocation?.rooms?.find(room => room.id === roomId);
      const apiRoom = apiLocationDataMap[selectedLocation]?.rooms?.find(room => room.roomId === roomId);
      return {
        id: roomId,
        name: knownRoom?.name || apiRoom?.label || roomId
      };
    });

    return unsortedRooms.sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedLocation, availableClients, apiLocationDataMap]);

  useEffect(() => {
    console.log("selectedWsMachineData updated:", selectedWsMachineData);
  }, [selectedWsMachineData]);

  const fetchMachines = useCallback(async (locationId: string, roomId: string) => {
    const MAX_RETRIES = 10;
    const RETRY_DELAY = 250;

    const fetchWithRetry = async (url: string, retries: number): Promise<any> => {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return await res.json();
      } catch (error) {
        if (retries > 0) {
          console.log(`Retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          return fetchWithRetry(url, retries - 1);
        }
        throw error;
      }
    };
    
    try {
      if (selectedAPI === 'internal') {
        const data: InternalAPIMachine[] = await fetchWithRetry(`https://laundry.ucsc.gay/machines?location=${locationId}&room=${roomId}`, MAX_RETRIES);
        
        const sortedMachines = data.sort((a, b) => {
          if (a.type !== b.type) {
            return a.type.toLowerCase() === 'washer' ? -1 : 1;
          }
          const aNumber = parseInt(a.license.split('-')[0], 10);
          const bNumber = parseInt(b.license.split('-')[0], 10);
          return bNumber - aNumber; // Higher license numbers first
        });

        setInternalAPIMachines(sortedMachines);
        latestInternalAPIMachinesRef.current = sortedMachines;
      } else {
        const res = await fetch(`https://mycscgo.com/api/v1/location/${locationId}/room/${roomId}/machines`);
        const data: Machine[] = await res.json();
        
        const updatedMachines = [
          ...(data?.filter(m => m.type === 'washer') || []).sort((a, b) => (b.stickerNumber || 0) - (a.stickerNumber || 0)),
          ...(data?.filter(m => m.type === 'dryer') || []).sort((a, b) => (a.stickerNumber || 0) - (b.stickerNumber || 0))
        ];

        setMachines(updatedMachines);
        latestMachinesRef.current = updatedMachines;
      }
    } catch (error) {
      console.error('Error fetching machines:', error);
      if (selectedAPI === 'internal') {
        setInternalAPIMachines([]);
        latestInternalAPIMachinesRef.current = [];
      } else {
        setMachines([]);
        latestMachinesRef.current = [];
      }
    }
  }, [selectedAPI]);
  
  useEffect(() => {
    if (selectedLocation && selectedRoom && selectedAPI === 'internal') {
      websocket.current = new WebSocket('wss://laundry.ucsc.gay/machinestatusws');

      websocket.current.onopen = () => {
        console.log('WebSocket connected');
      };

      websocket.current.onmessage = (event) => {
        console.log('Raw WebSocket message:', event.data);
        let fullMessage;
        try {
          fullMessage = JSON.parse(event.data);
        } catch (error) {
          console.error('Failed to parse WebSocket message as JSON:', error);
          fullMessage = event.data; // Keep the raw message if it's not JSON
        }

        console.log('Processed WebSocket message:', fullMessage);

        setSelectedWsMachineData(fullMessage);
        console.log("we now changed it to", selectedWsMachineData)
      };

      websocket.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      const interval = setInterval(() => {
        if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
          const message = JSON.stringify({
            location: selectedLocation,
            room: selectedRoom,
            machine: selectedMachine,
          });
          websocket.current.send(message);
          console.log('Message sent to WebSocket:', message);
        }
      }, 3000);

      return () => {
        clearInterval(interval);
        if (websocket.current) {
          console.log('Closing WebSocket connection');
          websocket.current.close();
        }
      };
    } else {
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
  
  useEffect(() => {
    const defaultTab = localStorage.getItem('defaultTab');
    setIsDefault(defaultTab === 'laundrymachineselector');
  }, []);

  const handleSetDefaultTab = () => {
    const newIsDefault = !isDefault;
    localStorage.setItem('defaultTab', newIsDefault ? 'laundrymachineselector' : 'laundryqrscanner');
    setIsDefault(newIsDefault);
  };

  return (
    <>
    <Card className="w-full max-w-md mx-auto rounded-t-none">
      <div className="flex justify-between items-center p-6">
        <h2 className="text-2xl font-bold">Selector</h2>
        <button
          onClick={handleSetDefaultTab}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {isDefault ? 'Default Tab' : 'Set as Default Tab'}
        </button>
      </div>
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
                {selectedAPI === 'internal' ? (
                    internalAPIMachines.map((machine) => (
                      <SelectItem key={machine.license} value={machine.license}>
                        {machine.type.charAt(0).toUpperCase() + machine.type.slice(1)} {machine.license}
                      </SelectItem>
                    ))
                  ) : (
                    machines.map((machine) => (
                      <SelectItem key={machine.licensePlate} value={machine.licensePlate}>
                        {machine.type.charAt(0).toUpperCase() + machine.type.slice(1)} {machine.stickerNumber} ({machine.licensePlate})
                      </SelectItem>
                    ))
                  )
                }
                </SelectContent>
              </Select>
            </div>
          )}
          
          {selectedMachine && selectedMachineData && selectedAPI !== 'internal' ? (
              <div className="space-y-1">
                poosY
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
            ) : selectedMachine && selectedAPI === 'internal' ? (
              <p className="break-words whitespace-pre-wrap overflow-auto">
                  {JSON.stringify(selectedWsMachineData) || 'N/A'}
              </p>
            ) : null
          }
          
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