'use client'

import React, { useState, useEffect, useRef } from 'react';

const PingMeasurer: React.FC = () => {
  const [ping, setPing] = useState<number | null>(null);
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
      sendPing();
    };

    socket.onmessage = (event: MessageEvent) => {
      if (typeof event.data === 'string' && event.data.startsWith('PONG')) {
        const latency = Math.round(performance.now() - pingStartTimeRef.current) - 10;
        setPing(latency);
        
        // Schedule next ping after 1 second
        setTimeout(sendPing, 1000);
      }
    };

    socket.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      wsRef.current = null;
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  return (
    <>{ping}</>
  );
};

export default PingMeasurer;