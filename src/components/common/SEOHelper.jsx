import { useEffect } from 'react';
import { SITE_CONFIG, SEO_REGISTRY } from '../../config/site';

export default function SEOHelper({ currentPath }) {
  useEffect(() => {
    const seo = SEO_REGISTRY[currentPath] || SEO_REGISTRY['/'];
    const canonicalUrl = `${SITE_CONFIG.productionDomain}${currentPath === '/' ? '' : currentPath}`;
    const fullOgImage = `${SITE_CONFIG.productionDomain}${SITE_CONFIG.defaultOgImage}`;

    // 1. Title
    document.title = seo.title;

    // Helper function to update or create meta tags
    const setMetaTag = (selector, attributeName, attributeValue, contentValue) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentValue);
    };

    // 2. Meta Description & Keywords
    setMetaTag('meta[name="description"]', 'name', 'description', seo.description);
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', seo.keywords);
    setMetaTag('meta[name="robots"]', 'name', 'robots', 'index, follow');

    // 3. Canonical URL
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // 4. Open Graph Metadata
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', seo.title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', seo.description);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', fullOgImage);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_CONFIG.name);

    // 5. Twitter / X Cards
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', seo.title);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', seo.description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', fullOgImage);

    // 6. Factual JSON-LD Structured Data
    let scriptJsonLd = document.querySelector('script[type="application/ld+json"]');
    if (!scriptJsonLd) {
      scriptJsonLd = document.createElement('script');
      scriptJsonLd.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptJsonLd);
    }

    const jsonLdData = [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': SITE_CONFIG.legalName,
        'url': SITE_CONFIG.productionDomain,
        'logo': fullOgImage,
        'contactPoint': {
          '@type': 'ContactPoint',
          'email': SITE_CONFIG.contact.email,
          'telephone': SITE_CONFIG.contact.phone,
          'contactType': 'customer support',
        },
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': SITE_CONFIG.address.streetAddress,
          'addressLocality': SITE_CONFIG.address.addressLocality,
          'addressRegion': SITE_CONFIG.address.addressRegion,
          'postalCode': SITE_CONFIG.address.postalCode,
          'addressCountry': SITE_CONFIG.address.addressCountry,
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': SITE_CONFIG.name,
        'url': SITE_CONFIG.productionDomain,
      },
    ];

    // Add Product Schemas for product/motion pages
    if (currentPath.includes('/products') || currentPath.includes('/motion-platform')) {
      jsonLdData.push({
        '@context': 'https://schema.org',
        '@type': 'Product',
        'name': 'AE 6-DOF Motion Platform',
        'description': '6 Degrees of Freedom Stewart hexapod motion platform powered by brushless servos and ball screw linear actuators.',
        'brand': {
          '@type': 'Brand',
          'name': SITE_CONFIG.name,
        },
        'category': 'Driving Simulators & Motion Platforms',
      });
      jsonLdData.push({
        '@context': 'https://schema.org',
        '@type': 'Product',
        'name': 'AE 3-DOF Motion Platform',
        'description': '3 Degrees of Freedom tripod motion platform for dynamic driver training and sim racing.',
        'brand': {
          '@type': 'Brand',
          'name': SITE_CONFIG.name,
        },
        'category': 'Driving Simulators & Motion Platforms',
      });
    }

    scriptJsonLd.textContent = JSON.stringify(jsonLdData);
  }, [currentPath]);

  return null;
}
