// Puestos de la sección «Experiencia», del más reciente al más antiguo (sacados de LinkedIn).
// Aquí van las fechas y las tecnologías (ids del anillo de Skills); los textos
// (cargo, empresa, tipo, lugar y logros) salen de src/locales/*.json → experience.items.<id>.

import { skills, type Skill } from './skills'

export interface Job {
  id: 'atls' | 'clickedu' | 'foxtenn' | 'gmedia' | 'cellservice'
  /** Mes de inicio, `AAAA-MM` */
  start: string
  /** Mes de fin, `AAAA-MM`; null si es el puesto actual */
  end: string | null
  /** Tiene lugar o modalidad en los textos */
  hasPlace: boolean
  /** Insignias junto al cargo (claves de experience.badges) */
  badges?: ('fullstack' | 'hardware')[]
  skills: Skill[]
}

function pick(...ids: string[]): Skill[] {
  return ids.map((id) => {
    const skill = skills.find((s) => s.id === id)
    if (!skill) throw new Error(`No existe la skill «${id}»`)
    return skill
  })
}

export const jobs: Job[] = [
  {
    id: 'atls',
    start: '2021-11',
    end: null,
    hasPlace: false,
    badges: ['fullstack'],
    skills: pick(
      'php',
      'laravel',
      'restApi',
      'vue',
      'python',
      'openai',
      'ollama',
      'llm',
      'java',
      'mysql',
      'git',
    ),
  },
  {
    id: 'clickedu',
    start: '2020-03',
    end: '2021-10',
    hasPlace: true,
    badges: ['fullstack'],
    skills: pick('php', 'laravel', 'javascript', 'css', 'git', 'json'),
  },
  {
    id: 'foxtenn',
    start: '2019-07',
    end: '2020-03',
    hasPlace: true,
    badges: ['hardware'],
    skills: [],
  },
  {
    id: 'gmedia',
    start: '2018-06',
    end: '2019-06',
    hasPlace: true,
    badges: ['fullstack'],
    skills: pick('php', 'javascript', 'css'),
  },
  {
    id: 'cellservice',
    start: '2016-12',
    end: '2017-05',
    hasPlace: true,
    badges: ['hardware'],
    skills: pick('windows'),
  },
]
