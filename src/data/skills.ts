// Tecnologías del anillo de la sección «Skills».
// Los logos son los oficiales y están en src/assets/skills/ (Devicon, Simple Icons
// o el icono de la propia aplicación). Los nombres propios van aquí; los textos que
// se traducen (etiquetas, «Agentes IA» y «APIs REST») salen de src/locales/*.json.
// Los iconos de LLM, Agentes IA y APIs REST son propios: no son marcas.

const logoFiles = import.meta.glob<string>('@/assets/skills/*.{svg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

function logo(file: string): string {
  const url = Object.entries(logoFiles).find(([path]) => path.endsWith(`/${file}`))?.[1]
  if (!url) throw new Error(`Falta el logo src/assets/skills/${file}`)
  return url
}

export type SkillTag =
  | 'frontend'
  | 'backend'
  | 'backendAi'
  | 'ide'
  | 'ai'
  | 'localAi'
  | 'nosql'
  | 'os'
  | 'apiTesting'
  | 'dbClient'
  | 'scripting'
  | 'sql'
  | 'devops'
  | 'versionControl'
  | 'docs'
  | 'data'
  | 'transfer'
  | 'management'

export interface Skill {
  id: string
  /** Nombre propio; si no hay, se usa la traducción `skills.names.<id>` */
  name?: string
  /** Uno o dos logos (Apidog y Postman comparten casilla) */
  logos: string[]
  tag: SkillTag
}

/** Orden del anillo: lenguajes, frameworks y herramientas, bases de datos y testing */
export const skills: Skill[] = [
  { id: 'php', name: 'PHP', logos: [logo('php.svg')], tag: 'backend' },
  { id: 'css', name: 'CSS', logos: [logo('css.svg')], tag: 'frontend' },
  { id: 'javascript', name: 'JavaScript', logos: [logo('javascript.svg')], tag: 'frontend' },
  { id: 'java', name: 'Java', logos: [logo('java.svg')], tag: 'backend' },
  { id: 'python', name: 'Python', logos: [logo('python.svg')], tag: 'backendAi' },
  { id: 'vue', name: 'Vue', logos: [logo('vue.svg')], tag: 'frontend' },
  { id: 'flask', name: 'Flask', logos: [logo('flask.svg')], tag: 'backend' },
  { id: 'restApi', logos: [logo('rest-api.svg')], tag: 'backend' },
  { id: 'vscode', name: 'VS Code', logos: [logo('vscode.svg')], tag: 'ide' },
  { id: 'claude', name: 'Claude', logos: [logo('claude.svg')], tag: 'ai' },
  { id: 'mcp', name: 'MCP', logos: [logo('mcp.svg')], tag: 'ai' },
  { id: 'agents', logos: [logo('agents.svg')], tag: 'ai' },
  { id: 'openai', name: 'OpenAI', logos: [logo('openai.svg')], tag: 'ai' },
  { id: 'ollama', name: 'Ollama', logos: [logo('ollama.svg')], tag: 'localAi' },
  { id: 'llm', name: 'LLM', logos: [logo('llm.svg')], tag: 'ai' },
  { id: 'windows', name: 'Windows', logos: [logo('windows.svg')], tag: 'os' },
  { id: 'linux', name: 'Linux', logos: [logo('linux.svg')], tag: 'os' },
  {
    id: 'apidogPostman',
    name: 'Apidog / Postman',
    logos: [logo('apidog.webp'), logo('postman.svg')],
    tag: 'apiTesting',
  },
  { id: 'workbench', name: 'Workbench', logos: [logo('workbench.webp')], tag: 'dbClient' },
  { id: 'dbeaver', name: 'DBeaver', logos: [logo('dbeaver.svg')], tag: 'dbClient' },
  { id: 'bash', name: 'Bash', logos: [logo('bash.svg')], tag: 'scripting' },
  { id: 'mysql', name: 'MySQL', logos: [logo('mysql.svg')], tag: 'sql' },
  { id: 'postgresql', name: 'PostgreSQL', logos: [logo('postgresql.svg')], tag: 'sql' },
  { id: 'firebase', name: 'Firebase', logos: [logo('firebase.svg')], tag: 'nosql' },
  { id: 'docker', name: 'Docker', logos: [logo('docker.svg')], tag: 'devops' },
  { id: 'git', name: 'Git', logos: [logo('git.svg')], tag: 'versionControl' },
  { id: 'github', name: 'GitHub', logos: [logo('github.svg')], tag: 'devops' },
  { id: 'markdown', name: 'Markdown', logos: [logo('markdown.svg')], tag: 'docs' },
  { id: 'json', name: 'JSON', logos: [logo('json.svg')], tag: 'data' },
  { id: 'winscp', name: 'WinSCP', logos: [logo('winscp.webp')], tag: 'transfer' },
  { id: 'jira', name: 'Jira', logos: [logo('jira.svg')], tag: 'management' },
]
