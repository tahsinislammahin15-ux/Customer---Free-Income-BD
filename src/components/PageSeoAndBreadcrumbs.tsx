import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Home } from 'lucide-react';
import { ROUTE_CONFIG, resolvePageFromPath } from '../config/routes';
import { useApp } from '../context/AppContext';
import { PageView } from '../types';

const CATEGORY_SIBLINGS: Record<string, PageView[]> = {
  'Gaming Store': ['topup', 'offers'],
  'Esports Arena': ['tournaments', 'leaderboard'],
  'Rewards & Tasks': ['income', 'leaderboard'],
  'Editorial & Guides': ['blog', 'faq'],
  'Community Proof': ['reviews', 'leaderboard'],
  'Help Center': ['faq', 'contact', 'about'],
  'Player Workspace': ['account', 'profile', 'wallet'],
  'Fintech Wallet': ['wallet', 'deposit', 'withdraw', 'transactions'],
  'Legal & Compliance': ['privacy', 'terms', 'about'],
};

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
  const routerNavigate = useNavigate();
  const { siteSettings, language, faqs } = useApp();

  const currentPage = resolvePageFromPath(location.pathname);
  const meta = ROUTE_CONFIG[currentPage] || ROUTE_CONFIG.notfound;

  useEffect(() => {
    const brandedTitle = meta.seoTitle.replace('Free Income BD', siteSettings.siteName || 'Free Income BD');
    const description = meta.seoDescription;
    const canonicalUrl = `${window.location.origin}${location.pathname}`;

    document.title = brandedTitle;
    upsertMetaTag('name', 'description', description);
    upsertMetaTag('property', 'og:title', brandedTitle);
    upsertMetaTag('property', 'og:description', description);
    upsertMetaTag('property', 'og:url', canonicalUrl);
    upsertMetaTag('property', 'og:site_name', siteSettings.siteName || 'Free Income BD');
    upsertMetaTag('name', 'twitter:title', brandedTitle);
    upsertMetaTag('name', 'twitter:description', description);

    let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Structured Data (Schema.org JSON-LD) per route
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
        name: siteSettings.siteName || 'Free Income BD',
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

  if (currentPage === 'home') {
    return null;
  }

  const siblings = CATEGORY_SIBLINGS[meta.category] || [];

  const handleBack = () => {
    if (window.history.length > 1) {
      routerNavigate(-1);
    } else {
      routerNavigate('/');
    }
  };

  return (
    <div className="bg-white/85 dark:bg-[#0A1120]/85 backdrop-blur-md border-b border-[#E2E8F0] dark:border-[#1E2D4A]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Working Back Button + Breadcrumb Trail */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={handleBack}
            className="min-h-[36px] px-3 py-1 rounded-xl btn-secondary text-xs font-semibold inline-flex items-center gap-1.5 shrink-0"
            title="Go back to previous page"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA]" />
            <span>{language === 'bn' ? 'পেছনে যান' : 'Back'}</span>
          </button>

          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-[#475569] dark:text-[#94A3B8] truncate"
          >
            <Link
              to="/"
              className="hover:text-[#2563EB] dark:hover:text-[#60A5FA] inline-flex items-center gap-1 font-medium shrink-0 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'bn' ? 'হোম' : 'Home'}</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
            <span className="hidden md:inline text-[#475569] dark:text-[#94A3B8] shrink-0">
              {meta.category}
            </span>
            <ChevronRight className="hidden md:inline w-3.5 h-3.5 shrink-0 opacity-60" />
            <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC] truncate">
              {language === 'bn' ? meta.labelBn : meta.label}
            </span>
          </nav>
        </div>

        {/* Right: Contextual Section Page Switcher */}
        {siblings.length > 1 && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs">
            <span className="text-[#475569] dark:text-[#94A3B8] mr-1 font-mono text-[11px]">
              Section Pages:
            </span>
            {siblings.map((sibPage) => {
              const sibMeta = ROUTE_CONFIG[sibPage];
              const isActive = sibPage === currentPage;
              return (
                <Link
                  key={sibPage}
                  to={sibMeta.path}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'btn-primary text-white'
                      : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white bg-[#F8FAFC] dark:bg-[#0D1526] border border-[#E2E8F0] dark:border-[#1E2D4A]'
                  }`}
                >
                  {language === 'bn' ? sibMeta.labelBn : sibMeta.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
