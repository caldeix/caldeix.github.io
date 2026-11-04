<script setup lang="ts">
import type { Component } from 'vue'
import { useI18n } from 'vue-i18n'
import { filledCard, sectionTitle } from '@/ds'
import IconCode from './icons/IconCode.vue'
import IconFootball from './icons/IconFootball.vue'
import IconPaddleSurf from './icons/IconPaddleSurf.vue'

const { t, tm, rt } = useI18n()

// Los textos de cada hobby salen de src/locales/*.json → hobbies.items.<id>
const hobbies: { id: 'paddleSurf' | 'football' | 'coding'; icon: Component }[] = [
  { id: 'paddleSurf', icon: IconPaddleSurf },
  { id: 'football', icon: IconFootball },
  { id: 'coding', icon: IconCode },
]

function paragraphs(id: string): string[] {
  return (tm(`hobbies.items.${id}.text`) as string[]).map((text) => rt(text))
}
</script>

<template>
  <section id="hobbies" class="py-16" aria-labelledby="hobbies-titulo">
    <div class="container mx-auto flex flex-col gap-10 px-4">
      <h2 id="hobbies-titulo" :class="sectionTitle">{{ t('hobbies.title') }}</h2>

      <ul class="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-3">
        <li
          v-for="hobby in hobbies"
          :key="hobby.id"
          class="flex flex-col gap-4 shadow-sm"
          :class="filledCard"
        >
          <div class="flex items-center gap-4">
            <!-- Icono propio sobre el degradado azul del DS -->
            <span
              class="inline-flex size-14 shrink-0 items-center justify-center rounded-xl bg-radial-blue text-white shadow-sm"
            >
              <component :is="hobby.icon" />
            </span>
            <div class="flex flex-col gap-1">
              <h3 class="m-0 font-text text-lg font-bold text-gray-800 dark:text-white">
                {{ t(`hobbies.items.${hobby.id}.title`) }}
              </h3>
              <span
                class="inline-flex min-h-6 w-fit items-center rounded-full bg-blue-50 px-3 py-0.5 font-text text-xs leading-tight font-bold text-blue-600 dark:bg-blue-950 dark:text-blue-400"
              >
                {{ t(`hobbies.items.${hobby.id}.badge`) }}
              </span>
            </div>
          </div>

          <p
            v-for="text in paragraphs(hobby.id)"
            :key="text"
            class="m-0 font-text text-sm leading-relaxed text-gray-800 sm:text-base dark:text-white"
          >
            {{ text }}
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>
