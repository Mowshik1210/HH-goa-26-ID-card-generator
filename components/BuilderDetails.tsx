import { RefreshCw } from 'lucide-react'

interface BuilderDetailsProps {
  name: string
  stack: string
  title: string
  onNameChange: (value: string) => void
  onStackChange: (value: string) => void
  onTitleChange: (value: string) => void
  onRegenerateTitle: () => void
}

export function BuilderDetails({
  name,
  stack,
  title,
  onNameChange,
  onStackChange,
  onTitleChange,
  onRegenerateTitle,
}: BuilderDetailsProps) {
  return (
    <>
      <div className="section-heading compact">
        <span>02 / BUILDER DETAILS</span>
        <span>PASS 001</span>
      </div>

      <label className="field-label" htmlFor="builder-name">
        NAME
        <input
          id="builder-name"
          value={name}
          onChange={(event) => onNameChange(event.target.value.toUpperCase().slice(0, 24))}
          placeholder="MOWSHIK"
          autoComplete="name"
          aria-required="true"
        />
      </label>

      <label className="field-label" htmlFor="builder-stack">
        STACK / ROLE
        <input
          id="builder-stack"
          value={stack}
          onChange={(event) => onStackChange(event.target.value.slice(0, 40))}
          placeholder="AI × FULL STACK"
          aria-required="true"
        />
      </label>

      <div className="title-row">
        <label className="field-label title-field" htmlFor="builder-title">
          BUILDER TITLE
          <input
            id="builder-title"
            value={title}
            onChange={(event) => onTitleChange(event.target.value.toUpperCase().slice(0, 32))}
            placeholder="NEURAL ARCHITECT"
          />
        </label>
        <button
          type="button"
          className="regen-title"
          onClick={onRegenerateTitle}
          aria-label="Regenerate builder title from stack"
          title="Regenerate title"
        >
          <RefreshCw size={16} aria-hidden="true" />
        </button>
      </div>
    </>
  )
}
