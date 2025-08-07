import React from 'react';
import { ArrowLeft, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-[#91A56E]" />
              <span className="text-2xl font-bold text-[#393939]">Renovirt</span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Zur Startseite
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="p-8">
            {/* Title Section */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#91A56E] mb-2">
                Datenschutzerklärung
              </h1>
              <p className="text-lg text-[#393939] mb-1">
                der NPS Media GmbH für die Marke Renovirt
              </p>
              <p className="text-sm text-gray-600">
                Stand: 07.2025
              </p>
            </div>

            {/* Content Sections */}
            <div className="space-y-8 text-[#393939] leading-relaxed">
              {/* 1. Verantwortlicher */}
              <section>
                <h2 className="text-xl font-semibold text-[#91A56E] mb-4 border-b border-[#91A56E]/20 pb-2">
                  1. Name und Kontaktdaten des Verantwortlichen
                </h2>
                <p className="mb-4">
                  Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) und anderer nationaler Datenschutzgesetze der Mitgliedstaaten sowie sonstiger datenschutzrechtlicher Bestimmungen ist die:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-semibold mb-2">NPS Media GmbH</p>
                  <p>Klinkerberg 9</p>
                  <p>86152 Augsburg</p>
                  <p>Deutschland</p>
                  <p className="mt-2">
                    <strong>Vertreten durch den Geschäftsführer:</strong> Nikolas Seymour
                  </p>
                </div>
                <p className="mb-4">
                  Die Marke Renovirt wird von der NPS Media GmbH betrieben.
                </p>
              </section>

              {/* 2. Datenverarbeitung */}
              <section>
                <h2 className="text-xl font-semibold text-[#91A56E] mb-4 border-b border-[#91A56E]/20 pb-2">
                  2. Datenverarbeitung auf unserer Website und im Rahmen der Dienstleistung
                </h2>
                
                <h3 className="text-lg font-semibold text-[#91A56E] mb-3">2.1. Erhebung und Verarbeitung personenbezogener Daten</h3>
                <p className="mb-4">
                  Wir erheben und verarbeiten personenbezogene Daten unserer Kunden ausschließlich zur Auftragsabwicklung und zur Erbringung unserer digitalen Dienstleistungen. Dies umfasst insbesondere folgende Datenkategorien:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li><strong>Kontaktdaten und Unternehmensinformationen:</strong> Name, E-Mail-Adresse, Firmenname, gegebenenfalls weitere Kontaktdaten, die Sie im Rahmen der Registrierung oder Bestellung angeben.</li>
                  <li><strong>Bestelldaten:</strong> Informationen zu den von Ihnen beauftragten Leistungen (z.B. Art der Fotobearbeitung, Zusatzleistungen).</li>
                  <li><strong>Bild-Uploads und Metadaten:</strong> Die von Ihnen hochgeladenen Bilder und die darin enthaltenen Metadaten (z.B. EXIF-Daten wie Ort, Zeit, Kameramodell).</li>
                  <li><strong>Nutzungsdaten der Web-App:</strong> Informationen über Ihre Interaktion mit unserer Web-App, wie z.B. IP-Adresse, Browsertyp, Betriebssystem, Zugriffszeiten und besuchte Seiten.</li>
                </ul>
                
                <p className="mb-3 font-semibold">Die Verarbeitung dieser Daten erfolgt zu folgenden Zwecken:</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li><strong>Vertragserfüllung:</strong> Zur Durchführung der von Ihnen beauftragten Fotobearbeitung und virtuellen Immobilienvisualisierung, zur Kommunikation im Rahmen des Auftrags, zur Rechnungsstellung und Zahlungsabwicklung. Die Rechtsgrundlage hierfür ist Art. 6 Abs. 1 lit. b DSGVO.</li>
                  <li><strong>Qualitätssicherung und Serviceverbesserung:</strong> Zur Analyse von Nutzungsdaten und zur Behebung technischer Probleme, um die Stabilität und Sicherheit unserer Systeme zu gewährleisten und unsere Dienstleistungen kontinuierlich zu verbessern. Die Rechtsgrundlage hierfür ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).</li>
                  <li><strong>Kommunikation:</strong> Zur Beantwortung Ihrer Anfragen und zur Bereitstellung von Kundensupport. Die Rechtsgrundlage hierfür ist Art. 6 Abs. 1 lit. b DSGVO oder Art. 6 Abs. 1 lit. f DSGVO.</li>
                </ul>

                <h3 className="text-lg font-semibold text-[#91A56E] mb-3">2.2. Speicherdauer</h3>
                <p className="mb-4">
                  Wir speichern personenbezogene Daten nur so lange, wie es für die Erfüllung der Zwecke, für die sie erhoben wurden, erforderlich ist, oder wie es gesetzliche Vorschriften vorsehen.
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li><strong>Fertige Bilder:</strong> Die bearbeiteten Bilder werden nach Bereitstellung des Download-Links für einen Zeitraum von 365 Tagen auf unseren Servern gespeichert. Nach Ablauf dieser Frist werden die Bilder gelöscht, sofern keine andere vertragliche Vereinbarung oder gesetzliche Pflicht besteht.</li>
                  <li><strong>Rechnungsdaten und buchungsrelevante Unterlagen:</strong> Rechnungsdaten und andere buchungsrelevante Unterlagen werden gemäß den gesetzlichen Aufbewahrungsfristen nach dem Handelsgesetzbuch (HGB) und der Abgabenordnung (AO) gespeichert. Dies bedeutet in der Regel eine Aufbewahrungsfrist von 8 Jahren für Buchungsbelege (einschließlich Rechnungen) und 10 Jahren für Handelsbücher, Inventare, Jahresabschlüsse und die zu ihrem Verständnis erforderlichen Arbeitsanweisungen und Organisationsunterlagen.</li>
                  <li><strong>Sonstige personenbezogene Daten:</strong> Andere personenbezogene Daten werden gelöscht, sobald der Zweck ihrer Speicherung entfällt und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</li>
                </ul>

                <h3 className="text-lg font-semibold text-[#91A56E] mb-3">2.3. Datenhosting und Serverstandort</h3>
                <p className="mb-4">
                  Bild-Uploads, Metadaten und personenbezogene Daten (Name, E-Mail, Firma) werden auf deutschen Servern gesichert. Wir legen großen Wert darauf, dass die Datenverarbeitung innerhalb der Europäischen Union erfolgt, um die hohen Datenschutzstandards der DSGVO zu gewährleisten.
                </p>
                <p className="mb-4">
                  Für die von uns eingesetzten Drittdienstleister stellen wir sicher, dass die Datenverarbeitung entweder ebenfalls auf Servern innerhalb der EU stattfindet oder, falls dies aus technischen oder operativen Gründen nicht möglich ist, geeignete Garantien für ein angemessenes Datenschutzniveau gemäß Art. 44 ff. DSGVO bestehen.
                </p>

                <h3 className="text-lg font-semibold text-[#91A56E] mb-3">2.4. Weitergabe von Daten an Dritte und Auftragsverarbeiter</h3>
                <p className="mb-4">
                  Eine Weitergabe Ihrer personenbezogenen Daten an Dritte erfolgt ausschließlich zur Auftragsabwicklung und nur auf Basis einer gesetzlichen Erlaubnis oder Ihrer Einwilligung. Wir geben Daten nur in dem Umfang weiter, der für die Erbringung unserer Dienstleistungen unbedingt erforderlich ist.
                </p>
                <p className="mb-4">
                  Wir setzen für bestimmte Verarbeitungstätigkeiten externe Dienstleister ein, die in unserem Auftrag und gemäß unseren Weisungen personenbezogene Daten verarbeiten. Hierbei handelt es sich um sogenannte Auftragsverarbeiter im Sinne des Art. 28 DSGVO. Mit allen diesen Dienstleistern haben wir entsprechende Auftragsverarbeitungsverträge (AVV) abgeschlossen, um einen datenschutzkonformen Umgang mit Ihren Daten sicherzustellen.
                </p>
                <p className="mb-3 font-semibold">Im Folgenden finden Sie eine Übersicht der von uns eingesetzten Auftragsverarbeiter:</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li><strong>Supabase:</strong> Datenbank für Nutzerkonten & Projektdaten.</li>
                  <li><strong>Make (Integromat):</strong> Workflow-Automatisierung zwischen Web-App, Mailjet, Google Drive.</li>
                  <li><strong>Mailjet:</strong> E-Mail-Versand (Transaktions- & Marketing-E-Mails).</li>
                  <li><strong>Google Drive:</strong> Cloud-Speicher für fertige Bilder & Projektdateien.</li>
                </ul>
              </section>

              {/* 3. Ihre Rechte */}
              <section>
                <h2 className="text-xl font-semibold text-[#91A56E] mb-4 border-b border-[#91A56E]/20 pb-2">
                  3. Ihre Rechte als betroffene Person
                </h2>
                <p className="mb-4">
                  Als betroffene Person haben Sie uns gegenüber die folgenden Rechte bezüglich Ihrer personenbezogenen Daten:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li><strong>Recht auf Auskunft (Art. 15 DSGVO):</strong> Sie können eine Bestätigung darüber verlangen, ob personenbezogene Daten, die Sie betreffen, verarbeitet werden. Ist dies der Fall, haben Sie ein Recht auf Auskunft über diese personenbezogenen Daten und auf weitere Informationen.</li>
                  <li><strong>Recht auf Berichtigung (Art. 16 DSGVO):</strong> Sie haben das Recht, die unverzügliche Berichtigung unrichtiger oder die Vervollständigung unvollständiger personenbezogener Daten zu verlangen.</li>
                  <li><strong>Recht auf Löschung (Art. 17 DSGVO):</strong> Sie haben das Recht, zu verlangen, dass die Sie betreffenden personenbezogenen Daten unverzüglich gelöscht werden, sofern die Voraussetzungen des Art. 17 DSGVO erfüllt sind.</li>
                  <li><strong>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO):</strong> Sie haben das Recht, die Einschränkung der Verarbeitung zu verlangen, wenn die Voraussetzungen des Art. 18 DSGVO erfüllt sind.</li>
                  <li><strong>Recht auf Widerspruch (Art. 21 DSGVO):</strong> Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung der Sie betreffenden personenbezogenen Daten, die aufgrund von Art. 6 Abs. 1 lit. e oder f DSGVO erfolgt, Widerspruch einzulegen.</li>
                  <li><strong>Recht auf Datenübertragbarkeit (Art. 20 DSGVO):</strong> Sie haben das Recht, die Sie betreffenden personenbezogenen Daten, die Sie uns bereitgestellt haben, in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten, und Sie haben das Recht, diese Daten einem anderen Verantwortlichen ohne Behinderung zu übermitteln.</li>
                  <li><strong>Recht auf Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO):</strong> Unbeschadet eines anderweitigen verwaltungsrechtlichen oder gerichtlichen Rechtsbehelfs steht Ihnen das Recht auf Beschwerde bei einer Aufsichtsbehörde zu, wenn Sie der Ansicht sind, dass die Verarbeitung der Sie betreffenden personenbezogenen Daten gegen die DSGVO verstößt.</li>
                </ul>
                <p className="mb-4">
                  Zur Geltendmachung Ihrer Rechte können Sie sich jederzeit an die unter Punkt 1 genannten Kontaktdaten des Verantwortlichen wenden.
                </p>
              </section>

              {/* 4. Newsletter */}
              <section>
                <h2 className="text-xl font-semibold text-[#91A56E] mb-4 border-b border-[#91A56E]/20 pb-2">
                  4. Newsletter-Werbung
                </h2>
                <p className="mb-4">
                  Wir bieten Ihnen die Möglichkeit, sich für unseren Newsletter anzumelden, um Informationen über unsere Dienstleistungen, Angebote und Neuigkeiten von Renovirt zu erhalten.
                </p>
                <p className="mb-4">
                  Die Anmeldung zum Newsletter erfolgt ausschließlich über das sogenannte Double-Opt-in-Verfahren. Dies bedeutet, dass Ihre Anmeldung erst dann wirksam wird, wenn Sie diese über einen Bestätigungslink in einer an Ihre angegebene E-Mail-Adresse gesendeten Bestätigungs-E-Mail explizit bestätigt haben.
                </p>
                <p className="mb-4">
                  Für die Newsletter-Anmeldung verarbeiten wir Ihre E-Mail-Adresse und gegebenenfalls Ihren Namen. Zusätzlich speichern wir die IP-Adresse sowie den Zeitpunkt der Anmeldung und der Bestätigung, um die erteilte Einwilligung nachweisen zu können (Rechenschaftspflicht gemäß Art. 5 Abs. 2 DSGVO).
                </p>
                <p className="mb-4">
                  Die Verarbeitung Ihrer Daten für den Newsletter-Versand erfolgt auf Grundlage Ihrer Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO. Sie können Ihre Einwilligung zum Erhalt des Newsletters jederzeit mit Wirkung für die Zukunft widerrufen. Einen Abmeldelink finden Sie in jeder Newsletter-E-Mail.
                </p>
              </section>

              {/* 5. Cookies */}
              <section>
                <h2 className="text-xl font-semibold text-[#91A56E] mb-4 border-b border-[#91A56E]/20 pb-2">
                  5. Tracking-Cookies und ähnliche Technologien
                </h2>
                <p className="mb-4">
                  Unsere Website verwendet Cookies und ähnliche Technologien, um die Nutzung unserer Dienste zu optimieren und bestimmte Funktionen bereitzustellen. Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert werden.
                </p>
                <p className="mb-4">
                  Wir unterscheiden zwischen technisch notwendigen Cookies und nicht-notwendigen Cookies:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li><strong>Technisch notwendige Cookies:</strong> Diese Cookies sind für den grundlegenden Betrieb unserer Website unerlässlich (z.B. Speicherung von Log-in-Informationen, Warenkorbfunktionen). Ihre Verwendung ist auf Grundlage unseres berechtigten Interesses gemäß Art. 6 Abs. 1 lit. f DSGVO zulässig. Für diese Cookies ist keine explizite Einwilligung erforderlich, jedoch informieren wir Sie über deren Einsatz.</li>
                  <li><strong>Nicht-notwendige Cookies (Tracking-Cookies):</strong> Hierzu gehören Cookies für Analyse-, Marketing- und Personalisierungszwecke (z.B. zur Messung der Reichweite, zur Anzeige personalisierter Werbung oder zur Verbesserung der Nutzererfahrung). Die Speicherung oder der Zugriff auf Informationen in Ihrem Endgerät durch diese Cookies erfordert gemäß § 25 Abs. 1 des Telekommunikation-Digitale-Dienste-Datenschutz-Gesetzes (TTDSG) Ihre ausdrückliche Einwilligung.</li>
                </ul>
                <p className="mb-4">
                  Wir nutzen ein Cookie Consent Management Platform (CMP), um Ihre Einwilligung für nicht-notwendige Cookies einzuholen und zu verwalten. Die Einwilligung muss aktiv, freiwillig, informiert, spezifisch und eindeutig erfolgen. Dies bedeutet, dass keine Cookies ohne Ihre aktive Zustimmung gesetzt werden dürfen und vorausgewählte Kästchen unzulässig sind.
                </p>
                <p className="mb-4">
                  Die Ablehnung von Cookies muss dabei genauso einfach möglich sein wie deren Annahme. Sie haben jederzeit die Möglichkeit, Ihre Cookie-Einstellungen über einen Link im Footer unserer Website anzupassen und Ihre erteilte Einwilligung zu widerrufen.
                </p>
              </section>

              {/* 6. Datensicherheit */}
              <section>
                <h2 className="text-xl font-semibold text-[#91A56E] mb-4 border-b border-[#91A56E]/20 pb-2">
                  6. Datensicherheit
                </h2>
                <p className="mb-4">
                  Wir treffen geeignete technische und organisatorische Maßnahmen gemäß Art. 32 DSGVO, um Ihre personenbezogenen Daten vor unbeabsichtigter oder unrechtmäßiger Zerstörung, Verlust, Veränderung, unbefugter Offenlegung oder unbefugtem Zugriff zu schützen.
                </p>
                <p className="mb-3 font-semibold">Zu diesen Maßnahmen gehören insbesondere:</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li><strong>Verschlüsselung:</strong> Daten werden sowohl während der Übertragung (z.B. mittels SSL/TLS-Verschlüsselung) als auch bei der Speicherung verschlüsselt.</li>
                  <li><strong>Zugriffsbeschränkungen:</strong> Der Zugriff auf personenbezogene Daten ist auf autorisiertes Personal beschränkt, das die Daten zur Erfüllung seiner Aufgaben benötigt.</li>
                  <li><strong>Datensicherung und Wiederherstellbarkeit:</strong> Wir führen regelmäßige Backups Ihrer Daten durch, um die Wiederherstellbarkeit im Falle eines Datenverlusts zu gewährleisten.</li>
                  <li><strong>Sicherheitsupdates:</strong> Unsere Systeme und Anwendungen werden regelmäßig mit Sicherheitsupdates versehen, um bekannte Schwachstellen zu schließen.</li>
                  <li><strong>Vertraulichkeitsvereinbarungen:</strong> Unsere Mitarbeiter und externe Dienstleister, die Zugang zu personenbezogenen Daten haben, sind zur Vertraulichkeit verpflichtet.</li>
                </ul>
              </section>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t bg-gray-50 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#91A56E]" />
              <span className="font-semibold text-[#393939]">Renovirt</span>
              <span className="text-sm text-gray-600">by NPS Media GmbH</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a 
                href="/impressum" 
                className="text-[#91A56E] hover:underline transition-colors"
              >
                Impressum
              </a>
              <a 
                href="/agb" 
                className="text-[#91A56E] hover:underline transition-colors"
              >
                AGB
              </a>
              <span className="text-gray-600">
                © 2025 NPS Media GmbH. Alle Rechte vorbehalten.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;