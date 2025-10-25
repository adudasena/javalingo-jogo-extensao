export function levelToLabel(level) {
  return (
    {
      beginner: 'Iniciante',
      intermediate: 'Intermediário',
      advanced: 'Avançado',
    }[level] || 'Indefinido'
  )
}
