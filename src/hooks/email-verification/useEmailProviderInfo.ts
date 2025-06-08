
export interface EmailProviderInfo {
  name: string;
  url: string;
  tips: string[];
}

export const useEmailProviderInfo = () => {
  // Email provider detection for helpful links
  const getEmailProviderInfo = (email: string): EmailProviderInfo | null => {
    const domain = email.split('@')[1]?.toLowerCase();
    const providers: Record<string, EmailProviderInfo> = {
      'gmail.com': { 
        name: 'Gmail', 
        url: 'https://mail.google.com',
        tips: ['Prüfen Sie auch den "Werbung" und "Spam" Tab']
      },
      'outlook.com': { 
        name: 'Outlook', 
        url: 'https://outlook.live.com',
        tips: ['Schauen Sie in den "Junk-E-Mail" Ordner']
      },
      'hotmail.com': { 
        name: 'Outlook', 
        url: 'https://outlook.live.com',
        tips: ['Schauen Sie in den "Junk-E-Mail" Ordner']
      },
      'web.de': { 
        name: 'Web.de', 
        url: 'https://web.de',
        tips: ['Prüfen Sie den "Spam" Ordner']
      },
      'gmx.de': { 
        name: 'GMX', 
        url: 'https://gmx.de',
        tips: ['Überprüfen Sie den "Spamverdacht" Ordner']
      }
    };
    return providers[domain] || null;
  };

  return {
    getEmailProviderInfo
  };
};
