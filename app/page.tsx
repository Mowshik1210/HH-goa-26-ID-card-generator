'use client'

import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { Download, ImagePlus, Share2, Sparkles, Upload, X } from 'lucide-react'
import { PhotoEditor, type PhotoTransform } from '@/components/PhotoEditor'
import { convertHeicToJpeg, isHeicFile } from '@/lib/heic-utils'
import { exportNodeToPng, triggerDownload } from '@/lib/export-utils'
import { shareOrDownload } from '@/lib/share-utils'

const frameOptions = [
  { id: 'landscape', label: 'Landscape', className: 'frame-landscape' },
  { id: 'tall', label: 'Tall', className: 'frame-tall' },
  { id: 'circle', label: 'Circle', className: 'frame-circle' },
]

const exportWidths: Record<string, number> = {
  circle: 1024,
  landscape: 1600,
  tall: 1080,
}

const builderTitles = ['BUILDER', 'SHIP CAPTAIN', 'TERMINAL WIZARD', 'PROMPT ENGINEER', 'FULL-STACK DEVELOPER']

const SHARE_TEXT = 'Building at Hacker House Goa 2026 ⚡\n\nHere\'s my builder identity.\n\n#FrameInGoa'

export default function Page() {
  const inputRef = useRef<HTMLInputElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const [mode, setMode] = useState<'pfp' | 'pass'>('pfp')
  const [frame, setFrame] = useState('tall')
  const [image, setImage] = useState<string | null>(null)
  const [fileBaseName, setFileBaseName] = useState('your-avatar')
  const [name, setName] = useState('YOUR NAME')
  const [title, setTitle] = useState('BUILDER')
  const [teamName, setTeamName] = useState('')
  const [role, setRole] = useState('')
  const [transform, setTransform] = useState<PhotoTransform>({ zoom: 1, x: 0, y: 0 })
  const [status, setStatus] = useState('Drop a photo here or browse your camera roll')
  const [isConverting, setIsConverting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // The photo's pan/zoom is specific to a given frame shape — recenter it
  // whenever the frame or mode changes so an offset tuned for one shape
  // (say, Tall) doesn't carry over and look off-center inside another
  // (say, the much smaller Circle window).
  useEffect(() => {
    setTransform({ zoom: 1, x: 0, y: 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame, mode])

  async function loadFile(file?: File) {
    if (!file) return
    if (!file.type.startsWith('image/') && !isHeicFile(file)) {
      setStatus('Please choose a photo file (JPG, PNG, or HEIC)')
      return
    }

    let workingFile = file
    if (isHeicFile(file)) {
      setIsConverting(true)
      setStatus('CONVERTING PHOTO…')
      try {
        workingFile = await convertHeicToJpeg(file)
      } catch {
        setIsConverting(false)
        setStatus('Could not convert that HEIC photo — try a JPG or PNG')
        return
      }
      setIsConverting(false)
    }

    const reader = new FileReader()
    reader.onload = () => {
      setImage(String(reader.result))
      setFileBaseName(file.name.replace(/\.[^/.]+$/, '').slice(0, 22) || 'your-avatar')
      setTransform({ zoom: 1, x: 0, y: 0 })
      setStatus('PHOTO READY — drag to reframe · scroll or pinch to zoom')
    }
    reader.onerror = () => setStatus('Could not read that photo — please try again')
    reader.readAsDataURL(workingFile)
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    loadFile(event.dataTransfer.files?.[0])
  }

  function onUpload(event: ChangeEvent<HTMLInputElement>) {
    loadFile(event.target.files?.[0])
    event.target.value = ''
  }

  function currentExportWidth() {
    return mode === 'pass' ? 1080 : exportWidths[frame] ?? 1080
  }

  async function downloadCard() {
    const node = previewRef.current
    if (!node) return
    setIsExporting(true)
    setStatus('EXPORTING…')
    try {
      const dataUrl = await exportNodeToPng(node, { targetWidth: currentExportWidth() })
      triggerDownload(dataUrl, `${fileBaseName}-hh-goa-2026.png`)
      setStatus('DOWNLOADED — check your files')
    } catch {
      setStatus('Export failed — please try again')
    } finally {
      setIsExporting(false)
    }
  }

  async function shareCard() {
    const node = previewRef.current
    if (!node) return
    setIsExporting(true)
    setStatus('EXPORTING…')
    try {
      const dataUrl = await exportNodeToPng(node, { targetWidth: currentExportWidth() })
      const result = await shareOrDownload(dataUrl, `${fileBaseName}-hh-goa-2026.png`, SHARE_TEXT)
      if (result.method === 'share') setStatus('Shared!')
      else if (result.method === 'fallback') setStatus('Downloaded — post it on X with the pre-filled caption')
      else setStatus('PHOTO READY — drag to reframe · scroll or pinch to zoom')
    } catch {
      setStatus('Share failed — please try again')
    } finally {
      setIsExporting(false)
    }
  }

  const activeFrameClass = frameOptions.find((item) => item.id === frame)?.className || ''
  const busy = isConverting || isExporting

  return (
    <main className="site-shell">
      <header className="topbar">
        <div className="brand-lockup"><span className="brand-word">HACKER</span><span className="brand-goa">गोवा</span><span className="brand-word">HOUSE</span></div>
        <div className="top-meta"><span>GOA, INDIA</span><span>28—31 OCT 2026</span><span className="signal">LESS NOISE. MORE SIGNAL.</span></div>
      </header>

      <section className="hero">
        <div className="hero-copy"><p className="eyebrow"><Sparkles size={14} /> HH GOA 2026 · FRAME STUDIO</p><h1>One frame.<br /><em>Whole crew.</em></h1><p>Make your official Hacker House Goa identity card. Drop a photo, pick your signal, and ship it.</p></div>
        <div className="sunset" aria-hidden="true"><div className="sun" /><div className="horizon" /></div>
      </section>

      <section className="workspace" aria-label="Frame builder">
        <div className="controls-panel">
          <div className="section-heading"><span>01 / CHOOSE YOUR SIGNAL</span><strong>MAKE IT YOURS</strong></div>
          <div className="mode-switch" role="tablist"><button className={mode === 'pfp' ? 'active' : ''} onClick={() => setMode('pfp')} role="tab">PFP FRAME <small>for your X avatar</small></button><button className={mode === 'pass' ? 'active' : ''} onClick={() => setMode('pass')} role="tab">BUILDER PASS <small>for your timeline</small></button></div>

          <div className="upload-box" onDrop={onDrop} onDragOver={(event) => event.preventDefault()} onClick={() => inputRef.current?.click()} role="button" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && inputRef.current?.click()}>
            {image ? <div className="upload-preview"><img src={image} alt="Uploaded avatar preview" /><button aria-label="Remove image" onClick={(event) => { event.stopPropagation(); setImage(null) }}><X size={16} /></button></div> : <><Upload size={26} /><strong>DROP YOUR PHOTO</strong></>}
            <span>{status}</span><input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.heic,.heif,image/*" hidden onChange={onUpload} />
          </div>

          {mode === 'pfp' ? <><div className="section-heading compact"><span>02 / PICK A FRAME</span><span>{frameOptions.length} AVAILABLE</span></div><div className="frame-grid">{frameOptions.map((option) => <button key={option.id} className={`frame-option ${frame === option.id ? 'selected' : ''}`} onClick={() => setFrame(option.id)}><span className={`mini-frame ${option.className}`}>{image && <img src={image} alt="" />}</span><small>{option.label}</small></button>)}</div></> : <><div className="section-heading compact"><span>02 / BUILDER DETAILS</span><span>PASS 001</span></div><label className="field-label">YOUR NAME<input value={name} onChange={(event) => setName(event.target.value.toUpperCase().slice(0, 24))} /></label><label className="field-label">YOUR SIGNAL<select value={title} onChange={(event) => setTitle(event.target.value)}>{builderTitles.map((item) => <option key={item}>{item}</option>)}</select></label><label className="field-label">TEAM NAME<input value={teamName} onChange={(event) => setTeamName(event.target.value.toUpperCase().slice(0, 24))} placeholder="YOUR TEAM" /></label><label className="field-label">ROLE<input value={role} onChange={(event) => setRole(event.target.value.toUpperCase().slice(0, 24))} placeholder="YOUR ROLE" /></label></>}
          <label className="field-label range-label">RE-FRAME <output>{transform.zoom.toFixed(1)}×</output><input type="range" min="1" max="3" step="0.1" value={transform.zoom} onChange={(event) => setTransform((current) => ({ ...current, zoom: Number(event.target.value) }))} /></label>
          <div className="action-row"><button className="primary-action" onClick={downloadCard} disabled={busy}><Download size={17} /> {isExporting ? 'WORKING…' : 'DOWNLOAD PNG'}</button><button className="secondary-action" onClick={shareCard} disabled={busy}><Share2 size={17} /> SHARE</button></div>
        </div>

        <div className="preview-panel">
          <div className="preview-head"><span>LIVE PREVIEW</span><span className="live-dot">● READY TO SHIP</span></div>
          <div ref={previewRef} className={`poster-preview ${mode === 'pass' ? 'pass-preview' : ''} ${mode === 'pfp' ? activeFrameClass : ''}`}>
            <div className="poster-top"><span>HACKER</span><b>गोवा</b><span>HOUSE</span></div>
            <div className="photo-window">
              {image ? (
                <PhotoEditor src={image} transform={transform} onTransformChange={setTransform} />
              ) : (
                <div className="empty-photo"><ImagePlus size={34} /><span>YOUR PHOTO<br />GOES HERE</span></div>
              )}
            </div>
            <div className="poster-info">
              <strong>{mode === 'pass' ? name || 'YOUR NAME' : 'HH GOA 2026'}</strong>
              <span>{mode === 'pass' ? title : 'OCT 28—31 · GOA, INDIA'}</span>
              {mode === 'pass' && (teamName || role) ? (
                <span className="poster-meta-extra">
                  {teamName ? `TEAM: ${teamName}` : ''}
                  {teamName && role ? ' · ' : ''}
                  {role ? `ROLE: ${role}` : ''}
                </span>
              ) : null}
            </div>
            <div className="poster-footer">#FRAMEINGOA <span>✦</span> LESS NOISE. MORE SIGNAL.</div>
          </div>
          <p className="preview-note">Drag to reframe · pinch or scroll to zoom</p>
        </div>
      </section>
      <footer><span>2:47 PM STUDIO</span><span>BUILT IN GOA · SHIP FROM PARADISE</span><span>HH—2026</span></footer>
    </main>
  )
}
