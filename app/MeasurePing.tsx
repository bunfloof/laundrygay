'use client'

import React, { useState, useEffect, useRef } from 'react';

const Spinner: React.FC = () => (
  <div className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
);

const PulsingCircle: React.FC = () => (
  <div className="relative inline-flex h-2 w-2 mr-2">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
  </div>
);

const MeasurePing: React.FC = () => {
  const [ping, setPing] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const pingStartTimeRef = useRef<number>(0);

  useEffect(() => {
    const socket = new WebSocket('wss://server-45493.prod.hosts.ooklaserver.net:8080/ws?');

    const sendPing = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        pingStartTimeRef.current = performance.now();
        wsRef.current.send('PING 1');
      }
    };

    socket.onopen = () => {
      console.log('WebSocket connected');
      wsRef.current = socket;
      setIsConnected(true);
      sendPing();
    };

    socket.onmessage = (event: MessageEvent) => {
      if (typeof event.data === 'string' && event.data.startsWith('PONG')) {
        const latency = Math.round(performance.now() - pingStartTimeRef.current);
        setPing(latency);
        
        setTimeout(sendPing, 1000);
      }
    };

    socket.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      wsRef.current = null;
      setIsConnected(false);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  return (
    <span className="inline-flex items-center">
      <span className="inline-block text-right mr-3">
        {ping !== null ? (
          `${ping} ms`
        ) : (
          <span className="inline-flex items-center justify-end w-full">
            <Spinner />
          </span>
        )}
      </span>
      {isConnected && (
        <>
          <PulsingCircle />
          <span>Connected to HCM2, Vietnam</span>
        </>
      )}
    </span>
  );
};

export default MeasurePing;