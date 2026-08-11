export type Mode = 'pfp' | 'builder'
export type PfpFrameShape = 'LANDSCAPE' | 'TALL' | 'CIRCLE'

export interface RenderConfig {
    mode: Mode
    shape: PfpFrameShape
    image: HTMLImageElement | null
    photoX: number
    photoY: number
    photoScale: number
    name: string
    title: string
}

export function getDimensions(mode: Mode, shape: PfpFrameShape) {
    if (mode === 'builder') return { width: 1200, height: 675 }
    switch (shape) {
        case 'LANDSCAPE': return { width: 1600, height: 900 }
        case 'TALL': return { width: 1080, height: 1350 }
        case 'CIRCLE':
        default: return { width: 1024, height: 1024 }
    }
}

export function renderArtwork(canvas: HTMLCanvasElement, config: RenderConfig) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 1. Set full high-res canvas size
    const { width, height } = getDimensions(config.mode, config.shape)
    canvas.width = width
    canvas.height = height

    // Background
    ctx.fillStyle = '#0B3D2E' // Deep Goa Green
    ctx.fillRect(0, 0, width, height)

    // Outer Golden Border
    const borderWidth = Math.min(width, height) * 0.015
    ctx.strokeStyle = '#FFD700'
    ctx.lineWidth = borderWidth
    ctx.strokeRect(borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth)

    // 2. Photo Window Coordinates
    let winX = width * 0.1
    let winY = height * 0.16
    let winW = width * 0.8
    let winH = height * 0.56

    if (config.mode === 'pfp' && config.shape === 'CIRCLE') {
        const size = Math.min(width, height) * 0.62
        winX = (width - size) / 2
        winY = (height - size) / 2 - (height * 0.04)
        winW = size
        winH = size
    }

    // 3. Draw Uploaded Photo
    if (config.image) {
        ctx.save()
        ctx.beginPath()

        if (config.mode === 'pfp' && config.shape === 'CIRCLE') {
            const radius = winW / 2
            ctx.arc(winX + radius, winY + radius, radius, 0, Math.PI * 2)
        } else {
            ctx.roundRect(winX, winY, winW, winH, 24)
        }
        ctx.clip()

        const imgAspect = config.image.width / config.image.height
        const winAspect = winW / winH
        let baseW = winW
        let baseH = winH

        if (imgAspect > winAspect) {
            baseW = winH * imgAspect
        } else {
            baseH = winW / imgAspect
        }

        const drawW = baseW * config.photoScale
        const drawH = baseH * config.photoScale
        const centerX = winX + winW / 2 + config.photoX
        const centerY = winY + winH / 2 + config.photoY

        ctx.drawImage(config.image, centerX - drawW / 2, centerY - drawH / 2, drawW, drawH)
        ctx.restore()
    }

    // 4. Pink Inner Frame Border
    ctx.strokeStyle = '#FF007F'
    ctx.lineWidth = Math.min(width, height) * 0.008
    ctx.beginPath()

    if (config.mode === 'pfp' && config.shape === 'CIRCLE') {
        const radius = winW / 2
        ctx.arc(winX + radius, winY + radius, radius, 0, Math.PI * 2)
    } else {
        ctx.roundRect(winX, winY, winW, winH, 24)
    }
    ctx.stroke()

    // 5. Typography Alignment
    ctx.fillStyle = '#FDFBF7'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Header Title
    ctx.font = `900 ${Math.round(width * 0.04)}px sans-serif`
    ctx.fillText('HACKER HOUSE GOA 2026', width / 2, height * 0.08)

    // Name & Title at Bottom
    const textBaseY = winY + winH + ((height - (winY + winH)) * 0.4)

    ctx.fillStyle = '#FFD700'
    ctx.font = `800 ${Math.round(width * 0.042)}px sans-serif`
    ctx.fillText((config.name || 'BUILDER').toUpperCase(), width / 2, textBaseY)

    ctx.fillStyle = '#FF007F'
    ctx.font = `700 ${Math.round(width * 0.022)}px sans-serif`
    ctx.fillText(
        `${(config.title || 'BUILDER').toUpperCase()} • #FrameInGoa`,
        width / 2,
        textBaseY + (height * 0.045)
    )
}