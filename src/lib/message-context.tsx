'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import type { Message } from './types';
import { useAuth } from './auth-context';

// Initial mock messages are now empty
const initialMessages: Message[] = [];

interface MessageContextType {
  messages: Message[];
  getMessagesForJob: (jobId: string) => Message[];
  addMessage: (message: Omit<Message, 'timestamp'>, shouldAutoRespond?: boolean) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

const MESSAGES_STORAGE_KEY = 'koryob_messages';

export function MessageProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const { user } = useAuth();
  
  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(initialMessages));
      }
    } catch (error) {
      console.error("Failed to load messages from localStorage", error);
      setMessages(initialMessages);
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(initialMessages));
    }
  }, []);

  const updateMessagesStorage = (updatedMessages: Message[]) => {
      setMessages(updatedMessages);
      try {
          localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updatedMessages));
      } catch (error) {
          console.error("Failed to save messages to localStorage", error);
      }
  };

  const addMessage = useCallback((message: Omit<Message, 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      timestamp: Date.now(),
    };
    
    updateMessagesStorage([...messages, newMessage]);

  }, [messages]);

  const getMessagesForJob = useCallback((jobId: string) => {
      return messages.filter(msg => msg.jobId === jobId).sort((a, b) => a.timestamp - b.timestamp);
  }, [messages]);

  return (
    <MessageContext.Provider value={{ messages, getMessagesForJob, addMessage }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
}
