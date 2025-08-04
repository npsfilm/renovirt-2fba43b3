import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCustomerProfile } from '@/hooks/useCustomerProfile';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
const Auth = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const {
    user
  } = useAuth();
  const {
    getCustomerProfile
  } = useCustomerProfile();
  const navigate = useNavigate();
  const location = useLocation();

  // Die Seite abrufen, die der Benutzer vor der Weiterleitung zur Anmeldung besuchen wollte
  const from = location.state?.from?.pathname || '/dashboard';

  // Weiterleitung wenn bereits angemeldet
  useEffect(() => {
    const checkUserProfileAndRedirect = async () => {
      if (user) {
        // Wenn Benutzer bestätigt ist (E-Mail verifiziert), Profilvollständigkeit prüfen
        if (user.email_confirmed_at) {
          try {
            const profile = await getCustomerProfile();

            // Wenn Profil existiert und erforderliche Felder hat, zur ursprünglich angeforderten Seite oder Dashboard gehen
            if (profile && profile.first_name && profile.last_name && profile.role) {
              navigate(from, {
                replace: true
              });
            } else {
              // Wenn Profil nicht existiert oder unvollständig ist, zum Onboarding gehen
              navigate('/onboarding');
            }
          } catch (error) {
            // Bei Fehler beim Abrufen des Profils, annehmen dass es nicht existiert
            navigate('/onboarding');
          }
        } else {
          // Wenn Benutzer nicht bestätigt ist, E-Mail-Verifizierungsbildschirm anzeigen
          navigate('/email-verification');
        }
      }
    };
    checkUserProfileAndRedirect();
  }, [user, navigate, getCustomerProfile, from]);
  const handleAuthSuccess = (isRegistration = false) => {
    if (isRegistration) {
      // Nach Registrierung zur E-Mail-Verifizierung weiterleiten
      navigate('/email-verification');
    } else {
      // Nach Anmeldung basierend auf E-Mail-Bestätigungsstatus und Profilvollständigkeit weiterleiten
      // Dies wird durch den useEffect oben gehandhabt
    }
  };
  const handleSwitchToRegister = () => {
    setActiveTab('register');
  };
  const handleSwitchToLogin = () => {
    setActiveTab('login');
  };
  return <div className="min-h-screen w-full bg-background flex items-center justify-center overflow-hidden">
      <div className="w-full h-full flex">
        {/* Left side - Auth Form */}
        <div className="w-full lg:w-3/5 xl:w-1/2 flex items-center justify-center p-[2vh] bg-background">
          <div className="w-full max-w-md h-auto flex flex-col justify-center min-h-0">
            <div className="mb-[2vh] text-center">
              <img src="/lovable-uploads/9ec7c3ad-34b9-4fea-a9e9-0d4a0a5532e9.png" alt="Renovirt Logo" className="h-[2.4vh] mx-auto mb-[1vh]" />
              <h1 className="text-xl font-bold text-foreground/80 mb-[1vh]">Der erste Eindruck zählt. Machen wir ihn perfekt.</h1>
            </div>
            
            {/* Custom Tab Navigation with responsive sizing */}
            <div className="w-full mb-[2vh]">
              <div className="inline-flex h-[5vh] min-h-[40px] items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground w-full">
                <button onClick={() => setActiveTab('login')} className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-[2vw] py-[1vh] text-[clamp(0.75rem,3.5vw,0.875rem)] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full ${activeTab === 'login' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                  Anmelden
                </button>
                <button onClick={() => setActiveTab('register')} className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-[2vw] py-[1vh] text-[clamp(0.75rem,3.5vw,0.875rem)] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full ${activeTab === 'register' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                  Registrieren
                </button>
              </div>
            </div>

            {/* Forms */}
            <div className="flex-1 min-h-0">
              {activeTab === 'login' && <LoginForm onSuccess={() => handleAuthSuccess(false)} onSwitchToRegister={handleSwitchToRegister} />}

              {activeTab === 'register' && <RegisterForm onSuccess={() => handleAuthSuccess(true)} onSwitchToLogin={handleSwitchToLogin} />}
            </div>
          </div>
        </div>

        {/* Right side - Marketing Content (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-2/5 xl:w-1/2 relative overflow-hidden h-screen">
          {/* Background Image with 10-degree rotation */}
          <div className="absolute inset-0 transform rotate-[10deg] scale-125 origin-center auth-background" />
          
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/70" />
          
          {/* Additional gradient overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
          
          <div className="relative z-10 flex flex-col justify-between p-[3vh] text-white h-full w-full">
            {/* Top Section - Main Content */}
            <div className="flex flex-col justify-center items-center w-3/5 mx-auto h-full">
              <div className="space-y-[2vh]">
                <div className="space-y-[1vh]">
                  
                  
                </div>
                
                {/* Key Benefits */}
                
              </div>

              {/* Testimonial Section */}
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-[2vh] border border-white/20 mt-[3vh] scale-120">
                
                <p className="text-white/90 italic text-[clamp(0.975rem,2.6vw,1.14rem)] leading-relaxed mb-[1vh]">"Renovirt hat wirklich einen Unterschied gemacht. 
Die Bilder sehen top aus und sind super schnell fertig – für uns als Makler ein echter Gewinn. Die Zusammenarbeit ist unkompliziert und zuverlässig, genau so, wie man sich das wünscht."</p>
                <div className="flex items-center space-x-[1vw]">
                  <img 
                    src="/lovable-uploads/38801ff8-4a6b-4143-9948-83774f4e74c2.png" 
                    alt="Maria Schmidt" 
                    className="w-[2.8rem] h-[2.8rem] rounded-full object-cover pointer-events-none select-none"
                    draggable="false"
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  <div>
                    <p className="text-white font-semibold text-[clamp(0.975rem,2.6vw,1.14rem)]">Maria Schmidt</p>
                    <p className="text-white/70 text-[clamp(0.81rem,1.95vw,0.975rem)]">Immobilienmaklerin</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom Section - Partner Logos */}
            <div className="space-y-[1vh] scale-110">
              <p className="text-white/70 text-[clamp(0.75rem,1.8vw,0.9rem)] text-center">
                Vertraut von führenden Immobilienunternehmen
              </p>
              <div className="flex items-center justify-center space-x-[1vw] opacity-70">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-[0.5vh] flex items-center justify-center h-[3vh]">
                  <img src="/lovable-uploads/6f5d0b7d-0757-40c1-b4f9-ff3faeba1a6f.png" alt="Engel & Völkers" className="h-[2vh] max-w-[4vw] object-contain" />
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-[0.5vh] flex items-center justify-center h-[3vh]">
                  <img src="/lovable-uploads/95c8ab96-0392-4c20-95eb-dc0b0e7c87cc.png" alt="McMakler" className="h-[2vh] max-w-[4vw] object-contain" />
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-[0.5vh] flex items-center justify-center h-[3vh]">
                  <img src="/lovable-uploads/f5668da6-3c08-4577-a69b-08b71019f49e.png" alt="Von Poll Immobilien" className="h-[2vh] max-w-[4vw] object-contain" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-white/60 text-[clamp(0.625rem,1.5vw,0.75rem)]">
                  Made with ❤️ in Augsburg
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Auth;