<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { jobs, type Job } from '@/data/experience'
import { filledCard, sectionTitle } from '@/ds'

const { t, tm, rt, locale } = useI18n()

// ---------- Fechas y duración ----------

function parseMonth(value: string): { year: number; month: number } {
  const [year = 0, month = 1] = value.split('-').map(Number)
  return { year, month }
}

function today(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function formatMonth(value: string): string {
  const { year, month } = parseMonth(value)
  return new Intl.DateTimeFormat(locale.value, {
    month: 'short',
    year: 'numeric',
  }).format(new Date(year, month - 1))
}

/** Duración contando el mes de inicio y el de fin, como LinkedIn («5 años y 1 mes») */
function duration(job: Job): string {
  const start = parseMonth(job.start)
  const end = parseMonth(job.end ?? today())
  const total = end.year * 12 + end.month - (start.year * 12 + start.month) + 1
  const years = Math.floor(total / 12)
  const months = total % 12
  const parts = [
    years ? t('experience.duration.years', years) : '',
    months ? t('experience.duration.months', months) : '',
  ].filter(Boolean)
  return parts.join(` ${t('experience.duration.and')} `)
}

function achievements(job: Job): string[] {
  return (tm(`experience.items.${job.id}.achievements`) as string[]).map((text) => rt(text))
}

// ---------- Animación al hacer scroll ----------

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const animate = !reducedMotion && 'IntersectionObserver' in window

/** Puestos que ya han aparecido */
const shown = reactive(new Set<string>())
const list = ref<HTMLElement | null>(null)
/** Parte de la línea ya «dibujada», de 0 a 1 */
const progress = ref(animate ? 0 : 1)
let observer: IntersectionObserver | undefined
let frame = 0

function updateProgress() {
  frame = 0
  const element = list.value
  if (!element) return
  const box = element.getBoundingClientRect()
  // La línea llega hasta donde está el centro de la pantalla
  const reached = window.innerHeight / 2 - box.top
  progress.value = Math.min(1, Math.max(0, reached / box.height))
}

function onScroll() {
  if (!frame) frame = requestAnimationFrame(updateProgress)
}

onMounted(() => {
  if (!animate) return
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        shown.add((entry.target as HTMLElement).dataset.job ?? '')
        observer?.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -15% 0px' },
  )
  list.value?.querySelectorAll<HTMLElement>('[data-job]').forEach((item) => observer?.observe(item))
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  updateProgress()
})

onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  cancelAnimationFrame(frame)
})

function hidden(job: Job): boolean {
  return animate && !shown.has(job.id)
}
</script>

<template>
  <section id="experiencia" class="py-16" aria-labelledby="experiencia-titulo">
    <div class="container mx-auto flex flex-col gap-10 px-4">
      <h2 id="experiencia-titulo" :class="sectionTitle">
        {{ t('experience.title') }}
      </h2>

      <div ref="list" class="relative">
        <!-- Línea: gris de fondo y azul la parte ya recorrida.
             En móvil y tablet va a la izquierda; en PC, centrada. -->
        <div
          class="absolute top-0 bottom-0 left-4 w-0.5 -translate-x-1/2 rounded-full bg-gray-200 lg:left-1/2 dark:bg-gray-700"
          aria-hidden="true"
        >
          <div
            class="w-full origin-top rounded-full bg-radial-blue"
            :style="{ height: `${progress * 100}%` }"
          />
        </div>

        <ol class="m-0 flex list-none flex-col gap-10 p-0">
          <li
            v-for="(job, index) in jobs"
            :key="job.id"
            :data-job="job.id"
            class="relative pl-12 lg:grid lg:grid-cols-2 lg:gap-x-16 lg:pl-0"
          >
            <!-- Punto sobre la línea; el del puesto actual es verde y late -->
            <span
              class="absolute top-1 left-4 flex size-4 -translate-x-1/2 lg:top-6 lg:left-1/2"
              aria-hidden="true"
            >
              <span
                v-if="!job.end"
                class="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75 motion-reduce:hidden"
              />
              <span
                class="relative inline-flex size-4 rounded-full ring-4 ring-white dark:ring-gray-900"
                :class="job.end ? 'bg-blue-500' : 'bg-emerald-500'"
              />
            </span>

            <!-- Fechas: encima de la tarjeta en móvil; al otro lado de la línea en PC -->
            <div
              class="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 transition duration-700 ease-out motion-reduce:transition-none lg:row-start-1 lg:mb-0 lg:self-start lg:pt-5"
              :class="[
                index % 2 === 0
                  ? 'lg:col-start-2 lg:justify-start'
                  : 'lg:col-start-1 lg:flex-row-reverse lg:justify-start lg:text-right',
                hidden(job) ? 'opacity-0' : 'opacity-100',
              ]"
            >
              <p class="m-0 font-text text-base font-bold text-gray-800 dark:text-white">
                <time :datetime="job.start">{{ formatMonth(job.start) }}</time>
                –
                <time v-if="job.end" :datetime="job.end">{{ formatMonth(job.end) }}</time>
                <template v-else>{{ t('experience.present') }}</template>
              </p>
              <span
                v-if="!job.end"
                class="inline-flex h-6 items-center rounded-full bg-emerald-500 px-3 font-text text-sm font-bold text-gray-900"
              >
                {{ t('experience.current') }}
              </span>
              <p class="m-0 w-full font-text text-sm text-gray-500 dark:text-gray-400">
                {{ duration(job) }}
              </p>
            </div>

            <!-- Tarjeta del puesto -->
            <article
              class="flex flex-col gap-4 shadow-sm transition duration-700 ease-out motion-reduce:transition-none lg:row-start-1"
              :class="[
                filledCard,
                index % 2 === 0 ? 'lg:col-start-1' : 'lg:col-start-2',
                hidden(job)
                  ? index % 2 === 0
                    ? 'translate-y-6 opacity-0 lg:translate-y-0 lg:-translate-x-8'
                    : 'translate-y-6 opacity-0 lg:translate-y-0 lg:translate-x-8'
                  : 'translate-0 opacity-100',
              ]"
            >
              <header class="flex flex-col gap-1">
                <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 class="m-0 font-text text-lg font-bold text-gray-800 dark:text-white">
                    {{ t(`experience.items.${job.id}.role`) }}
                  </h3>
                  <!-- Insignia del DS, en azul -->
                  <span
                    v-for="badge in job.badges"
                    :key="badge"
                    class="inline-flex h-6 items-center rounded-full bg-blue-500 px-3 font-text text-sm font-bold text-white"
                  >
                    {{ t(`experience.badges.${badge}`) }}
                  </span>
                </div>
                <p class="m-0 font-text text-base font-medium text-blue-600 dark:text-blue-400">
                  {{ t(`experience.items.${job.id}.company`) }}
                  <span class="font-normal text-gray-500 dark:text-gray-400">
                    · {{ t(`experience.items.${job.id}.type`) }}
                  </span>
                </p>
                <p
                  v-if="job.hasPlace"
                  class="m-0 font-text text-sm text-gray-500 dark:text-gray-400"
                >
                  {{ t(`experience.items.${job.id}.place`) }}
                </p>
              </header>

              <ul
                class="m-0 flex list-disc flex-col gap-1.5 pl-5 font-text text-sm leading-relaxed text-gray-800 marker:text-blue-500 sm:text-base dark:text-white"
              >
                <li v-for="text in achievements(job)" :key="text">
                  {{ text }}
                </li>
              </ul>

              <ul
                v-if="job.skills.length"
                class="m-0 flex list-none flex-wrap gap-2 p-0"
                :aria-label="t('experience.technologies')"
              >
                <li
                  v-for="skill in job.skills"
                  :key="skill.id"
                  class="inline-flex h-7 items-center gap-1.5 rounded-full bg-white pr-3 pl-1.5 font-text text-xs font-medium text-gray-800 ring-1 ring-gray-200 dark:ring-0"
                >
                  <img
                    v-for="src in skill.logos.slice(0, 1)"
                    :key="src"
                    :src="src"
                    alt=""
                    width="16"
                    height="16"
                    class="size-4 object-contain"
                  />
                  {{ skill.name ?? t(`skills.names.${skill.id}`) }}
                </li>
              </ul>
            </article>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>
