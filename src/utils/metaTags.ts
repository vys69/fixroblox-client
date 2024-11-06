interface MetaTagsProps {
  title: string;
  description: string;
  image: string;
  url: string;
  oembedTag: string;
}

export function parseMetaTags(html: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return {
    title: doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || '',
    description: doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || '',
    image: doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '',
    url: doc.querySelector('meta[property="og:url"]')?.getAttribute('content') || '',
    oembedTag: doc.querySelector('link[type="application/json+oembed"]')?.outerHTML || ''
  } as MetaTagsProps;
}

export function updateMetaTags({ title, description, image, url, oembedTag }: MetaTagsProps) {
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
  document.querySelector('meta[property="og:image"]')?.setAttribute('content', image);
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', url);
  
  // Handle oEmbed tag
  const existingOembed = document.querySelector('link[type="application/json+oembed"]');
  if (existingOembed) {
    existingOembed.remove();
  }
  if (oembedTag) {
    document.head.insertAdjacentHTML('beforeend', oembedTag);
  }
} 