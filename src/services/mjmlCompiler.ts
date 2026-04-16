// mjml-browser is lazy-loaded to keep the initial bundle small (>500 KB)
// Type is declared in src/types/declarations.d.ts

interface MjmlError {
  message: string
  line: number
  tagName?: string
}

interface MjmlResult {
  html: string
  errors: MjmlError[]
}

type MjmlFn = (input: string) => MjmlResult

let mjmlInstance: MjmlFn | null = null

async function loadMjml(): Promise<MjmlFn> {
  if (mjmlInstance) return mjmlInstance
  // Dynamic import → Vite splits this into a separate chunk
  const module = await import('mjml-browser')
  mjmlInstance = module.default as MjmlFn
  return mjmlInstance
}

export async function compileMjml(mjmlMarkup: string): Promise<MjmlResult> {
  const mjml = await loadMjml()
  return mjml(mjmlMarkup)
}

export function resetMjmlCache(): void {
  mjmlInstance = null
}
