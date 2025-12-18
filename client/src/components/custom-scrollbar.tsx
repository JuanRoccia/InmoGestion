import { useEffect } from 'react';
import { OverlayScrollbars } from 'overlayscrollbars';
import 'overlayscrollbars/overlayscrollbars.css';

export function useCustomScrollbar() {
  useEffect(() => {
    // Forzar que el body tenga altura para hacer scroll
    document.body.style.minHeight = '101vh';

    // Esperar a que el DOM esté listo
    const timer = setTimeout(() => {
      const osInstance = OverlayScrollbars(document.body, {
        paddingAbsolute: false,
        showNativeOverlaidScrollbars: false,
        update: {
          elementEvents: [['img', 'load']],
          debounce: [0, 33],
          attributes: null,
          ignoreMutation: null,
        },
        overflow: {
          x: 'hidden',
          y: 'scroll',
        },
        scrollbars: {
          theme: 'os-theme-custom',
          visibility: 'visible',
          autoHide: 'never',
          autoHideDelay: 0,
          autoHideSuspend: false,
          dragScroll: true,
          clickScroll: true,
          pointers: ['mouse', 'touch', 'pen'],
        },
      });

      console.log('OverlayScrollbars initialized:', osInstance);

      // SOLUCIÓN: Inyectar las flechas directamente en el handle usando JavaScript
      const injectArrows = () => {
        const handle = document.querySelector('.os-scrollbar-handle');
        if (handle && !handle.querySelector('.arrow-up')) {
          // Flecha hacia arriba - MÁXIMO TAMAÑO
          const arrowUp = document.createElement('div');
          arrowUp.className = 'arrow-up';
          arrowUp.textContent = '▲';
          arrowUp.style.cssText = `
            position: absolute !important;
            top: 2px !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            height: 16px !important;
            text-align: center !important;
            color: #ffffff !important;
            font-size: 13px !important;
            line-height: 16px !important;
            font-weight: 900 !important;
            text-shadow: 0 0 5px rgba(0, 0, 0, 1), 0 1px 3px rgba(0, 0, 0, 1) !important;
            z-index: 99999 !important;
            pointer-events: none !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            font-family: Arial, sans-serif !important;
          `;

          // Flecha hacia abajo - MÁXIMO TAMAÑO
          const arrowDown = document.createElement('div');
          arrowDown.className = 'arrow-down';
          arrowDown.textContent = '▼';
          arrowDown.style.cssText = `
            position: absolute !important;
            bottom: 2px !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            height: 16px !important;
            text-align: center !important;
            color: #ffffff !important;
            font-size: 13px !important;
            line-height: 16px !important;
            font-weight: 900 !important;
            text-shadow: 0 0 5px rgba(0, 0, 0, 1), 0 1px 3px rgba(0, 0, 0, 1) !important;
            z-index: 99999 !important;
            pointer-events: none !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            font-family: Arial, sans-serif !important;
          `;

          handle.appendChild(arrowUp);
          handle.appendChild(arrowDown);

          console.log('Arrows injected successfully!');
        }
      };

      // Intentar inyectar las flechas varias veces por si el DOM no está listo
      setTimeout(injectArrows, 100);
      setTimeout(injectArrows, 300);
      setTimeout(injectArrows, 500);
      setTimeout(injectArrows, 1000);

      // También observar cambios en el DOM por si el scrollbar se re-renderiza
      const observer = new MutationObserver(() => {
        injectArrows();
      });

      const scrollbarContainer = document.querySelector('.os-scrollbar-vertical');
      if (scrollbarContainer) {
        observer.observe(scrollbarContainer, {
          childList: true,
          subtree: true
        });
      }

      return () => {
        observer.disconnect();
        if (osInstance) {
          osInstance.destroy();
        }
      };
    }, 100);

    return () => clearTimeout(timer);
  }, []);
}