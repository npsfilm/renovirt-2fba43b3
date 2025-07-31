import React from 'react';
import { ArrowLeft, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const AGB = () => {
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
                Allgemeine Geschäftsbedingungen (AGB)
              </h1>
              <p className="text-lg text-[#393939] mb-1">
                der NPS Media GmbH für die Marke Renovirt
              </p>
              <p className="text-sm text-gray-600">
                Stand: 01.2025
              </p>
            </div>

            {/* Content Sections */}
            <div className="space-y-8 text-[#393939] leading-relaxed">
              {/* § 1 */}
              <section>
                <h2 className="text-xl font-semibold text-[#91A56E] mb-4 border-b border-[#91A56E]/20 pb-2">
                  § 1 Geltungsbereich und Vertragspartner
                </h2>
                <p className="mb-4">
                  Diese Allgemeinen Geschäftsbedingungen finden ausschließlich Anwendung auf Verträge zwischen der NPS Media GmbH (im Folgenden „Renovirt") und Unternehmern im Sinne des § 14 des Bürgerlichen Gesetzbuches (BGB). Dies umfasst insbesondere Makler, Architekturbüros, Fotografen und andere Geschäftskunden, die die digitalen Dienstleistungen von Renovirt in Ausübung ihrer gewerblichen oder selbstständigen beruflichen Tätigkeit in Anspruch nehmen. Die vorliegenden AGB gelten nicht für Verträge mit Verbrauchern.
                </p>
              </section>

              {/* § 2 */}
              <section>
                <h2 className="text-xl font-semibold text-[#91A56E] mb-4 border-b border-[#91A56E]/20 pb-2">
                  § 2 Vertragsgegenstand und Leistungsumfang
                </h2>
                <p className="mb-4">
                  Renovirt bietet digitale Dienstleistungen im Bereich der Fotobearbeitung und virtuellen Immobilienvisualisierung an. Der Vertragsgegenstand umfasst die digitale Bearbeitung von Fotos, einschließlich Optionen wie Basic-/Premium-Bearbeitung, optionalen Zusatzleistungen wie Objektentfernung und Himmelsaustausch. Die Leistungen werden ausschließlich in digitaler Form erbracht; eine Lieferung physischer Produkte erfolgt nicht.
                </p>
              </section>

              {/* § 3 */}
              <section>
                <h2 className="text-xl font-semibold text-[#91A56E] mb-4 border-b border-[#91A56E]/20 pb-2">
                  § 3 Bestellvorgang und Vertragsschluss
                </h2>
                <p className="mb-4">
                  Der Bestellvorgang für die Dienstleistungen von Renovirt erfolgt über eine Web-App, die den Upload von Bildern und das Ausfüllen eines Formulars ermöglicht. Die im Formular angezeigte Preisvorschau stellt eine unverbindliche Kostenschätzung dar. Der Vertrag kommt erst durch die manuelle finale Prüfung der Bestellung und die anschließende Rechnungsstellung durch Renovirt zustande.
                </p>
              </section>

              {/* § 4 */}
              <section>
                <h2 className="text-xl font-semibold text-[#91A56E] mb-4 border-b border-[#91A56E]/20 pb-2">
                  § 4 Preise und Zahlungsbedingungen
                </h2>
                <p className="mb-4">
                  Die im Bestellformular angezeigte Preisvorschau dient lediglich der Orientierung und ist unverbindlich. Der verbindliche Preis für die Dienstleistung wird erst nach der manuellen Prüfung der Bestellung durch Renovirt festgelegt und in der finalen Rechnung ausgewiesen.
                </p>
                <p className="mb-4">
                  Die Zahlung der Leistungen erfolgt ausschließlich auf Rechnung, eine Vorkasse ist nicht vorgesehen. Die Rechnungen sind innerhalb einer festgelegten Frist, beispielsweise 14 Tage netto, ohne Abzug zur Zahlung fällig. Im Falle eines Zahlungsverzugs gelten die gesetzlichen Bestimmungen.
                </p>
              </section>

              {/* § 5 */}
              <section>
                <h2 className="text-xl font-semibold text-[#91A56E] mb-4 border-b border-[#91A56E]/20 pb-2">
                  § 5 Lieferung und Abnahme der Leistungen
                </h2>
                <p className="mb-4">
                  Die bearbeiteten Bilder werden dem Kunden als Download-Link per E-Mail innerhalb von 48 Stunden nach Vertragsschluss bzw. Zahlungseingang zugesandt. Bei der Berechnung dieser Frist werden Wochenenden (Samstag und Sonntag) und gesetzliche Feiertage am Sitz von Renovirt nicht mitgerechnet. Fällt der Beginn der Frist oder ein Teil der 48-Stunden-Frist auf ein Wochenende oder einen gesetzlichen Feiertag, so wird die Frist unterbrochen und läuft ab dem nächsten Werktag um 9:00 Uhr weiter.
                </p>
                <p className="mb-4">
                  <strong>Beispiele für die Berechnung der Lieferfrist:</strong>
                </p>
                <p className="mb-4">
                  Wenn Sie eine Bestellung am Freitag um 20:00 Uhr aufgeben, läuft die Frist am Freitag noch 4 Stunden (bis 24:00 Uhr). Die verbleibenden 44 Stunden beginnen am darauffolgenden Montag um 9:00 Uhr zu laufen. Die Lieferung der bearbeiteten Bilder erfolgt dann spätestens am Mittwoch um 05:00 Uhr.
                </p>
                <p className="mb-4">
                  Wenn Sie eine Bestellung am Samstag aufgeben, wird die 48-Stunden-Frist ab dem darauffolgenden Montag um 9:00 Uhr berechnet. Die Lieferung der bearbeiteten Bilder erfolgt dann spätestens am Mittwoch um 9:00 Uhr.
                </p>
                <p className="mb-4">
                  Die Lieferung der digitalen Leistung erfolgt mit der Bereitstellung des Download-Links. Der Kunde ist grundsätzlich verpflichtet, die gelieferte Leistung unverzüglich auf Mängel zu prüfen und diese Renovirt anzuzeigen. Erfolgt keine fristgerechte Mängelrüge, gelten die Leistungen als abgenommen, es sei denn, Renovirt hat einen Mangel arglistig verschwiegen oder eine bestimmte Eigenschaft zugesichert.
                </p>
                <p className="mb-4">
                  Lieferfristen verlängern sich angemessen bei höherer Gewalt, Arbeitskämpfen, unvorhersehbaren Störungen oder sonstigen von Renovirt nicht zu vertretenden Hindernissen, die nach Vertragsschluss eintreten. Dies gilt auch, wenn solche Umstände bei Subunternehmern von Renovirt eintreten. Renovirt wird den Kunden über solche Verzögerungen unverzüglich informieren. Schadensersatzansprüche des Kunden wegen Lieferverzögerungen sind ausgeschlossen, es sei denn, die Verzögerung beruht auf Vorsatz oder grober Fahrlässigkeit von Renovirt oder der Verletzung wesentlicher Vertragspflichten. Im Übrigen gelten die Regelungen zur Haftung in § 8 dieser AGB.
                </p>
              </section>

              {/* § 6 */}
              <section>
                <h2 className="text-xl font-semibold text-[#91A56E] mb-4 border-b border-[#91A56E]/20 pb-2">
                  § 6 Stornierung und Kündigung
                </h2>
                <p className="mb-4">
                  Renovirt bietet seinen Kunden eine spezifische Stornoregelung an: Eine Stornierung der Bestellung ist bis 30 Minuten nach Bestelleingang kostenlos möglich. Erfolgt die Stornierung nach Ablauf dieser Frist, fallen Stornokosten in Höhe von 70 % des Auftragswertes an.
                </p>
                <p className="mb-4">
                  Dem Kunden wird ausdrücklich das Recht eingeräumt, nachzuweisen, dass Renovirt durch die Stornierung tatsächlich ein wesentlich geringerer Schaden entstanden ist oder gar kein Schaden vorliegt.
                </p>
              </section>

              {/* § 7 */}
              <section>
                <h2 className="text-xl font-semibold text-[#91A56E] mb-4 border-b border-[#91A56E]/20 pb-2">
                  § 7 Urheberrecht und Nutzungsrechte
                </h2>
                <p className="mb-4">
                  Das Urheberrecht an den vom Kunden hochgeladenen Originalbildern verbleibt beim Kunden oder dem jeweiligen Urheber, sofern der Kunde nicht selbst der Urheber ist. Der Kunde versichert mit dem Upload, dass er zur Bearbeitung der Bilder berechtigt ist und Renovirt die notwendigen Nutzungsrechte für die Durchführung der beauftragten Dienstleistung einräumt. Der Kunde stellt Renovirt von sämtlichen Ansprüchen Dritter frei, die auf einer Verletzung von Urheber- oder sonstigen Schutzrechten an den hochgeladenen Originalbildern beruhen.
                </p>
                <p className="mb-4">
                  Renovirt erhält die für die Bearbeitung erforderlichen Nutzungsrechte. Nach vollständiger Bezahlung des vereinbarten Honorars räumt Renovirt dem Kunden die umfassenden, nicht-exklusiven, räumlich und zeitlich unbeschränkten Nutzungsrechte an den bearbeiteten Bildern für die vertraglich vorgesehenen Zwecke ein. Eine Nutzung der bearbeiteten Bilder durch den Kunden vor vollständiger Bezahlung ist nicht gestattet.
                </p>
                <p className="mb-4">
                  Renovirt ist berechtigt, die erstellten Lichtbilder zur Bewerbung der eigenen Tätigkeit zu verwenden, beispielsweise auf der Website, in sozialen Medien oder in Präsentationen. Der Kunde erteilt hierfür seine ausdrückliche und unwiderrufliche Zustimmung und verzichtet auf die Geltendmachung jeglicher Ansprüche, insbesondere aus dem Recht am eigenen Bild. Der Kunde kann dieser Nutzung für Werbezwecke jederzeit widersprechen; ein solcher Widerspruch hat keine Auswirkungen auf die vertraglich vereinbarten Leistungen. Eine Namensnennung Renovirts als Bearbeiter der Bilder ist bei Veröffentlichung der bearbeiteten Bilder durch den Kunden nicht zwingend erforderlich, aber wünschenswert.
                </p>
              </section>

              {/* § 8 */}
              <section>
                <h2 className="text-xl font-semibold text-[#91A56E] mb-4 border-b border-[#91A56E]/20 pb-2">
                  § 8 Gewährleistung und Haftung
                </h2>
                <p className="mb-4">
                  Renovirt gewährleistet, dass die erbrachten digitalen Dienstleistungen den vertraglich vereinbarten Spezifikationen entsprechen und frei von Mängeln sind, die den Wert oder die Tauglichkeit für die gewöhnliche oder die vertraglich vorausgesetzte Verwendung aufheben oder mindern.
                </p>
                <p className="mb-4">
                  Die Haftung von Renovirt für Schäden, die durch leichte Fahrlässigkeit verursacht wurden, ist ausgeschlossen, es sei denn, es handelt sich um Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit oder um die Verletzung wesentlicher Vertragspflichten (Kardinalpflichten). Bei Verletzung einer Kardinalpflicht haftet Renovirt auch bei leichter Fahrlässigkeit, jedoch begrenzt auf den vertragstypischen, vorhersehbaren Schaden.
                </p>
                <p className="mb-4">
                  Renovirt haftet nicht für Datenverluste, die auf einer Verletzung der Mitwirkungspflichten des Kunden beruhen, insbesondere der Pflicht zur regelmäßigen Datensicherung. Eine Haftung für Schäden, die durch höhere Gewalt, Störungen der Internetverbindung oder rechtswidrige Eingriffe Dritter entstehen, ist ebenfalls ausgeschlossen, sofern diese nicht im Verantwortungsbereich von Renovirt liegen.
                </p>
              </section>

              {/* § 9 */}
              <section>
                <h2 className="text-xl font-semibold text-[#91A56E] mb-4 border-b border-[#91A56E]/20 pb-2">
                  § 9 Mitwirkungspflichten des Kunden
                </h2>
                <p className="mb-4">
                  Der Kunde hat folgende Mitwirkungspflichten zu erfüllen:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>
                    <strong>Bereitstellung von Material:</strong> Der Kunde ist verpflichtet, das für die Bearbeitung erforderliche Bildmaterial in der vereinbarten Qualität und im vereinbarten Format fristgerecht bereitzustellen.
                  </li>
                  <li>
                    <strong>Rechte an den Bildern:</strong> Der Kunde versichert, dass er über alle erforderlichen Rechte an den hochgeladenen Bildern verfügt, um diese von Renovirt bearbeiten zu lassen, und dass die Bilder keine Rechte Dritter verletzen. Er stellt Renovirt von allen Ansprüchen Dritter frei, die aus einer Verletzung dieser Pflicht resultieren.
                  </li>
                  <li>
                    <strong>Datensicherung:</strong> Der Kunde ist für die regelmäßige und ausreichende Sicherung seiner eigenen Daten, insbesondere der hochgeladenen Originalbilder und der heruntergeladenen bearbeiteten Bilder, selbst verantwortlich.
                  </li>
                  <li>
                    <strong>Zugangsdaten:</strong> Der Kunde ist verpflichtet, seine Zugangsdaten zur Web-App vertraulich zu behandeln und vor dem Zugriff Dritter zu schützen.
                  </li>
                  <li>
                    <strong>Mängelrüge:</strong> Der Kunde hat die gelieferten Leistungen unverzüglich nach Erhalt auf Mängel zu prüfen und diese Renovirt schriftlich anzuzeigen.
                  </li>
                </ul>
              </section>

              {/* § 10 */}
              <section>
                <h2 className="text-xl font-semibold text-[#91A56E] mb-4 border-b border-[#91A56E]/20 pb-2">
                  § 10 Vertraulichkeit und Datenschutz
                </h2>
                <p className="mb-4">
                  Renovirt verpflichtet sich, alle im Rahmen der Geschäftsbeziehung erhaltenen Informationen und Daten des Kunden, insbesondere die hochgeladenen Bilder und personenbezogenen Daten, vertraulich zu behandeln. Die Einhaltung der Datenschutzbestimmungen, insbesondere der Datenschutz-Grundverordnung (DSGVO), wird gewährleistet.
                </p>
                <p className="mb-4">
                  Detaillierte Informationen zur Erhebung, Verarbeitung und Nutzung personenbezogener Daten finden sich in der gesonderten Datenschutzerklärung von Renovirt.
                </p>
              </section>

              {/* § 11 */}
              <section>
                <h2 className="text-xl font-semibold text-[#91A56E] mb-4 border-b border-[#91A56E]/20 pb-2">
                  § 11 Schlussbestimmungen
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-[#91A56E] mb-2">Anwendbares Recht:</h3>
                    <p>Auf diese Allgemeinen Geschäftsbedingungen und alle Rechtsbeziehungen zwischen Renovirt und dem Kunden findet ausschließlich das Recht der Bundesrepublik Deutschland Anwendung, unter Ausschluss des UN-Kaufrechts.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#91A56E] mb-2">Gerichtsstand:</h3>
                    <p>Ausschließlicher Gerichtsstand für alle Streitigkeiten aus oder im Zusammenhang mit diesem Vertrag ist Augsburg, sofern der Kunde Kaufmann, eine juristische Person des öffentlichen Rechts oder ein öffentlich-rechtliches Sondervermögen ist.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#91A56E] mb-2">Salvatorische Klausel:</h3>
                    <p>Sollten einzelne Bestimmungen dieser Allgemeinen Geschäftsbedingungen ganz oder teilweise unwirksam sein oder werden, so wird hierdurch die Gültigkeit der übrigen Bestimmungen nicht berührt. Die unwirksame Bestimmung ist durch eine wirksame Bestimmung zu ersetzen, die dem wirtschaftlichen Zweck der unwirksamen Bestimmung am nächsten kommt.</p>
                  </div>
                </div>
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
                href="/privacy" 
                className="text-[#91A56E] hover:underline transition-colors"
              >
                Datenschutzerklärung
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

export default AGB;