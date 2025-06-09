
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import PageHeader from '@/components/layout/PageHeader';
import ProfileForm from '@/components/profile/ProfileForm';

const Profile = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <PageHeader title="Profil" subtitle="Verwalten Sie Ihre persönlichen Daten und Einstellungen" />
          <main className="flex-1 p-6 py-[24px]">
            <ProfileForm />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Profile;
