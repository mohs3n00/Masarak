
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function useSocket(token: string) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    const socketInstance = io(`${SOCKET_URL}/academic-chat`, {
      auth: { token: `Bearer ${token}` },
      transports: ['websocket']
    });

    socketInstance.on('connect', () => {
      console.log('Connected to academic chat');
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [token]);

  return socket;
}
