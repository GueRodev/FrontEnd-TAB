/**
 * useScrollLock Hook
 * Custom hook to lock/unlock body scroll with header compensation
 */

import { useEffect } from 'react';
import { lockBodyScroll, unlockBodyScroll } from '@/lib/helpers/scroll-lock.helpers';

/**
 * Hook para bloquear/desbloquear scroll cuando un componente se monta
 * Compensa automáticamente el espacio del scrollbar en el header
 * 
 * @param isLocked - Estado que controla si el scroll debe estar bloqueado
 */
export const useScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (isLocked) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }

    // Cleanup: asegurar que se desbloquee al desmontar
    return () => {
      unlockBodyScroll();
    };
  }, [isLocked]);
};
