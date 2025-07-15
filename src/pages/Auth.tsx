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
              <img src="/lovable-uploads/9ec7c3ad-34b9-4fea-a9e9-0d4a0a5532e9.png" alt="Renovirt Logo" className="h-[3vh] mx-auto mb-[1vh]" />
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
          <div className="absolute inset-0 transform rotate-[10deg] scale-125 origin-center bg-cover bg-center bg-no-repeat" style={{
          backgroundImage: 'url(/lovable-uploads/fd670a2b-70f6-44eb-89b6-316c7c4280b6.png)'
        }} />
          
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/70" />
          
          {/* Additional gradient overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
          
          <div className="relative z-10 flex flex-col justify-between p-[3vh] text-white h-full w-full">
            {/* Top Section - Main Content */}
            <div className="flex flex-col justify-center flex-1">
              <div className="space-y-[2vh]">
                <div className="space-y-[1vh]">
                  <h2 className="text-[clamp(1rem,4vw,1.5rem)] font-bold text-accent leading-tight">
                    Professionelle Bildbearbeitung für Immobilien – in 48 Stunden.
                  </h2>
                  <p className="text-[clamp(0.875rem,2.5vw,1rem)] text-white/90 leading-relaxed">
                    Melden Sie sich an, um neue Aufträge zu starten oder Ihre Projekte zu verwalten.
                  </p>
                </div>
                
                {/* Key Benefits */}
                <div className="space-y-[1vh]">
                  <div className="flex items-center space-x-[1vw] text-white/95">
                    <div className="w-[1rem] h-[1rem] text-accent flex-shrink-0">✓</div>
                    <span className="text-[clamp(0.75rem,2vw,0.875rem)] font-medium">Über 30.000 bearbeitete Bilder</span>
                  </div>
                  <div className="flex items-center space-x-[1vw] text-white/95">
                    <div className="w-[1rem] h-[1rem] text-accent flex-shrink-0">✓</div>
                    <span className="text-[clamp(0.75rem,2vw,0.875rem)] font-medium">48h Bearbeitungszeit</span>
                  </div>
                  <div className="flex items-center space-x-[1vw] text-white/95">
                    <div className="w-[1rem] h-[1rem] text-accent flex-shrink-0">✓</div>
                    <span className="text-[clamp(0.75rem,2vw,0.875rem)] font-medium">Bearbeitung durch erfahrene Immobilien-Editor:innen</span>
                  </div>
                </div>
              </div>

              {/* Testimonial Section */}
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-[2vh] border border-white/20 mt-[3vh]">
                
                <p className="text-white/90 italic text-[clamp(0.75rem,2vw,0.875rem)] leading-relaxed mb-[1vh]">
                  "Renovirt hat unsere Immobilienvermarktung revolutioniert. Die Bildqualität ist außergewöhnlich und die Bearbeitungszeit unschlagbar!"
                </p>
                <div className="flex items-center space-x-[1vw]">
                  <div className="w-[2rem] h-[2rem] bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center text-white font-bold text-[clamp(0.625rem,1.5vw,0.75rem)]">
                    MS
                  </div>
                  <div>
                    <p className="text-white font-semibold text-[clamp(0.75rem,2vw,0.875rem)]">Maria Schmidt</p>
                    <p className="text-white/70 text-[clamp(0.625rem,1.5vw,0.75rem)]">Immobilienmaklerin</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom Section - Partner Logos */}
            <div className="space-y-[1vh]">
              <p className="text-white/70 text-[clamp(0.625rem,1.5vw,0.75rem)] text-center">
                Vertraut von führenden Immobilienunternehmen
              </p>
              <div className="flex items-center justify-center space-x-[1vw] opacity-70">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-[0.5vh] flex items-center justify-center h-[3vh]">
                  <img src="/lovable-uploads/3edc84fd-1de7-4266-ac80-24a4925dd856.png" alt="Engel & Völkers" className="h-[2vh] max-w-[4vw] object-contain" />
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-[0.5vh] flex items-center justify-center h-[3vh]">
                  <img src="/lovable-uploads/e6bd750d-a87a-45ce-84cf-065e03bd72c7.png" alt="Century 21" className="h-[2vh] max-w-[4vw] object-contain" />
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-[0.5vh] flex items-center justify-center h-[3vh]">
                  <img src="/lovable-uploads/8c510237-f833-4180-8a51-f663f2012aee.png" alt="Volksbank" className="h-[2vh] max-w-[4vw] object-contain" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-white/60 text-[clamp(0.625rem,1.5vw,0.75rem)]">
                  Made with love in Augsburg.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Auth;