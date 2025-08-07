
import React, { useEffect } from 'react';

const SecurityHeaders = () => {
  useEffect(() => {
    // Set security-related meta tags if they don't exist
    const addMetaTag = (name: string, content: string) => {
      if (!document.querySelector(`meta[name="${name}"]`)) {
        const meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    // Enhanced Content Security Policy
    addMetaTag('Content-Security-Policy', [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "frame-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "block-all-mixed-content",
      "upgrade-insecure-requests"
    ].join('; '));

    // Prevent clickjacking
    addMetaTag('X-Frame-Options', 'DENY');
    
    // Prevent MIME type sniffing
    addMetaTag('X-Content-Type-Options', 'nosniff');
    
    // Enable XSS protection
    addMetaTag('X-XSS-Protection', '1; mode=block');
    
    // Referrer policy
    addMetaTag('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Permissions policy
    addMetaTag('Permissions-Policy', 
      'geolocation=(), microphone=(), camera=(), fullscreen=(self)'
    );

    // Force HTTPS in production
    if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
      window.location.href = window.location.href.replace('http:', 'https:');
    }
  }, []);

  return null; // This component doesn't render anything
};

export default SecurityHeaders;
