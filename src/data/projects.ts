// Proyectos de la sección «Proyectos» (sacados de LinkedIn y de los README de GitHub).
// Aquí van los enlaces, la captura y las tecnologías; los textos salen de
// src/locales/*.json → projects.items.<id>.

const files = import.meta.glob<string>(
  ['@/assets/proyectos/*.webp', '@/assets/tech/*.svg', '@/assets/skills/*.svg'],
  { eager: true, query: '?url', import: 'default' },
)

function asset(path: string): string {
  const url = Object.entries(files).find(([key]) => key.endsWith(path))?.[1]
  if (!url) throw new Error(`Falta el fichero src/assets${path}`)
  return url
}

export interface Tech {
  name: string
  logo: string
}

export interface Project {
  id: 'twoBudget' | 'danaRadar' | 'speech2text'
  name: string
  /** Captura de la web (src/assets/proyectos) */
  image: string
  web: string
  repo: string
  tech: Tech[]
}

const tech = (name: string, path: string): Tech => ({ name, logo: asset(path) })

export const projects: Project[] = [
  {
    id: 'twoBudget',
    name: '2Budget',
    image: asset('/proyectos/2budget.webp'),
    web: 'https://caldeix.github.io/2budget/',
    repo: 'https://github.com/caldeix/2budget',
    tech: [
      tech('Next.js', '/skills/nextjs.svg'),
      tech('TypeScript', '/skills/typescript.svg'),
      tech('Tailwind CSS', '/skills/tailwindcss.svg'),
      tech('Firebase', '/skills/firebase.svg'),
    ],
  },
  {
    id: 'danaRadar',
    name: 'DANA Radar',
    image: asset('/proyectos/dana-radar.webp'),
    web: 'https://caldeix.github.io/dana-radar/',
    repo: 'https://github.com/caldeix/dana-radar',
    tech: [
      tech('Python', '/skills/python.svg'),
      tech('JavaScript', '/skills/javascript.svg'),
      tech('Leaflet', '/tech/leaflet.svg'),
      tech('GitHub Actions', '/skills/githubactions.svg'),
    ],
  },
  {
    id: 'speech2text',
    name: 'Simple Speech2Text',
    image: asset('/proyectos/speech2text.webp'),
    web: 'https://caldeix.github.io/simple-speech2-text-translator/',
    repo: 'https://github.com/caldeix/simple-speech2-text-translator',
    tech: [
      tech('JavaScript', '/skills/javascript.svg'),
      tech('HTML5', '/tech/html5.svg'),
      tech('IA de Chrome', '/tech/chrome.svg'),
    ],
  },
]

export const LINKS_URL = 'https://caldeix.github.io/links/'
