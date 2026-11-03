<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

// Velocidades del texto animado del DS: 60 ms por letra al escribir
const props = withDefaults(
  defineProps<{
    phrases: string[]
    typeSpeed?: number
    deleteSpeed?: number
    pause?: number
  }>(),
  { typeSpeed: 60, deleteSpeed: 30, pause: 2000 },
)

const index = ref(0)
const shown = ref('')
const writing = ref(false)

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
let active = true
let timer: ReturnType<typeof setTimeout> | undefined

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    timer = setTimeout(resolve, ms)
  })
}

// Escribe la frase letra a letra, espera, la borra y pasa a la siguiente.
// Con «reducir movimiento» las frases cambian enteras, sin animación.
async function run() {
  while (active) {
    const letters = Array.from(props.phrases[index.value] ?? '')

    if (reducedMotion.matches) {
      shown.value = letters.join('')
      await wait(props.pause * 2)
    } else {
      writing.value = true
      for (let i = 1; i <= letters.length && active; i++) {
        shown.value = letters.slice(0, i).join('')
        await wait(props.typeSpeed)
      }
      writing.value = false
      await wait(props.pause)

      writing.value = true
      for (let i = letters.length - 1; i >= 0 && active; i--) {
        shown.value = letters.slice(0, i).join('')
        await wait(props.deleteSpeed)
      }
      writing.value = false
      await wait(props.typeSpeed * 6)
    }

    index.value = (index.value + 1) % props.phrases.length
  }
}

onMounted(run)

onBeforeUnmount(() => {
  active = false
  clearTimeout(timer)
})
</script>

<template>
  <p class="m-0 min-h-[2lh] sm:min-h-[1lh]">
    <!-- Los lectores de pantalla leen la frase entera, no letra a letra -->
    <span class="sr-only">{{ phrases[index] }}</span>
    <span aria-hidden="true">
      {{ shown
      }}<span
        class="ml-0.5 inline-block h-[1.1em] w-0.5 translate-y-[0.15em] bg-blue-600 motion-reduce:hidden"
        :class="{ 'animate-caret-blink': !writing }"
      />
    </span>
  </p>
</template>
