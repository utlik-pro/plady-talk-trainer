
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VoiceSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
}

export const VoiceSetupModal = ({ isOpen, onClose, onSave }: VoiceSetupModalProps) => {
  const [apiKey, setApiKey] = useState('');

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey.trim());
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Настройка голосового чата</DialogTitle>
          <DialogDescription>
            Для работы голосового тренажёра необходим API ключ от ElevenLabs.
            Получите его на сайте elevenlabs.io
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="agentid" className="text-right">
              Agent ID
            </Label>
            <Input
              id="agentid"
              value="agent_01jy3m8mhpe3092q9cmsvzcwe8"
              readOnly
              className="col-span-3 bg-gray-100"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apikey" className="text-right">
              API Key
            </Label>
            <Input
              id="apikey"
              type="password"
              placeholder="Введите ваш ElevenLabs API ключ"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={!apiKey.trim()}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
