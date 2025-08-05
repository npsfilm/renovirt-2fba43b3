
import React from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import PageHeader from '@/components/layout/PageHeader';
import ProfileForm from '@/components/profile/ProfileForm';
import { useIsMobile } from '@/hooks/use-mobile';

const Profile = () => {
  const isMobile = useIsMobile();
  
  return (
    <MobileLayout>
      {!isMobile && (
        <PageHeader title="Profil" subtitle="Verwalten Sie Ihre persönlichen Daten und Einstellungen" />
      )}
      <div className="p-6 py-[24px]">
        {isMobile && (
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Profil</h1>
            <p className="text-muted-foreground">Verwalten Sie Ihre persönlichen Daten und Einstellungen</p>
          </div>
        )}
        <ProfileForm />
      </div>
    </MobileLayout>
  );
};

export default Profile;
