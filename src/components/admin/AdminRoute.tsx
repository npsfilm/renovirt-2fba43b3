
import React from 'react';
import SecureAdminWrapper from './SecureAdminWrapper';

interface AdminRouteProps {
  children: React.ReactNode;
  requireReauth?: boolean;
}

const AdminRoute = ({ children, requireReauth = false }: AdminRouteProps) => {
  return (
    <SecureAdminWrapper requireReauth={requireReauth}>
      {children}
    </SecureAdminWrapper>
  );
};

export default AdminRoute;
