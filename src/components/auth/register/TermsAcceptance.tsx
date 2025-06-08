
import React from 'react';

const TermsAcceptance = () => {
  return (
    <div className="text-center text-xs text-muted-foreground leading-relaxed">
      Mit der Registrierung stimmen Sie unseren{' '}
      <a
        href="/terms"
        className="text-primary underline hover:no-underline transition-colors"
      >
        Nutzungsbedingungen
      </a>{' '}
      und der{' '}
      <a
        href="/privacy"
        className="text-primary underline hover:no-underline transition-colors"
      >
        Datenschutzerklärung
      </a>{' '}
      zu.
    </div>
  );
};

export default TermsAcceptance;
