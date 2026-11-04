<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { skills, type Skill } from '@/data/skills'
import { filledCard, iconButton, sectionTitle } from '@/ds'
import IconChevronLeft from './icons/IconChevronLeft.vue'
import IconChevronRight from './icons/IconChevronRight.vue'
import IconPause from './icons/IconPause.vue'
import IconPlay from './icons/IconPlay.vue'

const { t } = useI18n()

// Anillo: cada skill ocupa un hueco de STEP grados. Gira solo cada 3 s y pasa 4 skills;
// también se arrastra con el ratón o el dedo, con las flechas del teclado o con los botones.
const STEP = 360 / skills.length
const PAGE = 4
const INTERVAL = 3000

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const wide = window.matchMedia('(min-width: 40rem)')
const isWide = ref(wide.matches)
const onWideChange = () => (isWide.value = wide.matches)

// Ancho de cada tarjeta y radios de la elipse: dos tarjetas seguidas de delante
// quedan separadas por GAP píxeles; el fondo del anillo se aleja hacia atrás.
const GAP = 16
const cardWidth = computed(() => (isWide.value ? 144 : 112))
const radiusX = computed(() => (cardWidth.value + GAP) / Math.sin((STEP * Math.PI) / 180))
const radiusZ = computed(() => radiusX.value * 0.6)

/** Giro del anillo en grados: la skill i está en i·STEP + rotation (0 = delante) */
const rotation = ref(0)
let target = 0

function skillName(skill: Skill): string {
  return skill.name ?? t(`skills.names.${skill.id}`)
}

function itemStyle(index: number) {
  // Ángulo de la skill entre -180 y 180 grados
  const angle = ((((index * STEP + rotation.value) % 360) + 540) % 360) - 180
  const rad = (angle * Math.PI) / 180
  const cos = Math.cos(rad)
  const depth = (cos + 1) / 2 // 1 delante, 0 al fondo
  const x = radiusX.value * Math.sin(rad)
  const y = (cos - 1) * 56 // el fondo del anillo, más arriba: se ve como un anillo inclinado
  const z = radiusZ.value * (cos - 1)
  return {
    width: `${cardWidth.value}px`,
    marginLeft: `${-cardWidth.value / 2}px`,
    transform: `translate3d(${x}px, ${y}px, ${z}px)`,
    opacity: 0.12 + 0.88 * depth ** 3,
    zIndex: Math.round(depth * 100),
  }
}

// ---------- Animación ----------

let frame = 0

function animateTo(value: number, duration = 700) {
  target = value
  cancelAnimationFrame(frame)
  if (reducedMotion.matches) {
    rotation.value = value
    return
  }
  const from = rotation.value
  const start = performance.now()
  const tick = (now: number) => {
    const progress = Math.min(1, (now - start) / duration)
    const eased = 1 - (1 - progress) ** 3
    rotation.value = from + (value - from) * eased
    if (progress < 1) frame = requestAnimationFrame(tick)
  }
  frame = requestAnimationFrame(tick)
}

const snap = (value: number) => Math.round(value / STEP) * STEP

/** Avanza n skills (positivo: las siguientes, negativo: las anteriores) */
function move(count: number) {
  animateTo(snap(target) - count * STEP)
}

// ---------- Giro automático ----------

const paused = ref(reducedMotion.matches)
const hovering = ref(false)
const dragging = ref(false)
const playing = computed(() => !paused.value && !hovering.value && !dragging.value)
let timer: ReturnType<typeof setInterval> | undefined

function schedule() {
  clearInterval(timer)
  if (playing.value) {
    timer = setInterval(() => {
      if (!document.hidden) move(PAGE)
    }, INTERVAL)
  }
}

watch(playing, schedule)

function onPointerEnter(event: PointerEvent) {
  if (event.pointerType === 'mouse') hovering.value = true
}

function onPointerLeave(event: PointerEvent) {
  if (event.pointerType === 'mouse') hovering.value = false
}

// ---------- Arrastre ----------

const stage = ref<HTMLElement | null>(null)
let startX = 0
let startRotation = 0
let lastX = 0
let lastTime = 0
let velocity = 0 // grados por milisegundo

function onPointerDown(event: PointerEvent) {
  if (event.button !== 0) return
  cancelAnimationFrame(frame)
  dragging.value = true
  startX = lastX = event.clientX
  startRotation = rotation.value
  lastTime = event.timeStamp
  velocity = 0
  stage.value?.setPointerCapture(event.pointerId)
}

function onPointerMove(event: PointerEvent) {
  if (!dragging.value) return
  // La tarjeta de delante sigue al puntero
  const degreesPerPixel = STEP / (cardWidth.value + GAP)
  rotation.value = startRotation + (event.clientX - startX) * degreesPerPixel
  const elapsed = event.timeStamp - lastTime
  if (elapsed > 0) velocity = ((event.clientX - lastX) * degreesPerPixel) / elapsed
  lastX = event.clientX
  lastTime = event.timeStamp
}

function onPointerUp() {
  if (!dragging.value) return
  dragging.value = false
  // Un pequeño impulso según la velocidad al soltar y se encaja en la skill más cercana
  animateTo(snap(rotation.value + velocity * 200), 500)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft') move(-1)
  else if (event.key === 'ArrowRight') move(1)
  else return
  event.preventDefault()
}

onMounted(() => {
  wide.addEventListener('change', onWideChange)
  schedule()
})

onBeforeUnmount(() => {
  wide.removeEventListener('change', onWideChange)
  clearInterval(timer)
  cancelAnimationFrame(frame)
})
</script>

<template>
  <section id="skills" class="overflow-hidden py-16" aria-labelledby="skills-titulo">
    <div class="container mx-auto px-4">
      <h2 id="skills-titulo" :class="sectionTitle">{{ t('skills.title') }}</h2>
    </div>

    <div
      class="mt-8"
      aria-roledescription="carrusel"
      :aria-label="t('skills.ring')"
      @pointerenter="onPointerEnter"
      @pointerleave="onPointerLeave"
    >
      <!-- Escenario del anillo: los laterales se difuminan -->
      <ul
        ref="stage"
        class="ring-stage relative m-0 h-80 list-none p-0 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:h-96"
        :class="dragging ? 'cursor-grabbing' : 'cursor-grab'"
        tabindex="0"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @keydown="onKeydown"
      >
        <li
          v-for="(skill, index) in skills"
          :key="skill.id"
          class="absolute top-36 left-1/2 flex flex-col items-center gap-2 text-center shadow-sm will-change-transform sm:top-44"
          :class="filledCard"
          :style="itemStyle(index)"
        >
          <!-- Recuadro blanco en los dos modos para que se vean los logos oscuros -->
          <div
            class="flex h-14 min-w-14 items-center justify-center gap-1.5 rounded-xl bg-white px-2.5 ring-1 ring-gray-200 dark:ring-0"
          >
            <img
              v-for="src in skill.logos"
              :key="src"
              :src="src"
              alt=""
              draggable="false"
              :width="skill.logos.length > 1 ? 28 : 36"
              :height="skill.logos.length > 1 ? 28 : 36"
              decoding="async"
              class="pointer-events-none object-contain"
              :class="skill.logos.length > 1 ? 'size-7' : 'size-9'"
            />
          </div>
          <span class="font-text text-sm leading-tight font-medium text-gray-800 dark:text-white">
            {{ skillName(skill) }}
          </span>
          <span
            class="inline-flex min-h-6 items-center rounded-full bg-blue-50 px-3 py-0.5 font-text text-xs leading-tight font-bold text-blue-600 dark:bg-blue-950 dark:text-blue-400"
          >
            {{ t(`skills.tags.${skill.tag}`) }}
          </span>
        </li>
      </ul>

      <div class="mt-6 flex items-center justify-center gap-2">
        <button
          type="button"
          :class="iconButton"
          :aria-label="t('skills.previous')"
          @click="move(-PAGE)"
        >
          <IconChevronLeft />
        </button>
        <button
          type="button"
          :class="iconButton"
          :aria-label="paused ? t('skills.play') : t('skills.pause')"
          @click="paused = !paused"
        >
          <IconPlay v-if="paused" />
          <IconPause v-else />
        </button>
        <button type="button" :class="iconButton" :aria-label="t('skills.next')" @click="move(PAGE)">
          <IconChevronRight />
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ring-stage {
  perspective: 1200px;
  perspective-origin: 50% 30%;
  /* Se puede seguir haciendo scroll vertical con el dedo encima del anillo */
  touch-action: pan-y;
  -webkit-mask-image: linear-gradient(to right, transparent, #000 12%, #000 88%, transparent);
  mask-image: linear-gradient(to right, transparent, #000 12%, #000 88%, transparent);
}
</style>
