
import { useState, useEffect } from 'react';
import { useConversationHistory } from './useConversationHistory';

interface ConversationMessage {
  text: string;
  sender: 'user' | 'character';
  timestamp: Date;
}

export const useConversationMessages = () => {
  const [conversationMessages, setConversationMessages] = useState<ConversationMessage[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [elevenLabsConversationId, setElevenLabsConversationId] = useState<string | null>(null);
  const { addMessage } = useConversationHistory();

  const addConversationMessage = async (text: string, sender: 'user' | 'character') => {
    const message = {
      text,
      sender,
      timestamp: new Date()
    };
    
    setConversationMessages(prev => [...prev, message]);
    
    // Сохраняем в базу данных если есть активная сессия
    if (currentSessionId) {
      await addMessage(currentSessionId, sender, text);
    }
  };

  const startNewSession = (sessionId: string, elevenLabsId?: string) => {
    setCurrentSessionId(sessionId);
    setElevenLabsConversationId(elevenLabsId || null);
    setConversationMessages([]);
  };

  const updateMessages = (messages: ConversationMessage[]) => {
    setConversationMessages(messages);
    
    // Сохраняем новые сообщения в базу данных
    if (currentSessionId) {
      messages.forEach(async (message) => {
        await addMessage(currentSessionId, message.sender, message.text);
      });
    }
  };

  const resetMessages = () => {
    setConversationMessages([]);
    setCurrentSessionId(null);
    setElevenLabsConversationId(null);
  };

  return {
    conversationMessages,
    currentSessionId,
    elevenLabsConversationId,
    addConversationMessage,
    startNewSession,
    updateMessages,
    resetMessages
  };
};
