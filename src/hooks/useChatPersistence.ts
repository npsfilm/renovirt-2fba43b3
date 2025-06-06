
import { useState, useEffect } from 'react';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'support';
  content: string;
  timestamp: Date;
  interactionId?: string;
  feedbackGiven?: boolean;
}

export const useChatPersistence = () => {
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    // Generate or retrieve session ID
    let storedSessionId = localStorage.getItem('chat_session_id');
    const sessionTimestamp = localStorage.getItem('chat_session_timestamp');
    
    // Check if session is older than 1 hour
    if (sessionTimestamp) {
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      if (parseInt(sessionTimestamp) < oneHourAgo) {
        // Clear old session
        localStorage.removeItem('chat_messages');
        localStorage.removeItem('chat_session_id');
        localStorage.removeItem('chat_session_timestamp');
        storedSessionId = null;
      }
    }

    if (!storedSessionId) {
      storedSessionId = crypto.randomUUID();
      localStorage.setItem('chat_session_id', storedSessionId);
      localStorage.setItem('chat_session_timestamp', Date.now().toString());
    }
    
    setSessionId(storedSessionId);
  }, []);

  const saveMessages = (messages: Message[]) => {
    if (messages.length > 0) {
      localStorage.setItem('chat_messages', JSON.stringify(messages));
      localStorage.setItem('chat_session_timestamp', Date.now().toString());
    }
  };

  const loadMessages = (): Message[] => {
    try {
      const stored = localStorage.getItem('chat_messages');
      if (stored) {
        const messages = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        return messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
    return [];
  };

  const clearMessages = () => {
    localStorage.removeItem('chat_messages');
    localStorage.removeItem('chat_session_id');
    localStorage.removeItem('chat_session_timestamp');
  };

  return {
    sessionId,
    saveMessages,
    loadMessages,
    clearMessages
  };
};
