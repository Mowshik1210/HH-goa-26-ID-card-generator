const CURATED_TITLES = [
  'NEURAL ARCHITECT',
  'FULL-STACK ALCHEMIST',
  'TERMINAL WIZARD',
  'PROMPT PILOT',
  'CODE NOMAD',
  'SHIP ENGINEER',
  'SYSTEMS WIZARD',
  'AI BUILDER',
  'PIXEL HACKER',
  'STACK SURFER',
  'MODEL WHISPERER',
  'PRODUCT HACKER',
] as const

const KEYWORD_MAP: Array<{ pattern: RegExp; title: string }> = [
  { pattern: /\b(ai|ml|llm|gpt|neural|machine learning)\b/i, title: 'NEURAL ARCHITECT' },
  { pattern: /\b(full.?stack|fullstack)\b/i, title: 'FULL-STACK ALCHEMIST' },
  { pattern: /\b(frontend|front-end|react|vue|ui|design)\b/i, title: 'PIXEL HACKER' },
  { pattern: /\b(backend|back-end|api|server|infra)\b/i, title: 'SYSTEMS WIZARD' },
  { pattern: /\b(devops|sre|platform|cloud)\b/i, title: 'SHIP ENGINEER' },
  { pattern: /\b(product|pm|growth)\b/i, title: 'PRODUCT HACKER' },
  { pattern: /\b(prompt|llm ops)\b/i, title: 'PROMPT PILOT' },
  { pattern: /\b(mobile|ios|android|flutter)\b/i, title: 'CODE NOMAD' },
  { pattern: /\b(data|analytics|science)\b/i, title: 'MODEL WHISPERER' },
  { pattern: /\b(blockchain|web3|crypto)\b/i, title: 'STACK SURFER' },
  { pattern: /\b(terminal|cli|shell)\b/i, title: 'TERMINAL WIZARD' },
]

export function generateBuilderTitle(stack: string): string {
  const normalized = stack.trim()
  if (!normalized) return getRandomBuilderTitle()

  for (const { pattern, title } of KEYWORD_MAP) {
    if (pattern.test(normalized)) return title
  }

  return getRandomBuilderTitle()
}

export function getRandomBuilderTitle(): string {
  return CURATED_TITLES[Math.floor(Math.random() * CURATED_TITLES.length)]
}

export { CURATED_TITLES }
