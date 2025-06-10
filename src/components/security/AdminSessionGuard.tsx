
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminRole } from '@/hooks/useAdminRole';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, Shield } from 'lucide-react';
import { logSecurityEvent } from '@/utils/secureLogging';

interface AdminSessionGuardProps {
  children: React.ReactNode;
  timeoutMinutes?: number;
}

const AdminSessionGuard = ({ children, timeoutMinutes = 30 }: AdminSessionGuardProps) => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdminRole();
  const [timeLeft, setTimeLeft] = useState(timeoutMinutes * 60);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          logSecurityEvent('admin_session_timeout', { userId: user?.id });
          signOut();
          return 0;
        }
        
        if (prev <= 300 && !showWarning) { // 5 Minuten Warnung
          setShowWarning(true);
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAdmin, user?.id, signOut, showWarning]);

  const extendSession = () => {
    setTimeLeft(timeoutMinutes * 60);
    setShowWarning(false);
    logSecurityEvent('admin_session_extended', { userId: user?.id });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isAdmin) {
    return <>{children}</>;
  }

  if (showWarning) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="w-5 h-5" />
              Session-Warnung
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Ihre Admin-Session läuft in {formatTime(timeLeft)} ab.
              Möchten Sie die Session verlängern?
            </p>
            <div className="flex gap-2">
              <Button onClick={extendSession} className="flex-1">
                <Clock className="w-4 h-4 mr-2" />
                Session verlängern
              </Button>
              <Button variant="outline" onClick={() => signOut()}>
                Abmelden
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative">
      {children}
      <div className="fixed bottom-4 right-4 bg-white border rounded-lg shadow-lg p-3 flex items-center gap-2 text-sm">
        <Shield className="w-4 h-4 text-green-600" />
        <span>Admin-Session: {formatTime(timeLeft)}</span>
      </div>
    </div>
  );
};

export default AdminSessionGuard;
