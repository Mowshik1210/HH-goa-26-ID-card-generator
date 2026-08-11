import { Download, Share2 } from 'lucide-react'

interface ActionButtonsProps {
  onDownload: () => void
  onShare: () => void
  isExporting: boolean
  shareMessage?: string | null
}

export function ActionButtons({ onDownload, onShare, isExporting, shareMessage }: ActionButtonsProps) {
  return (
    <div className="action-section">
      <div className="action-row">
        <button
          type="button"
          className="primary-action"
          onClick={onDownload}
          disabled={isExporting}
          aria-busy={isExporting}
        >
          <Download size={17} aria-hidden="true" />
          {isExporting ? 'GENERATING…' : 'DOWNLOAD PNG'}
        </button>
        <button
          type="button"
          className="secondary-action"
          onClick={onShare}
          disabled={isExporting}
          aria-label="Share on X"
        >
          <Share2 size={17} aria-hidden="true" />
          SHARE ON X
        </button>
      </div>
      {shareMessage && (
        <p className="share-note" role="status">
          {shareMessage}
        </p>
      )}
    </div>
  )
}
