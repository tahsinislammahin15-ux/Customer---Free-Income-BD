import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ROUTE_CONFIG, resolvePageFromPath } from '../config/routes';
import { useApp } from '../context/AppContext';

function upsertMetaTag(attrName: 'name' | 'property', attrValue: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export const PageSeoAndBreadcrumbs: React.FC = () => {
  const location = useLocation();
  const { siteSettings, faqs } = useApp();

  const currentPage = resolvePageFromPath(location.pathname);
  const meta = ROUTE_CONFIG[currentPage] || ROUTE_CONFIG.notfound;

  useEffect(() => {
    const brand = siteSettings.siteName || 'H41FFTOPUP';
    const brandedTitle = meta.seoTitle.replace(/H41FFTOPUP/g, brand);
    const description = meta.seoDescription;
    const canonicalUrl = `${window.location.origin}${location.pathname}`;

    document.title = brandedTitle;
    upsertMetaTag('name', 'description', description);
    upsertMetaTag('property', 'og:title', brandedTitle);
    upsertMetaTag('property', 'og:description', description);
    upsertMetaTag('property', 'og:url', canonicalUrl);
    upsertMetaTag('property', 'og:site_name', brand);
    upsertMetaTag('name', 'twitter:title', brandedTitle);
    upsertMetaTag('name', 'twitter:description', description);

    let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    let scriptEl = document.head.querySelector<HTMLScriptElement>('script#route-jsonld');
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'route-jsonld';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    const baseSchema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': meta.schemaType,
      name: brandedTitle,
      description,
      url: canonicalUrl,
      isPartOf: {
        '@type': 'WebSite',
        name: brand,
        url: window.location.origin,
      },
    };

    if (currentPage === 'faq' && faqs.length > 0) {
      baseSchema.mainEntity = faqs.slice(0, 6).map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      }));
    }

    scriptEl.textContent = JSON.stringify(baseSchema);
  }, [currentPage, meta, location.pathname, siteSettings.siteName, faqs]);

  return null;
};
