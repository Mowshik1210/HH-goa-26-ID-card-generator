import heic2any from 'heic2any'

export function isHeicFile(file: File): boolean {
    const isMime = file.type === 'image/heic' || file.type === 'image/heif'
    const isExt = /\.(heic|heif)$/i.test(file.name)
    return isMime || isExt
}

export async function convertHeicToJpeg(file: File): Promise<Blob> {
    if (!isHeicFile(file)) {
        return file
    }

    const result = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.9,
    })

    return Array.isArray(result) ? result[0] : result
}