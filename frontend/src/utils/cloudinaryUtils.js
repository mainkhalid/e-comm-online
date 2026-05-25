/**
 * cloudinaryUtils.js
 * Helpers for building optimised Cloudinary image URLs.
 * No SDK required — just string manipulation on the raw URL.
 *
 * Usage:
 *   import { getCldUrl, getCldThumb, getCldHero } from '../utils/cloudinaryUtils'
 *
 *   <img src={getCldThumb(product.primary_image)} />
 */

/**
 * Extract the Cloudinary public ID from a full URL.
 * Works with both:
 *   https://res.cloudinary.com/cloud/image/upload/v123/techzone/products/file.jpg
 *   https://res.cloudinary.com/cloud/image/upload/techzone/products/file.jpg
 */
function extractPublicId(url) {
  if (!url) return null
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)$/)
    return match ? match[1].replace(/\.[^/.]+$/, '') : null // strip extension
  } catch {
    return null
  }
}

/**
 * Extract the cloud name from a Cloudinary URL.
 */
function extractCloudName(url) {
  if (!url) return null
  try {
    const match = url.match(/res\.cloudinary\.com\/([^/]+)\//)
    return match ? match[1] : null
  } catch {
    return null
  }
}

/**
 * Build a Cloudinary transformation URL.
 *
 * @param {string} rawUrl    - The original Cloudinary URL from your API
 * @param {object} options   - Transformation options
 * @param {number} [options.width]
 * @param {number} [options.height]
 * @param {string} [options.crop]     - 'fill' | 'fit' | 'thumb' | 'scale' | 'pad'
 * @param {string} [options.gravity]  - 'auto' | 'face' | 'center'
 * @param {string} [options.format]   - 'webp' | 'avif' | 'auto' | 'jpg'
 * @param {string} [options.quality]  - 'auto' | 'auto:best' | 80 etc.
 * @param {string} [options.effect]   - e.g. 'sharpen'
 * @returns {string} Optimised URL or original URL as fallback
 */
export function getCldUrl(rawUrl, options = {}) {
  if (!rawUrl) return '/placeholder-product.png'

  // Local Django media URL (dev or pre-migration images) — return as-is
  // e.g. /media/products/image.jpg or http://localhost:8000/media/...
  if (!rawUrl.includes('res.cloudinary.com')) return rawUrl

  const cloudName = extractCloudName(rawUrl)
  const publicId  = extractPublicId(rawUrl)

  if (!cloudName || !publicId) return rawUrl

  const {
    width,
    height,
    crop    = 'fill',
    gravity = 'auto',
    format  = 'webp',
    quality = 'auto',
    effect,
  } = options

  const parts = []
  if (width)        parts.push(`w_${width}`)
  if (height)       parts.push(`h_${height}`)
  if (width || height) {
    parts.push(`c_${crop}`)
    parts.push(`g_${gravity}`)
  }
  if (format)       parts.push(`f_${format}`)
  if (quality)      parts.push(`q_${quality}`)
  if (effect)       parts.push(`e_${effect}`)

  const transform = parts.join(',')
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}/${publicId}.${format === 'webp' ? 'webp' : 'jpg'}`
}

// ── Preset helpers ─────────────────────────────────────────

/** Product card thumbnail — 480×480 webp, auto quality */
export function getCldThumb(url) {
  return getCldUrl(url, { width: 480, height: 480, crop: 'fill', gravity: 'auto', format: 'webp', quality: 'auto' })
}

/** Product detail main image — 800×800 webp */
export function getCldHero(url) {
  return getCldUrl(url, { width: 800, height: 800, crop: 'pad', gravity: 'center', format: 'webp', quality: 'auto' })
}

/** Small thumbnail strip — 160×160 */
export function getCldMini(url) {
  return getCldUrl(url, { width: 160, height: 160, crop: 'fill', gravity: 'auto', format: 'webp', quality: 'auto' })
}

/** Category banner — 600×400 */
export function getCldBanner(url) {
  return getCldUrl(url, { width: 600, height: 400, crop: 'fill', gravity: 'auto', format: 'webp', quality: 'auto' })
}

/** Blur-up placeholder — tiny 20px wide */
export function getCldBlur(url) {
  return getCldUrl(url, { width: 20, format: 'webp', quality: 10 })
}

/**
 * Fallback: if a URL is NOT from Cloudinary (e.g. local media during dev),
 * just return it directly.
 */
export function safeImgUrl(url) {
  if (!url) return '/placeholder-product.png'
  return url
}