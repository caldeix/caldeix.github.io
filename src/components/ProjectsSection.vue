<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { LINKS_URL, projects } from '@/data/projects'
import { filledCard, primaryButton, sectionTitle } from '@/ds'
import IconExternal from './icons/IconExternal.vue'
import IconGithub from './icons/IconGithub.vue'

const { t, tm, rt } = useI18n()

function highlights(id: string): string[] {
  return (tm(`projects.items.${id}.highlights`) as string[]).map((text) => rt(text))
}

const linkClass =
  'inline-flex items-center gap-1.5 rounded-sm font-text text-sm font-bold text-blue-600 no-underline transition hover:text-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-blue-400'
</script>

<template>
  <section id="proyectos" class="py-16" aria-labelledby="proyectos-titulo">
    <div class="container mx-auto flex flex-col gap-10 px-4">
      <h2 id="proyectos-titulo" :class="sectionTitle">{{ t('projects.title') }}</h2>

      <ul class="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3">
        <!-- Tres proyectos -->
        <li
          v-for="project in projects"
          :key="project.id"
          class="flex flex-col overflow-hidden rounded-lg bg-gray-100 shadow-sm dark:bg-gray-800"
        >
          <a
            :href="project.web"
            target="_blank"
            rel="noopener noreferrer"
            class="group block overflow-hidden focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-600"
            tabindex="-1"
            aria-hidden="true"
          >
            <img
              :src="project.image"
              :alt="t('projects.screenshot', { name: project.name })"
              width="960"
              height="600"
              loading="lazy"
              decoding="async"
              class="aspect-[8/5] w-full object-cover object-top transition duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </a>

          <div class="flex flex-1 flex-col gap-4 p-6">
            <div class="flex flex-col gap-1">
              <h3 class="m-0 font-text text-xl font-bold text-gray-800 dark:text-white">
                {{ project.name }}
              </h3>
              <!-- Altura mínima de 2 líneas: así los puntos de las tres tarjetas empiezan a la misma altura -->
              <p
                class="m-0 font-text text-sm font-medium text-blue-600 md:min-h-[2lh] dark:text-blue-400"
              >
                {{ t(`projects.items.${project.id}.tagline`) }}
              </p>
            </div>

            <ul
              class="m-0 flex list-disc flex-col gap-1.5 pl-5 font-text text-sm leading-relaxed text-gray-800 marker:text-blue-500 dark:text-white"
            >
              <li v-for="text in highlights(project.id)" :key="text">{{ text }}</li>
            </ul>

            <!-- Las tecnologías van al pie (mt-auto), justo encima de los enlaces, y reservan
                 el alto de dos filas de etiquetas,
                 para que queden a la misma altura en las tres tarjetas -->
            <ul
              class="m-0 mt-auto flex list-none flex-wrap content-start gap-2 p-0 md:min-h-16"
              :aria-label="t('projects.technologies')"
            >
              <li
                v-for="item in project.tech"
                :key="item.name"
                class="inline-flex h-7 items-center gap-1.5 rounded-full bg-white pr-3 pl-1.5 font-text text-xs font-medium text-gray-800 ring-1 ring-gray-200 dark:ring-0"
              >
                <img :src="item.logo" alt="" width="16" height="16" class="size-4 object-contain" />
                {{ item.name }}
              </li>
            </ul>

            <div class="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
              <a :href="project.web" target="_blank" rel="noopener noreferrer" :class="linkClass">
                {{ t('projects.web') }}
                <IconExternal />
                <span class="sr-only">({{ t('projects.newTab') }})</span>
              </a>
              <a :href="project.repo" target="_blank" rel="noopener noreferrer" :class="linkClass">
                <IconGithub class="size-4" />
                {{ t('projects.code') }}
                <span class="sr-only">({{ t('projects.newTab') }})</span>
              </a>
            </div>
          </div>
        </li>

        <!-- Cuarta tarjeta, en horizontal debajo de las tres: enlace a la página de links -->
        <li
          class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between md:col-span-2 lg:col-span-3"
          :class="filledCard"
        >
          <div class="flex flex-col gap-1">
            <h3 class="m-0 font-title text-3xl leading-tight font-semibold">
              <span class="bg-radial-blue bg-clip-text text-transparent">
                {{ t('projects.more.title') }}
              </span>
            </h3>
            <p class="m-0 font-text text-base text-gray-800 dark:text-white">
              {{ t('projects.more.text') }}
            </p>
          </div>
          <a
            :href="LINKS_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="shrink-0"
            :class="primaryButton"
          >
            {{ t('projects.more.button') }}
            <IconExternal />
            <span class="sr-only">({{ t('projects.newTab') }})</span>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>
