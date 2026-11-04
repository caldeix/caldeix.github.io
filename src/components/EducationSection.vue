<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { certifications, degrees, type Certification, type Degree } from '@/data/education'
import { filledCard, iconButton, sectionTitle } from '@/ds'
import IconClose from './icons/IconClose.vue'
import IconExternal from './icons/IconExternal.vue'
import IconEye from './icons/IconEye.vue'

const { t, te, locale } = useI18n()

/** «2017 – 2019»; si está en curso, el fin lleva asterisco porque es previsto */
function years(degree: Degree): string {
  return `${degree.start} – ${degree.end}${degree.inProgress ? '*' : ''}`
}

function formatMonth(value: string): string {
  const [year = 0, month = 1] = value.split('-').map(Number)
  return new Intl.DateTimeFormat(locale.value, {
    month: 'short',
    year: 'numeric',
  }).format(new Date(year, month - 1))
}

const certificationTitle = (certification: Certification) =>
  t(`education.certifications.${certification.id}.title`)

// ---------- Ventana (modal) con la copia del certificado ----------

const dialog = ref<HTMLDialogElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)
const selected = ref<Certification | null>(null)
const selectedTitle = computed(() => (selected.value ? certificationTitle(selected.value) : ''))

async function openCertificate(certification: Certification) {
  selected.value = certification
  dialog.value?.showModal()
  // El foco va a la X; al cerrar, el navegador lo devuelve al ojo que la abrió
  await nextTick()
  closeButton.value?.focus()
}

function closeCertificate() {
  dialog.value?.close()
}

/** Al pulsar fuera de la ventana (en el fondo oscuro) se cierra */
function onDialogClick(event: MouseEvent) {
  if (event.target === dialog.value) closeCertificate()
}
</script>

<template>
  <section id="educacion" class="py-16" aria-labelledby="educacion-titulo">
    <div class="container mx-auto flex flex-col gap-10 px-4">
      <h2 id="educacion-titulo" :class="sectionTitle">
        {{ t('education.title') }}
      </h2>

      <!-- Formación reglada -->
      <div class="flex flex-col gap-6">
        <h3 class="m-0 font-text text-xl font-bold text-gray-800 dark:text-white">
          {{ t('education.degreesTitle') }}
        </h3>
        <ol class="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-3">
          <li
            v-for="degree in degrees"
            :key="degree.id"
            class="flex flex-col gap-3 shadow-sm"
            :class="filledCard"
          >
            <div class="flex flex-wrap items-center gap-3">
              <p class="m-0 font-text text-base font-bold text-gray-800 dark:text-white">
                {{ years(degree) }}
              </p>
              <span
                v-if="degree.inProgress"
                class="inline-flex h-6 w-fit items-center rounded-full bg-emerald-500 px-3 font-text text-sm font-bold text-gray-900"
              >
                {{ t('education.inProgress') }}
              </span>
            </div>

            <h4 class="m-0 font-text text-lg leading-snug font-bold text-gray-800 dark:text-white">
              {{ t(`education.degrees.${degree.id}.title`) }}
              <!-- Segunda línea, para que quede alineado con las otras formaciones -->
              <span v-if="te(`education.degrees.${degree.id}.subtitle`)" class="block">
                {{ t(`education.degrees.${degree.id}.subtitle`) }}
              </span>
            </h4>
            <p class="m-0 font-text text-sm font-medium text-blue-600 dark:text-blue-400">
              {{ t(`education.degrees.${degree.id}.level`) }}
              <!-- El centro en su propia línea, para que las tres tarjetas queden alineadas -->
              <span class="block font-normal text-gray-500 dark:text-gray-400">
                {{ t(`education.degrees.${degree.id}.school`) }}
              </span>
            </p>
            <p
              class="m-0 font-text text-sm leading-relaxed text-gray-800 sm:text-base dark:text-white"
            >
              {{ t(`education.degrees.${degree.id}.description`) }}
            </p>
            <p class="m-0 mt-auto font-text text-xs text-gray-500 dark:text-gray-400">
              {{ t(`education.degrees.${degree.id}.source`) }}
              <template v-if="degree.inProgress">
                <br />
                {{ t('education.estimatedEnd') }}
              </template>
            </p>
          </li>
        </ol>
      </div>

      <!-- Certificaciones -->
      <div class="flex flex-col gap-6">
        <h3 class="m-0 font-text text-xl font-bold text-gray-800 dark:text-white">
          {{ t('education.certificationsTitle') }}
        </h3>
        <ul class="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          <li
            v-for="certification in certifications"
            :key="certification.id"
            class="flex min-w-0 flex-col gap-2 rounded-lg border border-gray-500 p-5 dark:border-gray-400"
          >
            <p class="m-0 font-text text-base leading-snug font-bold text-gray-800 dark:text-white">
              {{ certificationTitle(certification) }}
            </p>
            <p class="m-0 font-text text-sm text-gray-500 dark:text-gray-400">
              {{ t(`education.certifications.${certification.id}.issuer`) }} ·
              <time :datetime="certification.date">{{ formatMonth(certification.date) }}</time>
            </p>
            <div
              v-if="certification.url || certification.image"
              class="mt-auto flex items-center gap-1 pt-1"
            >
              <a
                v-if="certification.url"
                :href="certification.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex w-fit items-center gap-1.5 rounded-sm font-text text-sm font-bold text-blue-600 no-underline transition hover:text-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-blue-400"
              >
                {{ t('education.showCredential') }}
                <IconExternal />
                <span class="sr-only">({{ t('education.newTab') }})</span>
              </a>
              <!-- Ojo: abre la copia guardada en el portfolio -->
              <button
                v-if="certification.image"
                type="button"
                class="inline-flex size-8 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-blue-600 transition hover:-translate-y-px hover:bg-gray-700 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 motion-reduce:hover:translate-y-0 dark:text-blue-400"
                :aria-label="
                  t('education.viewCertificate', {
                    title: certificationTitle(certification),
                  })
                "
                :title="
                  t('education.viewCertificate', {
                    title: certificationTitle(certification),
                  })
                "
                @click="openCertificate(certification)"
              >
                <IconEye class="size-5" />
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Ventana con el certificado: se cierra con Escape, con la X o pulsando fuera -->
    <dialog
      ref="dialog"
      class="certificate-dialog m-auto w-[min(92vw,60rem)] max-w-none rounded-lg border-0 bg-white p-0 text-gray-800 shadow-xl dark:bg-gray-800 dark:text-white"
      :aria-label="selectedTitle"
      @click="onDialogClick"
      @close="selected = null"
    >
      <div v-if="selected" class="flex flex-col gap-4 p-4 sm:p-6">
        <div class="flex items-start justify-between gap-4">
          <p class="m-0 font-text text-base leading-snug font-bold sm:text-lg">
            {{ selectedTitle }}
          </p>
          <button
            type="button"
            :class="iconButton"
            ref="closeButton"
            :aria-label="t('education.closeCertificate')"
            @click="closeCertificate"
          >
            <IconClose />
          </button>
        </div>
        <img
          v-if="selected.image"
          :src="selected.image"
          :alt="t('education.certificateAlt', { title: selectedTitle })"
          class="max-h-[75vh] w-full rounded-md object-contain"
        />
      </div>
    </dialog>
  </section>
</template>

<style scoped>
.certificate-dialog::backdrop {
  background-color: rgb(17 24 39 / 0.8);
}
</style>
