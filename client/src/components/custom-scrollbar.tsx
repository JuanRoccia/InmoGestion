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

      // Forzar actualización después de inicializar
      setTimeout(() => {
        if (osInstance) {
          osInstance.update(true);
        }
      }, 100);

      return () => {
        if (osInstance) {
          osInstance.destroy();
        }
      };
    }, 100);

    return () => clearTimeout(timer);
  }, []);
}