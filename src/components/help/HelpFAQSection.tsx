
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Package, 
  CreditCard, 
  Upload, 
  Settings, 
  User, 
  FileImage,
  Clock,
  HelpCircle
} from 'lucide-react';

const faqCategories = [
  {
    id: 'packages',
    title: 'Pakete & Preise',
    icon: Package,
    description: 'Informationen zu unseren Bearbeitungspaketen',
    questions: [
      {
        question: 'Welche Pakete bieten Sie an?',
        answer: 'Wir bieten zwei Hauptpakete: Basic-Paket mit Farb-/Belichtungskorrektur und Perspektivkorrektur (48h Lieferzeit) und Premium-Paket mit allen Basic-Features plus Objektentfernung und Retusche (24h Lieferzeit).'
      },
      {
        question: 'Wie funktionieren die Staffelrabatte?',
        answer: 'Wir gewähren Staffelrabatte ab 10 Bildern: 5% ab 10 Bildern, 10% ab 20 Bildern, 15% ab 30 Bildern und 25% ab 40 Bildern.'
      },
      {
        question: 'Was ist der Unterschied zwischen Basic und Premium?',
        answer: 'Das Basic-Paket umfasst Farb-/Belichtungskorrektur und Perspektivkorrektur. Das Premium-Paket enthält zusätzlich Objektentfernung, Retusche und eine schnellere Lieferzeit von 24h statt 48h.'
      }
    ]
  },
  {
    id: 'upload',
    title: 'Upload & Dateiformate',
    icon: Upload,
    description: 'Alles rund um den Bildupload',
    questions: [
      {
        question: 'Welche Dateiformate werden unterstützt?',
        answer: 'Wir unterstützen alle gängigen Bildformate: JPEG, PNG, TIFF, RAW-Dateien (CR2, NEF, ARW, etc.). Die maximale Dateigröße beträgt 50MB pro Bild.'
      },
      {
        question: 'Wie lade ich meine Bilder hoch?',
        answer: 'Nach der Paketauswahl gelangen Sie zum Upload-Bereich. Dort können Sie Ihre Bilder per Drag & Drop oder über den "Dateien auswählen" Button hochladen.'
      },
      {
        question: 'Was passiert mit meinen Bildern nach der Bearbeitung?',
        answer: 'Ihre Originalbilder und bearbeiteten Versionen werden 30 Tage nach Fertigstellung auf unseren deutschen Servern gespeichert, danach automatisch gelöscht.'
      }
    ]
  },
  {
    id: 'payment',
    title: 'Zahlung & Abrechnung',
    icon: CreditCard,
    description: 'Zahlungsmethoden und Abrechnungsfragen',
    questions: [
      {
        question: 'Welche Zahlungsmethoden akzeptieren Sie?',
        answer: 'Wir akzeptieren alle gängigen Kreditkarten (Visa, Mastercard, American Express), PayPal, SEPA-Lastschrift und auf Anfrage Rechnung für Geschäftskunden.'
      },
      {
        question: 'Wann wird die Zahlung eingezogen?',
        answer: 'Die Zahlung erfolgt nach dem Upload Ihrer Bilder und der finalen Bestätigung Ihrer Bestellung. Sie erhalten vorher eine detaillierte Zusammenfassung.'
      },
      {
        question: 'Kann ich eine Rechnung erhalten?',
        answer: 'Ja, Sie erhalten automatisch eine Rechnung per E-Mail nach Zahlungseingang. Für Geschäftskunden können wir auch Rechnungen mit verlängertem Zahlungsziel ausstellen.'
      }
    ]
  },
  {
    id: 'delivery',
    title: 'Lieferung & Bearbeitung',
    icon: Clock,
    description: 'Lieferzeiten und Bearbeitungsprozess',
    questions: [
      {
        question: 'Wie lange dauert die Bearbeitung?',
        answer: 'Basic-Paket: 48 Stunden, Premium-Paket: 24 Stunden. Die Zeit beginnt nach Zahlungseingang und vollständigem Upload aller Bilder.'
      },
      {
        question: 'Wie erhalte ich meine bearbeiteten Bilder?',
        answer: 'Sie erhalten eine E-Mail mit einem sicheren Download-Link, sobald Ihre Bilder fertig bearbeitet sind. Der Link ist 30 Tage gültig.'
      },
      {
        question: 'Was passiert, wenn ich mit dem Ergebnis nicht zufrieden bin?',
        answer: 'Wir bieten eine kostenlose Nachbearbeitung an, falls das Ergebnis nicht Ihren Erwartungen entspricht. Kontaktieren Sie uns innerhalb von 7 Tagen nach Erhalt.'
      }
    ]
  },
  {
    id: 'account',
    title: 'Konto & Profile',
    icon: User,
    description: 'Kontoverwaltung und Profileinstellungen',
    questions: [
      {
        question: 'Wie erstelle ich ein Konto?',
        answer: 'Klicken Sie auf "Registrieren" und geben Sie Ihre E-Mail-Adresse und ein sicheres Passwort ein. Sie erhalten eine Bestätigungsmail zur Aktivierung.'
      },
      {
        question: 'Kann ich meine Bestellhistorie einsehen?',
        answer: 'Ja, in Ihrem Dashboard finden Sie alle vergangenen Bestellungen mit Status, Datum und Download-Links für bereits bearbeitete Bilder.'
      },
      {
        question: 'Wie ändere ich meine Kontodaten?',
        answer: 'Gehen Sie zu "Profil" in Ihrem Dashboard. Dort können Sie alle Kontoinformationen, Rechnungsadresse und Passwort ändern.'
      }
    ]
  },
  {
    id: 'technical',
    title: 'Technische Fragen',
    icon: Settings,
    description: 'Technischer Support und Problembehebung',
    questions: [
      {
        question: 'Der Upload bricht ab oder funktioniert nicht',
        answer: 'Prüfen Sie Ihre Internetverbindung und die Dateigröße (max. 50MB). Bei anhaltenden Problemen leeren Sie den Browser-Cache oder versuchen Sie einen anderen Browser.'
      },
      {
        question: 'Ich kann mich nicht anmelden',
        answer: 'Prüfen Sie E-Mail und Passwort. Falls Sie Ihr Passwort vergessen haben, nutzen Sie den "Passwort vergessen" Link. Kontaktieren Sie uns bei anhaltenden Problemen.'
      },
      {
        question: 'Die Website lädt nicht korrekt',
        answer: 'Aktualisieren Sie die Seite (F5), leeren Sie den Browser-Cache oder versuchen Sie einen anderen Browser. Die meisten Probleme lösen sich dadurch.'
      }
    ]
  }
];

const HelpFAQSection = () => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-light text-foreground">
          Häufig gestellte Fragen
        </h2>
        <p className="text-lg text-muted-foreground">
          Finden Sie schnell Antworten auf die wichtigsten Fragen
        </p>
      </div>

      {/* FAQ Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {faqCategories.map((category) => (
          <Card key={category.id} className="h-full hover:shadow-md transition-shadow">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <category.icon className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">{category.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-sm">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HelpFAQSection;
