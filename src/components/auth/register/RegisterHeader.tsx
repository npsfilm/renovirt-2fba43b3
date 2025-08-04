import React from 'react';
interface RegisterHeaderProps {
  onSwitchToLogin: () => void;
}
const RegisterHeader = ({
  onSwitchToLogin
}: RegisterHeaderProps) => {
  return <div className="text-center">
      <h1 className="text-2xl font-semibold text-foreground mb-2">Konto erstellen</h1>
      
    </div>;
};
export default RegisterHeader;