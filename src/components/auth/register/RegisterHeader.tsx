
import React from 'react';

interface RegisterHeaderProps {
  onSwitchToLogin: () => void;
}

const RegisterHeader = ({ onSwitchToLogin }: RegisterHeaderProps) => {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-semibold text-foreground mb-2">Konto erstellen</h1>
      <p className="text-muted-foreground text-sm">
        Haben Sie bereits ein Konto?{' '}
        <button 
          onClick={onSwitchToLogin}
          className="text-primary underline hover:no-underline cursor-pointer transition-colors"
        >
          Anmelden
        </button>
      </p>
    </div>
  );
};

export default RegisterHeader;
