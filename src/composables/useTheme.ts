import { readonly, ref } from 'vue'

type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'theme'

// Oscuro por defecto: solo es claro si <html> tiene la clase "light"
function readIsDark(): boolean {
  return !document.documentElement.classList.contains('light')
}

// Estado compartido por todos los componentes que usen el tema
const isDark = ref(readIsDark())

/**
 * Modo claro / oscuro con el DS Personal: pone "dark" o "light" en <html> y lo
 * recuerda en el navegador. Sin elección guardada, la web va en oscuro.
 */
export function useTheme() {
  function setMode(mode: ThemeMode) {
    const classes = document.documentElement.classList
    classes.remove('light', 'dark')
    classes.add(mode)
    try {
      localStorage.setItem(STORAGE_KEY, mode)
    } catch {
      // Sin almacenamiento (modo privado): el cambio dura hasta recargar
    }
    isDark.value = mode === 'dark'
  }

  function toggle() {
    setMode(isDark.value ? 'light' : 'dark')
  }

  return { isDark: readonly(isDark), toggle }
}
