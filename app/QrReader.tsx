'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from '@/components/ui/alert';
import { locations } from './locations';
import { useMediaQuery } from "@/hooks/use-media-query"
import { Star } from 'lucide-react';
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
import QrScanner from 'qr-scanner';

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
  locationId: string;
  roomId: string;
}

interface ApiResponse {
  status: number;
  message: string;
}

interface Location {
  id: string;
  name: string;
  rooms: Room[];
}

interface Room {
  id: string;
  name: string;
}

interface AvailableClient {
  location: string;
  room: string;
}

const QrReaderWithConfirmation: React.FC = () => {
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameras, setCameras] = useState<QrScanner.Camera[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [selectedMachineData, setSelectedMachineData] = useState<Machine | null>(null);
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const scanner = useRef<QrScanner | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [cameraAccessDenied, setCameraAccessDenied] = useState<boolean>(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const latestMachineDataRef = useRef<Machine | null>(null);
  const [isRoomSupported, setIsRoomSupported] = useState<boolean>(true);
  const [isDefault, setIsDefault] = useState(false);

  const onScanSuccess = async (result: QrScanner.ScanResult) => {
    console.log(result);
    setScannedResult(result.data);
    const code = result.data.split('/').pop();
    if (code) {
      setQrCode(code);
      await fetchMachineData(code);
      setOpen(true);
    }
  };

  const onScanFail = (error: string | Error) => {
    console.error(error);
    setError('Failed to decode QR code. Please try again.');
  };

  const getCameras = async () => {
    try {
      const devices = await QrScanner.listCameras(true);
      setCameras(devices);
      
      const backCamera = devices.find(camera => camera.label.toLowerCase().includes('back'));
      
      if (backCamera) {
        setSelectedCamera(backCamera.id);
      } else if (devices.length > 0) {
        setSelectedCamera(devices[0].id);
      } else {
        setSelectedCamera('null');
      }
    } catch (err) {
      console.error('Failed to get cameras', err);
      setError('Failed to get camera list. Please check your device permissions.');
      setCameraAccessDenied(true);
    }
  };

  const fetchMachineData = useCallback(async (code: string) => {
    try {
      const machineResponse = await fetch(`https://mycscgo.com/api/v1/machine/qr/${code}`);
      const machineData: Machine = await machineResponse.json();
      setSelectedMachineData(machineData);
  
      const clientsResponse = await fetch('https://laundry.ucsc.gay/clients');
      const availableClients: AvailableClient[] = await clientsResponse.json();
      
      const isSupported = availableClients.some((client: AvailableClient) => 
        client.location === machineData.locationId && client.room === machineData.roomId
      );
      
      setIsRoomSupported(isSupported);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to fetch data. Please try again.');
    }
  }, []);

  useEffect(() => {
    if (qrCode && open) {
      fetchMachineData(qrCode);
      const interval = setInterval(() => {
        fetchMachineData(qrCode);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [qrCode, fetchMachineData, open]);

  useEffect(() => {
    getCameras();
  }, []);

  const stopScanner = () => {
    if (scanner.current) {
      scanner.current.stop();
    }
    setIsScanning(false);
  };

  const startScanner = async () => {
    console.log("Performing double stop-start");
    stopScanner();
    await new Promise(resolve => setTimeout(resolve, 500));
    if (scanner.current) {
      try {
        await scanner.current.start();
        setIsScanning(true);
        setError(null);
        setCameraAccessDenied(false);
      } catch (err) {
        console.error(err);
        setError('Failed to start the QR scanner. Please check your camera permissions and try again.');
        setCameraAccessDenied(true);
      }
    }
  };

  const initializeScanner = async () => {
    if (typeof window !== 'undefined' && videoRef.current && selectedCamera) {
      try {
        if (scanner.current) {
          scanner.current.destroy();
        }

        await import('qr-scanner/qr-scanner-worker.min.js');
        
        scanner.current = new QrScanner(
          videoRef.current,
          onScanSuccess,
          {
            onDecodeError: onScanFail,
            preferredCamera: selectedCamera,
            highlightScanRegion: true,
            highlightCodeOutline: true,
          }
        );

        await startScanner();
      } catch (err) {
        console.error(err);
        setIsScanning(false);
        setError('Failed to initialize the QR scanner. Please try again.');
      }
    }
  };

  useEffect(() => {
    if (selectedCamera) {
      initializeScanner();
    }

    return () => {
      if (scanner.current) {
        scanner.current.destroy();
      }
    };
  }, [selectedCamera]);

  const handleCameraChange = (cameraId: string) => {
    setSelectedCamera(cameraId);
  };

  const toggleScanning = async () => {
    if (isScanning) {
      stopScanner();
    } else {
      await startScanner();
    }
  };

  const confirmSubmit = async () => {
    if (!selectedMachineData) return;

    setIsLoading(true);
    const payload = {
      location: selectedMachineData.locationId,
      room: selectedMachineData.roomId,
      machine: selectedMachineData.licensePlate,
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

  useEffect(() => {
    const defaultTab = localStorage.getItem('defaultTab');
    setIsDefault(defaultTab === 'laundryqrscanner');
  }, []);

  const handleSetDefaultTab = () => {
    const newIsDefault = !isDefault;
    localStorage.setItem('defaultTab', newIsDefault ? 'laundryqrscanner' : 'laundrymachineselector');
    setIsDefault(newIsDefault);
  };

  return (
    <Card className="w-full max-w-md mx-auto rounded-t-none">
      <div className="flex justify-between items-center p-6">
        <h2 className="text-2xl font-bold">QR Scanner</h2>
        <button
          onClick={handleSetDefaultTab}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {isDefault ? 'Default Tab' : 'Set as Default Tab'}
        </button>
      </div>
      <CardContent>
        {!cameraAccessDenied && cameras.length > 0 && selectedCamera && (
          <div className="space-y-1">
            <label className="block text-sm font-medium text-foreground">Camera</label>
            <Select value={selectedCamera} onValueChange={handleCameraChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a camera" />
              </SelectTrigger>
              <SelectContent>
                {cameras.map((camera) => (
                  <SelectItem key={camera.id} value={camera.id}>
                    {camera.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {!cameraAccessDenied && selectedCamera ? (
          <div className="w-full max-w-[430px] h-[430px] mx-auto relative sm:w-full">
            <video ref={videoRef} className="w-full h-full object-cover"></video>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg
              viewBox="0 0 100 100"
              className="w-64 h-64 text-white opacity-50"
            >
              <path
                d="M25,2 L5,2 C3.3,2 2,3.3 2,5 L2,25"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                d="M2,75 L2,95 C2,96.7 3.3,98 5,98 L25,98"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                d="M75,98 L95,98 C96.7,98 98,96.7 98,95 L98,75"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                d="M98,25 L98,5 C98,3.3 96.7,2 95,2 L75,2"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />
            </svg>
          </div>
        </div>
        ) : (
          <Alert className="mt-4 bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100">
            <AlertDescription>
              Camera access denied. Please check your browser settings and grant camera permissions to use the QR scanner.
            </AlertDescription>
          </Alert>
        )}
        {/* {scannedResult && (
          <Alert className="mt-4">
            <AlertDescription>
              Scanned Result: <a href={scannedResult} target="_blank" rel="noopener noreferrer" className="underline">{scannedResult}</a>
            </AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )} */}
      </CardContent>
      <CardFooter className="flex justify-center">
      {!cameraAccessDenied && selectedCamera && (
        <>
          <Button onClick={toggleScanning} className="mr-2">
            {isScanning ? 'Stop scanning' : 'Start scanning'}
          </Button>
          <span className="text-foreground ml-2">
            {isScanning ? 'Scanning...' : 'Not scanning'}
          </span>
        </>
      )}
      {(cameraAccessDenied || !selectedCamera) && (
          <Button onClick={getCameras}>
            Retry Camera Access
          </Button>
        )}
      </CardFooter>

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
                {!isRoomSupported ? (
                  <Alert className="bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100">
                  <AlertDescription>
                    Room not supported. Please contact support for assistance.
                  </AlertDescription>
                </Alert>
                ) : selectedMachineData?.type === 'washer' ? (
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
                {/* <p>Time Remaining: {selectedMachineData?.timeRemaining || 'N/A'} minutes</p> */}
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>Cancel</Button>
              <Button onClick={confirmSubmit} disabled={isLoading || !isRoomSupported}>
                {isLoading ? 'Submitting...' : 'Confirm'}
              </Button>
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
                {!isRoomSupported ? (
                  <Alert className="bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100">
                  <AlertDescription>
                    Room not supported. Please contact support for assistance.
                  </AlertDescription>
                </Alert>
                ) : selectedMachineData?.type === 'washer' ? (
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
                {/* <p>Time Remaining: {selectedMachineData?.timeRemaining || 'N/A'} minutes</p> */}
              </div>
            </div>
            <DrawerFooter>
              <Button onClick={confirmSubmit} disabled={isLoading || !isRoomSupported}>
                {isLoading ? 'Submitting...' : 'Confirm'}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" disabled={isLoading}>Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}

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
    </Card>
  );
};

export default QrReaderWithConfirmation;