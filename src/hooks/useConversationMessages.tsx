
import { useState, useEffect } from 'react';

interface ConversationMessage {
  text: string;
  sender: 'user' | 'character';
}

export const useConversationMessages = () => {
  const [conversationMessages, setConversationMessages] = useState<ConversationMessage[]>([]);

  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.type === 'user_transcript' && message.final) {
        setConversationMessages(prev => [...prev, { text: message.text, sender: 'user' }]);
      } else if (message.type === 'agent_response') {
        setConversationMessages(prev => [...prev, { text: message.text, sender: 'character' }]);
      }
    };

    // This would need to be properly integrated with the ElevenLabs conversation
    // For now, we'll simulate collecting messages
    
    return () => {
      // Cleanup
    };
  }, []);

  const resetMessages = () => {
    setConversationMessages([]);
  };

  return {
    conversationMessages,
    resetMessages
  };
};
