// Formación y certificaciones de la sección «Educación» (LinkedIn, BOE y web de UNIPRO).
// Aquí van las fechas y los enlaces; los textos salen de src/locales/*.json → education.

export interface Degree {
  id: 'engineering' | 'dam' | 'smr'
  /** Años de inicio y fin */
  start: number
  end: number
  /** Se está cursando: el año de fin es el previsto */
  inProgress?: boolean
}

export interface Certification {
  id: string
  /** Mes de expedición, `AAAA-MM` */
  date: string
  /** Enlace a la credencial, si la tiene */
  url: string | null
  /** Copia del certificado guardada en el portfolio (src/assets/certificados/<id>.webp) */
  image: string | null
}

// Copias de los certificados, por si algún día dejan de funcionar los enlaces
const certificateFiles = import.meta.glob<string>('@/assets/certificados/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
})

function certificateImage(id: string): string | null {
  return (
    Object.entries(certificateFiles).find(([path]) => path.endsWith(`/${id}.webp`))?.[1] ?? null
  )
}

/** De la más reciente a la más antigua */
export const degrees: Degree[] = [
  { id: 'engineering', start: 2026, end: 2029, inProgress: true },
  { id: 'dam', start: 2017, end: 2019 },
  { id: 'smr', start: 2015, end: 2017 },
]

const linkedinCertificate = (hash: string) =>
  `https://www.linkedin.com/learning/certificates/${hash}/`

/** De la más reciente a la más antigua */
const certificationList: Omit<Certification, 'image'>[] = [
  {
    id: 'microsoftGenAi',
    date: '2025-06',
    url: linkedinCertificate('93a41b31c8805e15ecde8898b6435fc61566ba93c543e7d5f301da53703cfcd3'),
  },
  {
    id: 'm365Copilot',
    date: '2025-06',
    url: linkedinCertificate('ab3136c647babed37e96b08464ce05d04775a026fd852ec4838e1515a6d20c1d'),
  },
  {
    id: 'aiBeyondEngineering',
    date: '2025-06',
    url: linkedinCertificate('3d7fb7dc7a82fe7f8265a9d72dd16fca239e2a012eba318def718c6911379817'),
  },
  {
    id: 'aiEthics',
    date: '2025-06',
    url: linkedinCertificate('0d2318a8d644a3a3876ee6fb870342385055dab49b96ab6d62f722895c5886fe'),
  },
  {
    id: 'copilotChat',
    date: '2025-06',
    url: linkedinCertificate('ef4a0dc036bfb2152a2e517696b9423ec0932b6b3504d18d57569e9167523fda'),
  },
  {
    id: 'aiSearch',
    date: '2025-06',
    url: linkedinCertificate('6fcd318849f20528310fa01a3055d692638a8210a4d5885abbc1eebba64f054f'),
  },
  {
    id: 'whatIsGenAi',
    date: '2025-06',
    url: linkedinCertificate('3e7560421c034758c13a4c22272010b9eddaa1091897567eb050c7a6b78b118d'),
  },
  { id: 'udemyGenAi', date: '2024-06', url: null },
  {
    id: 'udemyPhpMaster',
    date: '2021-12',
    url: 'https://www.udemy.com/certificate/UC-33df8af0-8056-4347-8221-310c29e8c56a/',
  },
  {
    id: 'udemyFlexbox',
    date: '2018-10',
    url: 'https://www.udemy.com/certificate/UC-FFV2XFER/',
  },
]

export const certifications: Certification[] = certificationList.map((certification) => ({
  ...certification,
  image: certificateImage(certification.id),
}))
