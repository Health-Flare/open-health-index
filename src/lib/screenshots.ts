import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

interface Screenshot {
  file: ImageMetadata;
  alt: string;
  source: string;
  license: string;
}

// One canonical rendition per screenshot for JSON-LD and /tools.json. Same
// options as the tool page's 480w image, so it's a file we already ship.
async function canonical(file: ImageMetadata, site: string | URL) {
  const img = await getImage({ src: file, width: 480, format: 'webp' });
  return new URL(img.src, site).href;
}

export async function screenshotUrls(shots: readonly Screenshot[], site: string | URL) {
  return Promise.all(shots.map((s) => canonical(s.file, site)));
}

/** Public shape for /tools.json. Never exposes local file paths. */
export async function screenshotRecords(shots: readonly Screenshot[], site: string | URL) {
  return Promise.all(
    shots.map(async (s) => ({ url: await canonical(s.file, site), alt: s.alt, source: s.source, license: s.license })),
  );
}
