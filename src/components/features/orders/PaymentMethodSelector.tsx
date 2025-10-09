/**
 * PaymentMethodSelector Component
 * Reusable component for selecting payment methods
 */

import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Banknote, Building2, Smartphone } from 'lucide-react';
import { PAYMENT_METHODS } from '@/data/constants';

interface PaymentMethodSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const paymentIcons: Record<string, React.ReactNode> = {
  cash: <Banknote className="h-5 w-5" />,
  card: <CreditCard className="h-5 w-5" />,
  transfer: <Building2 className="h-5 w-5" />,
  sinpe: <Smartphone className="h-5 w-5" />,
};

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="space-y-3">
      <Label>Método de Pago</Label>
      <RadioGroup value={value} onValueChange={onChange}>
        {PAYMENT_METHODS.map((method) => (
          <div
            key={method.value}
            className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent transition-colors"
          >
            <RadioGroupItem value={method.value} id={method.value} />
            <Label
              htmlFor={method.value}
              className="flex items-center space-x-3 cursor-pointer flex-1"
            >
              <div className="text-primary">{paymentIcons[method.value]}</div>
              <span className="font-medium">{method.label}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
