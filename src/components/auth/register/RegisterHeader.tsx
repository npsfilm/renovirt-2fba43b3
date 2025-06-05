
import React from 'react';

interface RegisterHeaderProps {
  onSwitchToLogin: () => void;
}

const RegisterHeader = ({ onSwitchToLogin }: RegisterHeaderProps) => {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-semibold text-white mb-2">Konto erstellen</h1>
      <p className="text-gray-400 text-sm">
        Haben Sie bereits ein Konto?{' '}
        <button 
          onClick={onSwitchToLogin}
          className="text-white underline hover:no-underline cursor-pointer"
        >
          Anmelden
        </button>
      </p>
    </div>
  );
};

export default RegisterHeader;
