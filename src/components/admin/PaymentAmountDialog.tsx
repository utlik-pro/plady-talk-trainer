
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

interface PaymentAmountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  userEmail: string;
}

export const PaymentAmountDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  userEmail 
}: PaymentAmountDialogProps) => {
  const [amount, setAmount] = useState('9.99');

  const handleConfirm = () => {
    const numericAmount = parseFloat(amount);
    if (numericAmount > 0) {
      onConfirm(numericAmount);
      onClose();
      setAmount('9.99'); // Сбрасываем значение
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Назначить Premium подписку</DialogTitle>
          <DialogDescription>
            Пользователь: {userEmail}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-2">
              Сумма оплаты ($)
            </label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Введите сумму оплаты"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={handleConfirm}>
            Подтвердить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
