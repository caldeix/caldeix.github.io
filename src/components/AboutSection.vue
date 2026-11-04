<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import retratoClaroUrl from '@/assets/retrato-claro.webp'
import retratoOscuroUrl from '@/assets/retrato-oscuro.webp'
import { gradientText, iconButton, primaryButton } from '@/ds'
import TypingRotator from './TypingRotator.vue'
import IconDownload from './icons/IconDownload.vue'
import IconGithub from './icons/IconGithub.vue'
import IconLinkedin from './icons/IconLinkedin.vue'
import IconMail from './icons/IconMail.vue'
import IconPhone from './icons/IconPhone.vue'

const { t, tm, rt } = useI18n()

const phrases = computed(() => (tm('about.phrases') as string[]).map((phrase) => rt(phrase)))

// Años trabajando como desarrollador: se calcula solo, desde 2019 (2026 → +7, 2027 → +8)
const yearsWorking = new Date().getFullYear() - 2019

const PHONE = '+34682704197'
const EMAIL = 'caldeiro.tech@pm.me'

// El PDF se deja en public/assets/cv.pdf y se sirve tal cual en /assets/cv.pdf
const cvUrl = `${import.meta.env.BASE_URL}assets/cv.pdf`

// En móvil y tablet el teléfono abre la app de llamadas; con ratón se copia
const touch = window.matchMedia('(hover: none) and (pointer: coarse)')
const phoneLabel = computed(() =>
  touch.matches ? t('about.contact.call') : t('about.contact.copyPhone'),
)

const status = ref('')
let statusTimer: ReturnType<typeof setTimeout> | undefined

function showStatus(message: string) {
  status.value = message
  clearTimeout(statusTimer)
  statusTimer = setTimeout(() => (status.value = ''), 2500)
}

async function onPhoneClick(event: MouseEvent) {
  if (touch.matches) return
  event.preventDefault()
  try {
    await navigator.clipboard.writeText(PHONE)
    showStatus(t('about.contact.phoneCopied'))
  } catch {
    showStatus(t('about.contact.phoneCopyFailed'))
  }
}

onBeforeUnmount(() => clearTimeout(statusTimer))
</script>

<template>
  <section
    id="sobre-mi"
    class="flex items-start pt-8 pb-12 sm:min-h-[calc(100svh-4rem)] sm:items-center sm:py-16"
  >
    <div
      class="relative container mx-auto grid items-center gap-8 px-4 lg:grid-cols-2 lg:gap-12"
    >
      <!-- Retrato a lápiz recortado por la silueta, sin fondo, en un óvalo.
           Cada imagen es solo una máscara y el color lo pone el modo: en claro el trazo
           en oscuro; en oscuro, en positivo en blanco (como tiza sobre pizarra).
           En PC va a la derecha; en móvil y tablet, centrado y muy tenue detrás del texto. -->
      <div
        role="img"
        :aria-label="t('about.portrait')"
        class="pointer-events-none absolute top-1/2 left-1/2 aspect-[4/5] w-72 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[50%] opacity-[0.08] sm:w-96 dark:max-lg:opacity-10 lg:pointer-events-auto lg:static lg:order-last lg:w-full lg:max-w-sm lg:translate-none lg:justify-self-end lg:opacity-100 xl:max-w-md"
      >
        <div
          class="retrato size-full bg-gray-900 dark:hidden"
          :style="{ '--retrato': `url(${retratoClaroUrl})` }"
        />
        <div
          class="retrato hidden size-full bg-white dark:block"
          :style="{ '--retrato': `url(${retratoOscuroUrl})` }"
        />
      </div>

      <div class="relative flex max-w-3xl flex-col gap-6">
        <h1
          class="m-0 text-center font-title text-5xl leading-tight font-semibold text-balance text-gray-800 sm:text-left lg:text-6xl dark:text-white"
        >
          {{ t('about.greeting') }} <span :class="gradientText">{{ t('about.name') }}</span>
        </h1>

        <TypingRotator
          :phrases="phrases"
          class="font-text text-xl font-medium text-gray-800 sm:text-2xl dark:text-white"
        />

        <div
          class="flex flex-col gap-4 font-text text-base leading-relaxed text-justify hyphens-auto sm:text-left sm:text-lg sm:hyphens-manual"
        >
          <p class="m-0">{{ t('about.description', { years: yearsWorking }) }}</p>
          <p class="m-0">
            <strong class="font-bold">{{ t('about.objective.label') }}</strong>
            {{ t('about.objective.text') }}
          </p>
        </div>

        <!-- En móvil: iconos repartidos en toda la línea y el botón centrado debajo -->
        <div class="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <ul
            class="m-0 flex w-full list-none items-center justify-between p-0 sm:w-auto sm:justify-start sm:gap-2"
            :aria-label="t('about.contact.list')"
          >
            <li>
              <a
                href="https://github.com/caldeix"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="t('about.contact.github')"
                :class="iconButton"
              >
                <IconGithub />
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/caldeiro-luism/"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="t('about.contact.linkedin')"
                :class="iconButton"
              >
                <IconLinkedin />
              </a>
            </li>
            <li>
              <a
                :href="`mailto:${EMAIL}`"
                :aria-label="t('about.contact.email')"
                :class="iconButton"
              >
                <IconMail />
              </a>
            </li>
            <li>
              <a
                :href="`tel:${PHONE}`"
                :aria-label="phoneLabel"
                :class="iconButton"
                @click="onPhoneClick"
              >
                <IconPhone />
              </a>
            </li>
          </ul>

          <a :href="cvUrl" :download="t('about.cv.fileName')" :class="primaryButton">
            <IconDownload />
            {{ t('about.cv.button') }}
          </a>
        </div>

        <p
          class="m-0 min-h-5 font-text text-sm font-medium text-emerald-700 dark:text-emerald-500"
          role="status"
        >
          {{ status }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.retrato {
  -webkit-mask: var(--retrato) center / cover no-repeat;
  mask: var(--retrato) center / cover no-repeat;
}
</style>
