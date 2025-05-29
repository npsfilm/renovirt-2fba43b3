
import React from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AITools = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold">AI-Tools</h1>
          </header>
          <main className="flex-1 p-6">
            <Card>
              <CardHeader>
                <CardTitle>AI-Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Hier finden Sie alle verfügbaren AI-Tools.</p>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AITools;
