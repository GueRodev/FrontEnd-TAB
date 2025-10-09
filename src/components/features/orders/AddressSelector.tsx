/**
 * AddressSelector Component
 * Reusable component for selecting or entering delivery addresses
 */

import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { DeliveryAddress } from '@/types/order.types';

interface AddressSelectorProps {
  savedAddresses: DeliveryAddress[];
  selectedAddressId?: string;
  onSelectAddress: (addressId: string) => void;
  manualAddress: {
    province: string;
    canton: string;
    district: string;
    address: string;
  };
  onManualAddressChange: (field: string, value: string) => void;
  showManualInput: boolean;
}

export const AddressSelector: React.FC<AddressSelectorProps> = ({
  savedAddresses,
  selectedAddressId,
  onSelectAddress,
  manualAddress,
  onManualAddressChange,
  showManualInput,
}) => {
  return (
    <div className="space-y-4">
      <Label>Dirección de Entrega</Label>
      
      {savedAddresses.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm text-muted-foreground">Direcciones guardadas:</Label>
          <RadioGroup value={selectedAddressId} onValueChange={onSelectAddress}>
            {savedAddresses.map((addr, index) => (
              <div key={index} className="flex items-start space-x-2 border rounded-lg p-3">
                <RadioGroupItem value={`saved-${index}`} id={`saved-${index}`} />
                <Label
                  htmlFor={`saved-${index}`}
                  className="flex-1 cursor-pointer space-y-1"
                >
                  <div className="font-semibold">{addr.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {addr.province}, {addr.canton}, {addr.district}
                  </div>
                  <div className="text-sm">{addr.address}</div>
                </Label>
              </div>
            ))}
          </RadioGroup>
          
          <div className="flex items-center space-x-2 pt-2">
            <input
              type="radio"
              id="manual-address"
              checked={showManualInput}
              onChange={() => onSelectAddress('manual')}
              className="cursor-pointer"
            />
            <Label htmlFor="manual-address" className="cursor-pointer">
              Ingresar dirección manualmente
            </Label>
          </div>
        </div>
      )}

      {(showManualInput || savedAddresses.length === 0) && (
        <div className="space-y-4">
          {savedAddresses.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No tienes direcciones guardadas. Ingresa tu dirección de entrega:
            </p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="province">Provincia</Label>
              <Input
                id="province"
                value={manualAddress.province}
                onChange={(e) => onManualAddressChange('province', e.target.value)}
                placeholder="San José"
                required
              />
            </div>
            <div>
              <Label htmlFor="canton">Cantón</Label>
              <Input
                id="canton"
                value={manualAddress.canton}
                onChange={(e) => onManualAddressChange('canton', e.target.value)}
                placeholder="Escazú"
                required
              />
            </div>
            <div>
              <Label htmlFor="district">Distrito</Label>
              <Input
                id="district"
                value={manualAddress.district}
                onChange={(e) => onManualAddressChange('district', e.target.value)}
                placeholder="San Rafael"
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="address">Dirección Exacta</Label>
            <Textarea
              id="address"
              value={manualAddress.address}
              onChange={(e) => onManualAddressChange('address', e.target.value)}
              placeholder="Detalles de la dirección..."
              rows={3}
              required
            />
          </div>
        </div>
      )}
    </div>
  );
};
