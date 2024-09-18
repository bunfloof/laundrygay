'use client'

import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Settings from '@/app/SettingsDialogue';
import { Trash2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LaundryMachine {
  location: string;
  room: string;
  machine: string;
  status?: string;
  machineType?: number;
  remainingCycleMins?: number;
  remainingCycleSecs?: number;
  friendlyLocation?: string;
  friendlyRoom?: string;
  stickerNumber?: number;
  licensePlate?: string;
  requestId?: string;
}

interface WebSocketResponse {
  data: {
    machineStatus: string;
    machineType: number;
    remainingCycleMins: number;
    remainingCycleSecs: number;
  };
  request_id: string;
  requested_location: string;
  requested_room: string;
  requested_machine: string;
}

interface Location {
  id: string;
  name: string;
  rooms: { id: string; name: string }[];
}

const locations: Location[] = [
  {
    id: '85859b65-2b10-4ed2-8785-8473ec121ff9',
    name: 'University of California, Santa Cruz',
    rooms: [
      { id: '4403363-034', name: 'Merrill Dorms Bldg A Big Room 26' },
      { id: '4403363-035', name: 'Merrill Dorms Bldg A Smol Room 24' },
      { id: '4403363-026', name: 'Crown Apts in Front of Community Room' }
    ],
  },
];

const Running: React.FC = () => {
  const router = useRouter();
  const [runningMachines, setRunningMachines] = useState<LaundryMachine[]>([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [machineToDelete, setMachineToDelete] = useState<LaundryMachine | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const fetchedRooms = useRef(new Set<string>());

  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
  
    setVH();
    window.addEventListener('resize', setVH);

    const storedMachines = JSON.parse(localStorage.getItem('laundryMachines') || '[]') as LaundryMachine[];
    setRunningMachines(storedMachines);

    storedMachines.forEach(machine => {
      fetchFriendlyNames(machine);
      const roomKey = `${machine.location}-${machine.room}`;
      if (!fetchedRooms.current.has(roomKey)) {
        fetchMachineDetails(machine);
        fetchedRooms.current.add(roomKey);
      }
    });

    ws.current = new WebSocket('wss://laundry.ucsc.gay/machinestatusws');

    ws.current.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.current.onmessage = (event) => {
      const response: WebSocketResponse = JSON.parse(event.data);
      updateMachineStatus(response);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    const interval = setInterval(() => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        storedMachines.forEach((machine) => {
          ws.current!.send(JSON.stringify({
            location: machine.location,
            room: machine.room,
            machine: machine.machine
          }));
        });
      }
    }, 1000);

    return () => {
      window.removeEventListener('resize', setVH);
      clearInterval(interval);
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const fetchFriendlyNames = async (machine: LaundryMachine) => {
    const location = locations.find(loc => loc.id === machine.location);
    if (location) {
      const room = location.rooms.find(r => r.id === machine.room);
      setRunningMachines(prevMachines => 
        prevMachines.map(m => 
          m.location === machine.location && m.room === machine.room
            ? { ...m, friendlyLocation: location.name, friendlyRoom: room?.name || m.room }
            : m
        )
      );
    } else {
      try {
        //const locationResponse = await fetch(`https://mycscgo.com/api/v1/location/${machine.location}`);
        const locationResponse = await fetch(`https://laundry.ucsc.gay/location?location=${machine.location}`);
        const locationData = await locationResponse.json();
        const roomData = locationData.rooms.find((r: any) => r.roomId === machine.room);
        setRunningMachines(prevMachines => 
          prevMachines.map(m => 
            m.location === machine.location && m.room === machine.room
              ? { ...m, friendlyLocation: locationData.label, friendlyRoom: roomData?.label || m.room }
              : m
          )
        );
      } catch (error) {
        console.error('Error fetching friendly names:', error);
      }
    }
  };

  const fetchMachineDetails = async (machine: LaundryMachine) => {
    console.log(`Fetching details for room: ${machine.room}`);
    try {
      //const response = await fetch(`https://mycscgo.com/api/v1/location/${machine.location}/room/${machine.room}/machines`);
      const response = await fetch(`https://laundry.ucsc.gay/machines_archive?location=${machine.location}&room=${machine.room}`);
      console.log(`API response status: ${response.status}`);
      const machinesData = await response.json();
      console.log('Machines data:', machinesData);
      
      setRunningMachines(prevMachines => 
        prevMachines.map(m => {
          if (m.location === machine.location && m.room === machine.room) {
            const machineData = machinesData.find((md: any) => md.licensePlate === m.machine);
            if (machineData) {
              return { ...m, stickerNumber: machineData.stickerNumber, licensePlate: machineData.licensePlate };
            }
          }
          return m;
        })
      );
    } catch (error) {
      console.error('Error fetching machine details:', error);
    }
  };

  const updateMachineStatus = (response: WebSocketResponse) => {
    setRunningMachines(prevMachines => 
      prevMachines.map(machine => {
        if (machine.location === response.requested_location &&
            machine.room === response.requested_room &&
            machine.machine === response.requested_machine) {
          return {
            ...machine,
            status: response.data.machineStatus,
            machineType: response.data.machineType,
            remainingCycleMins: response.data.remainingCycleMins,
            remainingCycleSecs: response.data.remainingCycleSecs,
            requestId: response.request_id
          };
        }
        return machine;
      })
    );
  };

  const getMachineTypeString = (type: number | undefined) => {
    switch(type) {
      case 1: return 'Washer';
      case 2: return 'Dryer';
      default: return 'Unknown';
    }
  };

  const getStatusString = (status: string | undefined) => {
    switch(status) {
      case '0001': return 'Available';
      case '0002': return 'In Use';
      case '0003': return 'Almost Done';
      case '0004': return 'End of Cycle';
      default: return 'Unknown';
    }
  };

  const getFinishTime = (remainingMins: number | undefined, remainingSecs: number | undefined) => {
    if (remainingMins === undefined || remainingSecs === undefined) return '';
    const now = new Date();
    const finishTime = new Date(now.getTime() + (remainingMins * 60 + remainingSecs) * 1000);
    return finishTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const deleteMachine = (machineToDelete: LaundryMachine) => {
    const updatedMachines = runningMachines.filter(
      machine => !(machine.location === machineToDelete.location &&
                   machine.room === machineToDelete.room &&
                   machine.machine === machineToDelete.machine)
    );
    setRunningMachines(updatedMachines);
    localStorage.setItem('laundryMachines', JSON.stringify(updatedMachines));
  };

  const clearAllMachines = () => {
    setRunningMachines([]);
    localStorage.removeItem('laundryMachines');
    setIsAlertOpen(false);
    fetchedRooms.current.clear();
  };

  const handleDeleteMachine = (machine: LaundryMachine) => {
    setMachineToDelete(machine);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (machineToDelete) {
      deleteMachine(machineToDelete);
    } else {
      clearAllMachines();
    }
    setIsAlertOpen(false);
    setMachineToDelete(null);
  };

  return (
    <>
      <Card className="w-full border-0 shadow-none">
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Running Machines</h2>
            {runningMachines.length > 0 && (
              <span 
                className="mr-5 text-md text-red-600 hover:text-red-700 cursor-pointer transition-colors"
                onClick={() => {
                  setMachineToDelete(null);
                  setIsAlertOpen(true);
                }}
              >
                Clear All
              </span>
            )}
          </div>
          {runningMachines.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm">View all of the laundry machines you’ve started.</p>
          ) : (
            <ul className="space-y-4">
              {runningMachines.map((machine, index) => (
                <li key={index} className="relative">
                  <Card className="bg-secondary">
                    <CardContent className="p-4">
                      <div>
                        <p><strong>Location:</strong> {machine.friendlyLocation || machine.location}</p>
                        <p><strong>Room:</strong> {machine.friendlyRoom || machine.room}</p>
                        <p><strong>Machine:</strong> {machine.stickerNumber || 'N/A'} ({machine.licensePlate})</p>
                        <p><strong>Type:</strong> {getMachineTypeString(machine.machineType)}</p>
                        <p><strong>Status:</strong> {machine.status}</p>
                        <p><strong>Remaining Time:</strong> {machine.remainingCycleMins}:{machine.remainingCycleSecs?.toString().padStart(2, '0')} ({getFinishTime(machine.remainingCycleMins, machine.remainingCycleSecs)})</p>
                        {/* <p><strong>Last Update ID:</strong> {machine.requestId}</p> */}
                      </div>
                    </CardContent>
                  </Card>
                  <button
                    onClick={() => handleDeleteMachine(machine)}
                    className="absolute top-2 right-2 p-1 rounded-md text-foreground/50 hover:text-foreground transition-colors duration-200"
                    aria-label="Delete machine"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      <Settings />
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {machineToDelete
                ? `This action cannot be undone. This will permanently delete the machine ${machineToDelete.stickerNumber || 'N/A'} (${machineToDelete.licensePlate}) from the list.`
                : "This action cannot be undone. This will permanently delete all your running machines from the list."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMachineToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Running;