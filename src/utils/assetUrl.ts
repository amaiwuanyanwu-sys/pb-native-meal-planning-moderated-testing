/**
 * Get the full URL for an asset in the public folder
 * This handles the base URL for GitHub Pages deployment
 */
export function getAssetUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${cleanPath}`;
}
