/**
 * Scroll Lock Helpers
 * Utilities to prevent body scroll and compensate for scrollbar width
 */

/**
 * Calcula el ancho actual de la barra de desplazamiento
 */
export const getScrollbarWidth = (): number => {
  // Crear un elemento temporal para medir el scrollbar
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  outer.style.width = '100px';
  document.body.appendChild(outer);

  const inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  outer.parentNode?.removeChild(outer);

  return scrollbarWidth;
};

/**
 * Bloquea el scroll del body y compensa el espacio del scrollbar
 */
export const lockBodyScroll = (): void => {
  const scrollbarWidth = getScrollbarWidth();
  
  // Solo aplicar si hay scrollbar visible
  if (scrollbarWidth > 0) {
    // Guardar posición actual del scroll
    const scrollY = window.scrollY;
    
    // Aplicar estilos al body
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    
    // Aplicar compensación al header
    const header = document.querySelector('header');
    if (header instanceof HTMLElement) {
      header.style.paddingRight = `${scrollbarWidth}px`;
    }
    
    // Mantener posición de scroll
    document.body.style.top = `-${scrollY}px`;
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  }
};

/**
 * Desbloquea el scroll del body y remueve compensación
 */
export const unlockBodyScroll = (): void => {
  const scrollY = document.body.style.top;
  
  // Remover estilos del body
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
  document.body.style.top = '';
  document.body.style.position = '';
  document.body.style.width = '';
  
  // Remover compensación del header
  const header = document.querySelector('header');
  if (header instanceof HTMLElement) {
    header.style.paddingRight = '';
  }
  
  // Restaurar posición de scroll
  if (scrollY) {
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  }
};
