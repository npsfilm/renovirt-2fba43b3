
import React from 'react';
import { Link } from 'react-router-dom';

const TermsAcceptance = () => {
  return (
    <div className="text-center text-xs text-gray-400 leading-relaxed">
      Mit der Registrierung stimmen Sie unseren{' '}
      <Link to="/terms" className="hover:text-white transition-colors">
        AGB
      </Link>{' '}
      und der{' '}
      <Link to="/privacy" className="hover:text-white transition-colors">
        Datenschutzerklärung
      </Link>{' '}
      zu.
    </div>
  );
};

export default TermsAcceptance;
