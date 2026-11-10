import React from 'react';

/**
 * High-fidelity, lightweight SVG brand logos for enterprise platforms,
 * cloud providers, payment gateways, DevOps tooling, databases, and AI models.
 */
export const getBrandLogo = (name, size = 20) => {
  const n = (name || '').toLowerCase();

  // ----------------------------------------------------------------------
  // 1. PAYMENT GATEWAYS & FINTECH
  // ----------------------------------------------------------------------
  if (n.includes('stripe')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Stripe">
        <rect width="24" height="24" rx="4" fill="#635BFF" />
        <path d="M13.9 10.3c0-.8-.7-1.2-1.8-1.2-1.5 0-3 .6-4 1.3V7.2c1.2-.5 2.7-.8 4.2-.8 3.5 0 5.6 1.7 5.6 4.7v6.5h-3.9v-1.1c-.8.8-2 1.3-3.4 1.3-2.6 0-4.3-1.6-4.3-3.8 0-2.6 2.2-3.7 5.7-3.7h1.9v-.5zm-1.8 4.7c1.1 0 1.8-.7 1.8-1.5v-.8h-1.6c-1.8 0-2.6.5-2.6 1.5 0 .8.8 1.3 1.9 1.3z" fill="#FFFFFF" />
      </svg>
    );
  }

  if (n.includes('razorpayx')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="RazorpayX">
        <rect width="24" height="24" rx="4" fill="#0C2340" />
        <path d="M7 18L13 6H17L11 18H7Z" fill="#3395FF" />
        <path d="M11.5 13.5L16.5 18H12.5L9.5 14.5L11.5 13.5Z" fill="#52B6FF" />
      </svg>
    );
  }

  if (n.includes('razorpay')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Razorpay">
        <rect width="24" height="24" rx="4" fill="#0C2340" />
        <path d="M8 18L13.5 6H17L12 18H8Z" fill="#3395FF" />
        <path d="M12.5 13.5L16.8 18H13.2L10.5 14.8L12.5 13.5Z" fill="#52B6FF" />
      </svg>
    );
  }

  if (n.includes('paypal')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="PayPal">
        <path d="M7.5 4h6.2c2.8 0 4.8 1.4 4.3 4.4-.5 3.3-2.6 5.1-5.7 5.1H9.8l-1.3 7.5H4.2l3.3-17z" fill="#003087" />
        <path d="M9.8 8h5.5c2.5 0 4.3 1.2 3.8 3.9-.5 2.9-2.3 4.5-5.1 4.5h-2.2l-1 5.6H7.1L9.8 8z" fill="#0079C1" opacity="0.85" />
      </svg>
    );
  }

  if (n.includes('square')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Square">
        <rect x="2" y="2" width="20" height="20" rx="5" fill="#282828" />
        <rect x="7" y="7" width="10" height="10" rx="2.5" fill="#FFFFFF" />
        <rect x="10" y="10" width="4" height="4" rx="1" fill="#282828" />
      </svg>
    );
  }

  if (n.includes('adyen')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Adyen">
        <rect width="24" height="24" rx="4" fill="#0ABF53" />
        <path d="M7 16V8h2.8l2.8 5.4L15.4 8H18v8h-2.3v-4.8L13.2 16h-1.6L9.3 11.2V16H7z" fill="#FFFFFF" />
      </svg>
    );
  }

  if (n.includes('plaid')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Plaid">
        <rect width="24" height="24" rx="4" fill="#111111" />
        <circle cx="8" cy="8" r="2.5" fill="#FFFFFF" />
        <circle cx="16" cy="8" r="2.5" fill="#FFFFFF" />
        <circle cx="8" cy="16" r="2.5" fill="#FFFFFF" />
        <circle cx="16" cy="16" r="2.5" fill="#FFFFFF" />
      </svg>
    );
  }

  if (n.includes('apple pay')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Apple Pay">
        <rect width="24" height="24" rx="4" fill="#000000" />
        <path d="M9.8 11.2c-.1.8.6 1.5 1.4 1.5.8 0 1.5-.7 1.4-1.5-.1-.8-.8-1.5-1.5-1.5-.7 0-1.2.7-1.3 1.5zm-3.2 3.6c.4.7.9 1.4 1.6 1.4.7 0 .9-.4 1.7-.4.8 0 1 .4 1.7.4.7 0 1.2-.7 1.6-1.4.5-.8.7-1.6.7-1.6-.7-.3-1.2-.9-1.2-1.7 0-.9.6-1.6 1.4-1.8-.4-.6-1.1-.9-1.8-.9-.8 0-1.3.4-1.7.4-.5 0-1-.4-1.7-.4-.9 0-1.8.7-2.2 1.8-.6 1.6-.1 3.8.9 4.6z" fill="#FFFFFF" />
      </svg>
    );
  }

  if (n.includes('google pay') || n.includes('gpay')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Google Pay">
        <rect width="24" height="24" rx="4" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
        <path d="M12 10.3v3.4h4.8c-.2 1.2-1.4 3.5-4.8 3.5-2.9 0-5.3-2.4-5.3-5.3s2.4-5.3 5.3-5.3c1.7 0 2.8.7 3.4 1.3l2.3-2.3C16.3 4.2 14.3 3.4 12 3.4 7.3 3.4 3.5 7.2 3.5 11.9s3.8 8.5 8.5 8.5c5 0 8.3-3.5 8.3-8.4 0-.6-.1-1.1-.2-1.7H12z" fill="#4285F4" />
      </svg>
    );
  }

  if (n.includes('cashfree')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Cashfree">
        <rect width="24" height="24" rx="4" fill="#7C3AED" />
        <path d="M7 12l3.5 3.5L17 8.5" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (n.includes('billdesk')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="BillDesk">
        <rect width="24" height="24" rx="4" fill="#E65100" />
        <path d="M7 7h10v3H7V7zm0 5h7v3H7v-3zm0 5h10v1H7v-1z" fill="#FFFFFF" />
      </svg>
    );
  }

  if (n.includes('wise')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Wise">
        <rect width="24" height="24" rx="4" fill="#9FE870" />
        <path d="M8 7h8l-3.5 10h-2L8 7zm4 4l3-4h-2l-2 4h1z" fill="#163300" />
      </svg>
    );
  }

  if (n.includes('remitly')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Remitly">
        <rect width="24" height="24" rx="4" fill="#002D5B" />
        <path d="M8 16l4-8 4 8-4-3-4 3z" fill="#29C5F6" />
      </svg>
    );
  }

  if (n.includes('nium')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Nium">
        <rect width="24" height="24" rx="4" fill="#FF5000" />
        <path d="M7 17V7h2.8l4.4 6.6V7H17v10h-2.8L9.8 10.4V17H7z" fill="#FFFFFF" />
      </svg>
    );
  }

  // ----------------------------------------------------------------------
  // 2. CLOUD PLATFORMS
  // ----------------------------------------------------------------------
  if (n.includes('aws') || n.includes('amazon')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="AWS">
        <rect width="24" height="24" rx="4" fill="#232F3E" />
        <path d="M7.2 12.8c-.8 0-1.4-.2-1.7-.5l.4-1.2c.4.3.8.4 1.3.4.6 0 .9-.3.9-.8v-.1c-.2.2-.6.3-1 .3-1.1 0-1.7-.7-1.7-1.6 0-1.1.8-1.8 2-1.8.4 0 .7.1.9.2v-.2h1.3v3.7c0 1.2-.7 1.9-2.1 1.9zm.2-2.3c.5 0 .8-.3.8-.8 0-.5-.3-.8-.8-.8-.5 0-.8.3-.8.8 0 .5.3.8.8.8zm3.6 2.2l1.3-4.9h1.4l.9 3.2.9-3.2h1.4l-1.6 4.9h-1.4l-.8-3.1-.9 3.1h-1.3zm8.3.1c-.8 0-1.5-.2-2-.6l.5-1.1c.4.3.9.5 1.5.5.5 0 .8-.2.8-.5 0-.3-.2-.4-.8-.6-.9-.3-1.4-.7-1.4-1.5 0-.9.7-1.6 1.9-1.6.7 0 1.2.2 1.6.4l-.5 1.1c-.3-.2-.7-.3-1.2-.3-.5 0-.7.2-.7.4 0 .3.3.4.9.6.9.3 1.4.8 1.4 1.5 0 1-.8 1.6-2 1.6z" fill="#FFFFFF" />
        <path d="M5.5 16.5c3.2 1.6 7.6 1.8 11.2-.2" stroke="#FF9900" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M16 15l2 1.5-1.8 1.2" fill="#FF9900" />
      </svg>
    );
  }

  if (n.includes('azure') || n.includes('microsoft azure')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Microsoft Azure">
        <path d="M13.2 3.5H7.8L3 17.5h5.4l4.8-14z" fill="#0078D4" />
        <path d="M13.2 3.5l-4.4 9.8 4.2 4.2h8L13.2 3.5z" fill="#50E6FF" opacity="0.9" />
        <path d="M8.8 13.3L3 17.5h18l-8.2-4.2z" fill="#005BA1" />
      </svg>
    );
  }

  if (n.includes('google cloud') || n.includes('gcp')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Google Cloud">
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" fill="#4285F4" />
        <path d="M19 19H6c-2.76 0-5-2.24-5-5 0-2.46 1.78-4.48 4.14-4.91.43-.98 1.13-1.84 2.01-2.49L9 11l4 2 6 6z" fill="#34A853" opacity="0.25" />
        <circle cx="12" cy="12" r="3" fill="#EA4335" />
        <path d="M14 12l4-4" stroke="#FBBC05" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (n.includes('cloudflare')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Cloudflare">
        <rect width="24" height="24" rx="4" fill="#F6821F" />
        <path d="M18.8 12.8c-.2-1.5-1.4-2.6-2.9-2.6-.4 0-.8.1-1.1.3-.6-1.6-2.1-2.7-3.9-2.7-2.1 0-3.8 1.5-4.2 3.5-.2 0-.4-.1-.7-.1-1.7 0-3 1.3-3 3 0 .1 0 .2 0 .3h15.9c.7-.4 1.1-1 1.1-1.7h-1.2z" fill="#FFFFFF" />
      </svg>
    );
  }

  if (n.includes('digitalocean')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="DigitalOcean">
        <rect width="24" height="24" rx="4" fill="#0080FF" />
        <path d="M12 4v4.5c3.6 0 6.5 2.9 6.5 6.5s-2.9 6.5-6.5 6.5c-3.6 0-6.5-2.9-6.5-6.5h-3c0 5.2 4.3 9.5 9.5 9.5s9.5-4.3 9.5-9.5S17.2 4 12 4z" fill="#FFFFFF" />
      </svg>
    );
  }

  if (n.includes('oracle')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Oracle Cloud">
        <rect width="24" height="24" rx="4" fill="#C74634" />
        <ellipse cx="12" cy="12" rx="7.5" ry="4.5" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
      </svg>
    );
  }

  // ----------------------------------------------------------------------
  // 3. ENTERPRISE PLATFORMS & ERP
  // ----------------------------------------------------------------------
  if (n.includes('sap')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="SAP">
        <rect width="24" height="24" rx="4" fill="#008FD3" />
        <path d="M5 8h4.5c1.4 0 2.2.7 2.2 1.8 0 1.2-1 1.8-2.2 1.8H7v2.4H5V8zm2 2.2h2.2c.4 0 .7-.2.7-.6 0-.3-.3-.5-.7-.5H7v1.1zm7.5-2.2h2l3 6h-2.1l-.6-1.3h-2.6l-.6 1.3h-2.1l3-6zm.4 3.3h1.8L15.8 9l-.9 2.3z" fill="#FFFFFF" />
      </svg>
    );
  }

  if (n.includes('salesforce')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Salesforce">
        <rect width="24" height="24" rx="4" fill="#00A1E0" />
        <path d="M10.2 7.5c.8-.8 1.9-1.3 3.1-1.3 1.9 0 3.5 1.2 4.1 2.9.7.2 1.3.5 1.8 1 .8.8 1.3 1.9 1.3 3.1 0 2.4-2 4.4-4.4 4.4H7.8c-2.4 0-4.3-1.9-4.3-4.3 0-2.1 1.5-3.8 3.5-4.2.5-1.4 1.8-2.4 3.2-2.4v.8z" fill="#FFFFFF" />
      </svg>
    );
  }

  if (n.includes('servicenow')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="ServiceNow">
        <rect width="24" height="24" rx="4" fill="#293E40" />
        <circle cx="12" cy="12" r="5.5" stroke="#81B5A1" strokeWidth="2" strokeDasharray="30 5" fill="none" />
        <circle cx="12" cy="12" r="2.2" fill="#81B5A1" />
      </svg>
    );
  }

  if (n.includes('workday')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Workday">
        <rect width="24" height="24" rx="4" fill="#005CB9" />
        <path d="M6 14.5c1.8-3.5 4.8-5.5 8-5.5s4.2 1.5 5 3.5" stroke="#F58220" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  if (n.includes('netsuite')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Oracle NetSuite">
        <rect width="24" height="24" rx="4" fill="#1C3F6E" />
        <path d="M8 7v10h2.5V11L14 17h2V7h-2.5v6L10 7H8z" fill="#FFFFFF" />
      </svg>
    );
  }

  if (n.includes('dynamics')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Microsoft Dynamics 365">
        <rect width="24" height="24" rx="4" fill="#002050" />
        <path d="M7 6l5 4.5L7 15V6zm5 4.5l5-4.5v9l-5 4.5V10.5z" fill="#0078D4" />
      </svg>
    );
  }

  if (n.includes('guidewire')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Guidewire">
        <rect width="24" height="24" rx="4" fill="#0A3B5C" />
        <circle cx="8" cy="12" r="3" fill="#00A3E0" />
        <circle cx="16" cy="8" r="2" fill="#FFFFFF" />
        <circle cx="15" cy="16" r="2" fill="#FFFFFF" />
      </svg>
    );
  }

  if (n.includes('odoo')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Odoo ERP">
        <rect width="24" height="24" rx="4" fill="#714B67" />
        <circle cx="9" cy="12" r="3.5" stroke="#FFFFFF" strokeWidth="2" fill="none" />
        <circle cx="15" cy="12" r="3.5" stroke="#00A09D" strokeWidth="2" fill="none" />
      </svg>
    );
  }

  // ----------------------------------------------------------------------
  // 4. FRONTIER AI REASONING MODELS
  // ----------------------------------------------------------------------
  if (n.includes('openai') || n.includes('gpt')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-label="OpenAI">
        <path d="M22.28 9.82a6 6 0 0 0-.51-4.91 6.05 6.05 0 0 0-6.51-2.9A6.07 6.07 0 0 0 4.98 4.18a6 6 0 0 0-4 2.9 6.05 6.05 0 0 0 .74 7.1 6 6 0 0 0 .51 4.91 6.05 6.05 0 0 0 6.51 2.9A6 6 0 0 0 13.26 24a6.06 6.06 0 0 0 5.77-4.21 6 6 0 0 0 4-2.9 6.06 6.06 0 0 0-.75-7.07zm-9.02 12.61a4.48 4.48 0 0 1-2.88-1.04l.14-.08 4.78-2.76a.8.8 0 0 0 .4-.68v-6.74l2.02 1.17a.07.07 0 0 1 .04.05v5.59a4.5 4.5 0 0 1-4.5 4.49zm-9.66-4.13a4.47 4.47 0 0 1-.54-3.01l.15.08 4.78 2.76a.77.77 0 0 0 .78 0l5.84-3.37v2.33a.08.08 0 0 1-.03.06L9.74 19.95a4.5 4.5 0 0 1-6.14-1.65zm-1.26-6.4a4.49 4.49 0 0 1 2.37-1.98v5.68a.77.77 0 0 0 .38.68l5.82 3.35-2.02 1.17a.08.08 0 0 1-.07 0l-4.83-2.79a4.5 4.5 0 0 1-1.65-6.11zm16.6 3.85l-5.78-3.33 2.02-1.16a.08.08 0 0 1 .07 0l4.83 2.79a4.49 4.49 0 0 1-.68 8.1v-5.67a.8.8 0 0 0-.4-.67zm2.01-3.02l-.14-.08-4.78-2.78a.78.78 0 0 0-.78 0L9.4 9.23V6.9a.07.07 0 0 1 .03-.06l4.83-2.79a4.5 4.5 0 0 1 6.68 4.66zM8.3 12.86l-2.02-1.16a.08.08 0 0 1-.04-.06V6.07a4.5 4.5 0 0 1 7.38-3.45l-.14.08L8.7 5.46a.8.8 0 0 0-.4.68v6.72zm1.15-2.61l3.2-1.85 3.21 1.85v3.71l-3.2 1.85-3.21-1.85z" />
      </svg>
    );
  }

  if (n.includes('gemini') || n.includes('deepmind') || n.includes('google deepmind')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Google Gemini">
        <path d="M12 0C12 6.63 6.63 12 0 12c6.63 0 12 5.37 12 12 0-6.63 5.37-12 12-12-6.63 0-12-5.37-12-12z" fill="url(#gemini-grad)" />
        <defs>
          <linearGradient id="gemini-grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1BA1E3" />
            <stop offset="0.5" stopColor="#5457FE" />
            <stop offset="1" stopColor="#9B72CB" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (n.includes('claude') || n.includes('anthropic')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#D97757" aria-label="Anthropic Claude">
        <path d="M17.42 20.37h-3.42l-1.98-4.8H8.08l-1.95 4.8H2.75L9.08 4.25h3.25l5.09 16.12zM9.03 13.12h2.95l-1.46-4.04-1.49 4.04z" />
      </svg>
    );
  }

  // ----------------------------------------------------------------------
  // 5. PROGRAMMING LANGUAGES & FRAMEWORKS
  // ----------------------------------------------------------------------
  if (n.includes('react')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="React">
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.5" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" stroke="#61DAFB" strokeWidth="1.5" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" stroke="#61DAFB" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="1.8" fill="#61DAFB" />
      </svg>
    );
  }

  if (n.includes('next.js') || n.includes('nextjs')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Next.js">
        <circle cx="12" cy="12" r="11" fill="#000000" />
        <path d="M7 8v8h2V9.8l7.5 8.2h2L9.2 8H7z" fill="#FFFFFF" />
        <path d="M15 8h2v5.5h-2z" fill="#FFFFFF" />
      </svg>
    );
  }

  if (n.includes('node.js') || n.includes('nodejs')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Node.js">
        <path d="M12 2l9 5.2v10.4l-9 5.2-9-5.2V7.2L12 2z" fill="#5FA04E" />
        <path d="M12 6.5l5.5 3.2v6.4L12 19.3l-5.5-3.2V9.7L12 6.5z" fill="#333333" />
        <path d="M12 8.5v7m-3-4.5l6 2" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (n.includes('typescript')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="TypeScript">
        <rect width="24" height="24" rx="4" fill="#3178C6" />
        <path d="M11.5 11h-3v8H7v-8H4V9h7.5v2zm9 4c0 2.2-1.6 3.2-3.8 3.2-2.1 0-3.5-.9-3.7-2.3l1.8-.4c.1.7.9 1.1 1.9 1.1 1 0 1.9-.4 1.9-1.3 0-.8-.7-1.1-1.8-1.5-1.9-.6-3.4-1.2-3.4-3 0-1.8 1.4-3 3.5-3 1.9 0 3.2.8 3.5 2.3l-1.8.4c-.1-.7-.8-1.1-1.7-1.1-.9 0-1.6.5-1.6 1.2 0 .6.5.9 1.6 1.3 1.9.7 3.6 1.4 3.6 3.1z" fill="#FFFFFF" />
      </svg>
    );
  }

  if (n.includes('javascript')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="JavaScript">
        <rect width="24" height="24" rx="4" fill="#F7DF1E" />
        <path d="M11 11.5v6.5c0 1.2-.8 1.8-2 1.8-.8 0-1.5-.4-1.8-1l1.3-.8c.2.3.4.5.6.5.3 0 .4-.2.4-.6v-6.4H11zm9 4.3c0 2.4-1.7 3.5-3.8 3.5-2.2 0-3.7-1.1-4-2.5l1.8-.6c.2.8.9 1.4 2.1 1.4 1.1 0 2-.6 2-1.5 0-.9-.8-1.3-2-1.8-1.9-.8-3.5-1.5-3.5-3.4 0-2 1.5-3.4 3.6-3.4 2 0 3.4.9 3.8 2.5l-1.8.6c-.2-.7-.8-1.3-1.9-1.3-1 0-1.7.5-1.7 1.4 0 .7.6 1.1 1.7 1.5 2.1.8 3.7 1.6 3.7 3.6z" fill="#000000" />
      </svg>
    );
  }

  if (n.includes('python')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Python">
        <path d="M11.8 2c-4 0-3.8 1.7-3.8 1.7l.01 1.8h3.9v.6H6.1S3.5 5.8 3.5 10c0 4.1 2.3 4 2.3 4h1.4v-2c0-2.3 2-2.3 2-2.3h3.9c1.9 0 1.9-1.8 1.9-1.8V4c0-2-3.2-2-3.2-2zm-1.1 1.2c.4 0 .7.3.7.7 0 .4-.3.7-.7.7-.4 0-.7-.3-.7-.7 0-.4.3-.7.7-.7z" fill="#3776AB" />
        <path d="M12.2 22c4 0 3.8-1.7 3.8-1.7l-.01-1.8H12.1v-.6h5.8s2.6.3 2.6-3.9c0-4.1-2.3-4-2.3-4h-1.4v2c0 2.3-2 2.3-2 2.3H10.9c-1.9 0-1.9 1.8-1.9 1.8V20c0 2 3.2 2 3.2 2zm1.1-1.2c-.4 0-.7-.3-.7-.7 0-.4.3-.7.7-.7.4 0 .7.3.7.7 0 .4-.3.7-.7.7z" fill="#FFD438" />
      </svg>
    );
  }

  if (n.includes('docker')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Docker">
        <rect width="24" height="24" rx="4" fill="#2496ED" />
        <path d="M4 14.5c.5 3 3 5 7.5 5s7.5-2.5 8-5.5c-1-.2-4.5-.2-6.5 1.5-2.5-1.5-6-1.5-9-1z" fill="#FFFFFF" />
        <rect x="7" y="11" width="2" height="2" fill="#FFFFFF" />
        <rect x="10" y="11" width="2" height="2" fill="#FFFFFF" />
        <rect x="13" y="11" width="2" height="2" fill="#FFFFFF" />
        <rect x="10" y="8" width="2" height="2" fill="#FFFFFF" />
        <rect x="13" y="8" width="2" height="2" fill="#FFFFFF" />
      </svg>
    );
  }

  if (n.includes('kubernetes')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Kubernetes">
        <circle cx="12" cy="12" r="11" fill="#326CE5" />
        <circle cx="12" cy="12" r="3.5" stroke="#FFFFFF" strokeWidth="1.8" fill="none" />
        <path d="M12 3v5.5m0 7V21M3.5 7.5l5 3m7 3l5 3M3.5 16.5l5-3m7-3l5-3" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (n.includes('postgresql') || n.includes('postgres')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="PostgreSQL">
        <rect width="24" height="24" rx="4" fill="#336791" />
        <ellipse cx="12" cy="9" rx="6" ry="4" fill="#FFFFFF" />
        <path d="M9 11v6c0 1.5 1.3 2.5 3 2.5s3-1 3-2.5v-6" stroke="#336791" strokeWidth="1.8" fill="#FFFFFF" />
      </svg>
    );
  }

  if (n.includes('mongodb')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="MongoDB">
        <rect width="24" height="24" rx="4" fill="#001E2B" />
        <path d="M12 3c-1.5 3-4.5 6.5-4.5 10.5 0 3.5 2 6.5 4.5 7.5 2.5-1 4.5-4 4.5-7.5C16.5 9.5 13.5 6 12 3z" fill="#00ED64" />
        <path d="M12 3v18" stroke="#13AA52" strokeWidth="1" />
      </svg>
    );
  }

  if (n.includes('redis')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Redis">
        <rect width="24" height="24" rx="4" fill="#DC382D" />
        <path d="M12 5l6.5 3.5v7L12 19l-6.5-3.5v-7L12 5z" fill="#A8201A" />
        <path d="M12 5l6.5 3.5-6.5 3.5-6.5-3.5L12 5z" fill="#FFFFFF" opacity="0.9" />
      </svg>
    );
  }

  if (n.includes('github actions') || n.includes('github')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="GitHub Actions">
        <rect width="24" height="24" rx="4" fill="#2088FF" />
        <path d="M12 4a8 8 0 0 0-2.5 15.6c.4.1.5-.2.5-.4v-1.4c-2.2.5-2.7-1.1-2.7-1.1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.2 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.2 0-.2-.4-1 .1-2.2 0 0 .7-.2 2.2.8a7.8 7.8 0 0 1 4 0c1.5-1 2.2-.8 2.2-.8.5 1.2.2 2 .1 2.2.5.6.8 1.3.8 2.2 0 3.1-1.9 3.8-3.7 4 .3.3.6.8.6 1.6v2.4c0 .2.2.5.6.4A8 8 0 0 0 12 4z" fill="#FFFFFF" />
      </svg>
    );
  }

  // Generic fallback: clean geometric emblem
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label={name}>
      <rect width="24" height="24" rx="4" fill="var(--kb-cocoa, #3D2B24)" />
      <polygon points="12 4 19 8 19 16 12 20 5 16 5 8 12 4" stroke="var(--kb-coral, #FF7B88)" strokeWidth="1.8" fill="none" />
      <circle cx="12" cy="12" r="2.5" fill="var(--kb-cream, #F8F1E9)" />
    </svg>
  );
};

