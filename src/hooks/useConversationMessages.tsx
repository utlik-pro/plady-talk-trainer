
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
  const { addMessage } = useConversationHistory();

  const addConversationMessage = async (text: string, sender: 'user' | 'character') => {
    const message = {
      text,
      sender,
      timestamp: new Date()
    };
    
    setConversationMessages(prev => [...prev, message]);
    
    // Save to database if we have an active session
    if (currentSessionId) {
      await addMessage(currentSessionId, sender, text);
    }
  };

  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.type === 'user_transcript' && message.final) {
        addConversationMessage(message.text, 'user');
      } else if (message.type === 'agent_response') {
        addConversationMessage(message.text, 'character');
      }
    };

    // This would need to be properly integrated with the ElevenLabs conversation
    // For now, we'll simulate collecting messages
    
    return () => {
      // Cleanup
    };
  }, [currentSessionId]);

  const startNewSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setConversationMessages([]);
  };

  const resetMessages = () => {
    setConversationMessages([]);
    setCurrentSessionId(null);
  };

  return {
    conversationMessages,
    currentSessionId,
    addConversationMessage,
    startNewSession,
    resetMessages
  };
};
