export interface MetaTags {
  title: string;
  description: string;
  image: string;
  url: string;
}

export const parseMetaTags = (html: string): MetaTags => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  return {
    title: doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || '',
    description: doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || '',
    image: doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '',
    url: doc.querySelector('meta[property="og:url"]')?.getAttribute('content') || ''
  };
};

export const updateMetaTags = (metaTags: MetaTags) => {
  document.title = metaTags.title;
  
  const properties = ['og:title', 'og:description', 'og:image', 'og:url'];
  const values = [metaTags.title, metaTags.description, metaTags.image, metaTags.url];
  
  properties.forEach((property, index) => {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', values[index]);
  });
}; 