/**
 * jsDelivr CDN helper — serves all public assets from GitHub via CDN.
 *
 * CDN URL format:
 *   https://cdn.jsdelivr.net/gh/{owner}/{repo}@{branch}/{path-from-repo-root}
 *
 * Usage:
 *   import { cdn } from '../utils/cdn'
 *   <img src={cdn('/packaging_highres.webp')} />
 *   useGLTF(cdn('/models/morivana_pouch_fixed_draco.glb'))
 */

export const CDN_BASE =
  'https://cdn.jsdelivr.net/gh/Morivana/Morivana@main/morivana-app/public'

/**
 * Returns the full CDN URL for a path relative to /public.
 * @param {string} path - e.g. '/models/foo.glb' or '/image.webp'
 */
export function cdn(path) {
  return `${CDN_BASE}${path}`
}

/** Draco decoder directory for Three.js / React Three Fiber */
export const DRACO_CDN = `${CDN_BASE}/draco/`
