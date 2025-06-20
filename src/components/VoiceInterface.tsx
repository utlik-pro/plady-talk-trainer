
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceInterfaceProps {
  isListening: boolean;
  isSpeaking: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
}

export const VoiceInterface = ({ 
  isListening, 
  isSpeaking, 
  onStartListening, 
  onStopListening 
}: VoiceInterfaceProps) => {
  return (
    <div className="flex items-center justify-center space-x-4 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="text-center">
        <Button
          size="lg"
          className={`w-16 h-16 rounded-full ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-gradient-to-r from-plady-pink to-plady-purple hover:from-plady-pink/90 hover:to-plady-purple/90'
          }`}
          onClick={isListening ? onStopListening : onStartListening}
          disabled={isSpeaking}
        >
          {isListening ? (
            <MicOff className="w-6 h-6 text-white" />
          ) : (
            <Mic className="w-6 h-6 text-white" />
          )}
        </Button>
        <p className="text-sm text-gray-600 mt-2">
          {isListening ? 'Говорите...' : 'Нажмите для записи'}
        </p>
      </div>
      
      {isSpeaking && (
        <div className="flex items-center text-plady-purple">
          <Volume2 className="w-5 h-5 mr-2 animate-pulse" />
          <span className="text-sm">Анна говорит...</span>
        </div>
      )}
    </div>
  );
};
