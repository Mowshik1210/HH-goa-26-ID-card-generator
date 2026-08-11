import { Sparkles } from 'lucide-react'
import { GoaDecorations } from './GoaDecorations'

interface HeroProps {
  onScrollToWorkspace?: () => void
}

export function Hero({ onScrollToWorkspace }: HeroProps) {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-copy">
        <p className="eyebrow">
          <Sparkles size={14} aria-hidden="true" />
          HH GOA 2026 · FRAME STUDIO
        </p>
        <h1 id="hero-heading">
          One frame.
          <br />
          <em>Whole crew.</em>
        </h1>
        <p>
          Make your official Hacker House Goa identity card. Drop a photo, pick your signal, and
          ship it.
        </p>
        {onScrollToWorkspace && (
          <button type="button" className="hero-cta" onClick={onScrollToWorkspace}>
            CREATE YOUR FRAME
          </button>
        )}
      </div>
      <GoaDecorations variant="hero" />
    </section>
  )
}
