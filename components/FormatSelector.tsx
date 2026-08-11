import type { FormatMode } from '@/lib/types'

interface FormatSelectorProps {
  mode: FormatMode
  onChange: (mode: FormatMode) => void
}

export function FormatSelector({ mode, onChange }: FormatSelectorProps) {
  return (
    <div className="mode-switch" role="tablist" aria-label="Choose output format">
      <button
        type="button"
        className={mode === 'pfp' ? 'active' : ''}
        onClick={() => onChange('pfp')}
        role="tab"
        aria-selected={mode === 'pfp'}
        id="tab-pfp"
        aria-controls="format-panel"
      >
        PFP FRAME
        <small>for your X avatar</small>
      </button>
      <button
        type="button"
        className={mode === 'pass' ? 'active' : ''}
        onClick={() => onChange('pass')}
        role="tab"
        aria-selected={mode === 'pass'}
        id="tab-pass"
        aria-controls="format-panel"
      >
        BUILDER PASS
        <small>for your timeline</small>
      </button>
    </div>
  )
}
