import { useState, useEffect, useCallback } from 'react';

const useWebSocket = (url) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [clientId, setClientId] = useState(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received message:', data);
        
        // Handle connection established message
        if (data.type === 'connection_established') {
          setClientId(data.clientId);
        } else {
          setMessage(data);
        }
      } catch (err) {
        console.error('Error parsing message:', err);
        setError('Failed to parse message');
      }
    };

    ws.onerror = (event) => {
      console.error('WebSocket error:', event);
      setError('WebSocket connection error');
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      setSocket(null);
    };

    // Clean up on unmount
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [url]);

  // Send message to WebSocket server
  const sendMessage = useCallback((type, data = {}) => {
    if (socket && isConnected) {
      const message = JSON.stringify({
        type,
        ...data
      });
      socket.send(message);
      return true;
    }
    return false;
  }, [socket, isConnected]);

  // Start a scenario
  const startScenario = useCallback((topicId, params = {}) => {
    return sendMessage('start_scenario', { topicId, params });
  }, [sendMessage]);

  // Stop a scenario
  const stopScenario = useCallback(() => {
    return sendMessage('stop_scenario');
  }, [sendMessage]);

  // Trigger an event
  const triggerEvent = useCallback((eventType, eventParams = {}) => {
    return sendMessage('trigger_event', { eventType, eventParams });
  }, [sendMessage]);

  return {
    isConnected,
    message,
    error,
    clientId,
    startScenario,
    stopScenario,
    triggerEvent,
    sendMessage
  };
};

export default useWebSocket;