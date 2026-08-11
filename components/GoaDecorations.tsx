interface GoaDecorationsProps {
  variant?: 'hero' | 'background'
}

export function GoaDecorations({ variant = 'background' }: GoaDecorationsProps) {
  if (variant === 'hero') {
    return (
      <div className="sunset goa-scene" aria-hidden="true">
        <div className="bird bird-1" />
        <div className="bird bird-2" />
        <div className="bird bird-3" />
        <div className="sun" />
        <div className="horizon" />
        <div className="wave wave-1" />
        <div className="wave wave-2" />
        <div className="palm palm-left" />
        <div className="palm palm-right" />
      </div>
    )
  }

  return (
    <div className="bg-decor" aria-hidden="true">
      <div className="bg-leaf bg-leaf-1" />
      <div className="bg-leaf bg-leaf-2" />
    </div>
  )
}
