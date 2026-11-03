<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from '@/composables/useTheme'
import { gradientText, iconButton, navLink } from '@/ds'
import IconClose from './icons/IconClose.vue'
import IconMenu from './icons/IconMenu.vue'
import IconMoon from './icons/IconMoon.vue'
import IconSun from './icons/IconSun.vue'

const { t } = useI18n()

// Las secciones todavía no existen: los enlaces solo cambian el hash
const links = [
  { key: 'skills', href: '#skills' },
  { key: 'experience', href: '#experiencia' },
  { key: 'education', href: '#educacion' },
  { key: 'hobbies', href: '#hobbies' },
  { key: 'projects', href: '#proyectos' },
] as const

const { isDark, toggle } = useTheme()
const menuOpen = ref(false)

function closeMenu() {
  menuOpen.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closeMenu()
}

// Al pasar a pantalla grande el menú desplegable deja de tener sentido
const desktop = window.matchMedia('(min-width: 64rem)')

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  desktop.addEventListener('change', closeMenu)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  desktop.removeEventListener('change', closeMenu)
})
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
  >
    <div class="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
      <a
        href="#sobre-mi"
        class="font-title text-3xl leading-tight font-semibold no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        :class="gradientText"
        @click="closeMenu"
      >
        {{ t('header.brand') }}
      </a>

      <nav class="hidden items-center gap-8 lg:flex" :aria-label="t('header.nav')">
        <a v-for="link in links" :key="link.href" :href="link.href" :class="navLink">
          {{ t(`header.links.${link.key}`) }}
        </a>
      </nav>

      <div class="flex items-center gap-1">
        <button
          type="button"
          :class="iconButton"
          :aria-pressed="isDark"
          :aria-label="t('header.themeToggle')"
          @click="toggle"
        >
          <IconMoon class="block dark:hidden" />
          <IconSun class="hidden dark:block" />
        </button>

        <button
          type="button"
          class="lg:hidden"
          :class="iconButton"
          :aria-expanded="menuOpen"
          aria-controls="menu-movil"
          :aria-label="menuOpen ? t('header.closeMenu') : t('header.openMenu')"
          @click="menuOpen = !menuOpen"
        >
          <IconClose v-if="menuOpen" />
          <IconMenu v-else />
        </button>
      </div>
    </div>

    <nav
      v-show="menuOpen"
      id="menu-movil"
      class="border-t border-gray-200 lg:hidden dark:border-gray-700"
      :aria-label="t('header.nav')"
    >
      <ul class="container mx-auto flex flex-col px-4 py-2">
        <li v-for="link in links" :key="link.href">
          <a :href="link.href" class="block py-3" :class="navLink" @click="closeMenu">
            {{ t(`header.links.${link.key}`) }}
          </a>
        </li>
      </ul>
    </nav>
  </header>
</template>
