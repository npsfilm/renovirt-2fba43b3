-- Insert comprehensive legal documents into help_documents table for better AI search

-- Insert AGB sections
INSERT INTO help_documents (title, content, file_name, is_active) VALUES 
(
  'AGB - Geltungsbereich und Vertragspartner',
  '§ 1 Geltungsbereich und Vertragspartner: Diese Allgemeinen Geschäftsbedingungen finden ausschließlich Anwendung auf Verträge zwischen der NPS Media GmbH (im Folgenden „Renovirt") und Unternehmern im Sinne des § 14 des Bürgerlichen Gesetzbuches (BGB). Dies umfasst insbesondere Makler, Architekturbüros, Fotografen und andere Geschäftskunden, die die digitalen Dienstleistungen von Renovirt in Ausübung ihrer gewerblichen oder selbstständigen beruflichen Tätigkeit in Anspruch nehmen. Die vorliegenden AGB gelten nicht für Verträge mit Verbrauchern.',
  'agb_geltungsbereich.txt',
  true
),
(
  'AGB - Vertragsgegenstand und Leistungsumfang',
  '§ 2 Vertragsgegenstand und Leistungsumfang: Renovirt bietet digitale Dienstleistungen im Bereich der Fotobearbeitung und virtuellen Immobilienvisualisierung an. Der Vertragsgegenstand umfasst die digitale Bearbeitung von Fotos, einschließlich Optionen wie Basic-/Premium-Bearbeitung, optionalen Zusatzleistungen wie Objektentfernung und Himmelsaustausch. Die Leistungen werden ausschließlich in digitaler Form erbracht; eine Lieferung physischer Produkte erfolgt nicht.',
  'agb_leistungsumfang.txt',
  true
),
(
  'AGB - Bestellvorgang und Vertragsschluss',
  '§ 3 Bestellvorgang und Vertragsschluss: Der Bestellvorgang für die Dienstleistungen von Renovirt erfolgt über eine Web-App, die den Upload von Bildern und das Ausfüllen eines Formulars ermöglicht. Die im Formular angezeigte Preisvorschau stellt eine unverbindliche Kostenschätzung dar. Der Vertrag kommt erst durch die manuelle finale Prüfung der Bestellung und die anschließende Rechnungsstellung durch Renovirt zustande.',
  'agb_vertragsschluss.txt',
  true
),
(
  'AGB - Preise und Zahlungsbedingungen',
  '§ 4 Preise und Zahlungsbedingungen: Die im Bestellformular angezeigte Preisvorschau dient lediglich der Orientierung und ist unverbindlich. Der verbindliche Preis für die Dienstleistung wird erst nach der manuellen Prüfung der Bestellung durch Renovirt festgelegt und in der finalen Rechnung ausgewiesen. Die Zahlung der Leistungen erfolgt ausschließlich auf Rechnung, eine Vorkasse ist nicht vorgesehen. Die Rechnungen sind innerhalb einer festgelegten Frist, beispielsweise 14 Tage netto, ohne Abzug zur Zahlung fällig. Im Falle eines Zahlungsverzugs gelten die gesetzlichen Bestimmungen.',
  'agb_preise_zahlung.txt',
  true
),
(
  'AGB - Lieferung und Lieferzeiten',
  '§ 5 Lieferung und Abnahme der Leistungen: Die bearbeiteten Bilder werden dem Kunden als Download-Link per E-Mail innerhalb von 48 Stunden nach Vertragsschluss bzw. Zahlungseingang zugesandt. Bei der Berechnung dieser Frist werden Wochenenden (Samstag und Sonntag) und gesetzliche Feiertage am Sitz von Renovirt nicht mitgerechnet. Fällt der Beginn der Frist oder ein Teil der 48-Stunden-Frist auf ein Wochenende oder einen gesetzlichen Feiertag, so wird die Frist unterbrochen und läuft ab dem nächsten Werktag um 9:00 Uhr weiter. BEISPIELE: Wenn Sie eine Bestellung am Freitag um 20:00 Uhr aufgeben, läuft die Frist am Freitag noch 4 Stunden. Die verbleibenden 44 Stunden beginnen am darauffolgenden Montag um 9:00 Uhr. Die Lieferung erfolgt dann spätestens am Mittwoch um 05:00 Uhr. Wenn Sie eine Bestellung am Samstag aufgeben, wird die 48-Stunden-Frist ab dem darauffolgenden Montag um 9:00 Uhr berechnet. Die Lieferung erfolgt dann spätestens am Mittwoch um 9:00 Uhr.',
  'agb_lieferung_zeiten.txt',
  true
),
(
  'AGB - Stornierung und Stornokosten',
  '§ 6 Stornierung und Kündigung: Renovirt bietet seinen Kunden eine spezifische Stornoregelung an: Eine Stornierung der Bestellung ist bis 30 Minuten nach Bestelleingang kostenlos möglich. Erfolgt die Stornierung nach Ablauf dieser Frist, fallen Stornokosten in Höhe von 70 % des Auftragswertes an. Dem Kunden wird ausdrücklich das Recht eingeräumt, nachzuweisen, dass Renovirt durch die Stornierung tatsächlich ein wesentlich geringerer Schaden entstanden ist oder gar kein Schaden vorliegt.',
  'agb_stornierung.txt',
  true
),
(
  'AGB - Urheberrecht und Nutzungsrechte',
  '§ 7 Urheberrecht und Nutzungsrechte: Das Urheberrecht an den vom Kunden hochgeladenen Originalbildern verbleibt beim Kunden oder dem jeweiligen Urheber. Der Kunde versichert mit dem Upload, dass er zur Bearbeitung der Bilder berechtigt ist. Nach vollständiger Bezahlung des vereinbarten Honorars räumt Renovirt dem Kunden die umfassenden, nicht-exklusiven, räumlich und zeitlich unbeschränkten Nutzungsrechte an den bearbeiteten Bildern ein. Eine Nutzung der bearbeiteten Bilder durch den Kunden vor vollständiger Bezahlung ist nicht gestattet. Renovirt ist berechtigt, die erstellten Lichtbilder zur Bewerbung der eigenen Tätigkeit zu verwenden.',
  'agb_urheberrecht.txt',
  true
),
(
  'AGB - Gewährleistung und Haftung',
  '§ 8 Gewährleistung und Haftung: Renovirt gewährleistet, dass die erbrachten digitalen Dienstleistungen den vertraglich vereinbarten Spezifikationen entsprechen und frei von Mängeln sind. Die Haftung von Renovirt für Schäden, die durch leichte Fahrlässigkeit verursacht wurden, ist ausgeschlossen, es sei denn, es handelt sich um Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit oder um die Verletzung wesentlicher Vertragspflichten. Bei Verletzung einer Kardinalpflicht haftet Renovirt auch bei leichter Fahrlässigkeit, jedoch begrenzt auf den vertragstypischen, vorhersehbaren Schaden.',
  'agb_haftung.txt',
  true
),
(
  'AGB - Mitwirkungspflichten des Kunden',
  '§ 9 Mitwirkungspflichten des Kunden: Der Kunde hat folgende Mitwirkungspflichten: Bereitstellung von Material in der vereinbarten Qualität und im vereinbarten Format; Versicherung über alle erforderlichen Rechte an den hochgeladenen Bildern; regelmäßige und ausreichende Sicherung seiner eigenen Daten; vertrauliche Behandlung der Zugangsdaten zur Web-App; unverzügliche Prüfung der gelieferten Leistungen auf Mängel und schriftliche Anzeige bei Renovirt.',
  'agb_mitwirkungspflichten.txt',
  true
);

-- Insert Privacy/Datenschutz sections
INSERT INTO help_documents (title, content, file_name, is_active) VALUES 
(
  'Datenschutz - Verantwortlicher und Kontakt',
  'Verantwortlicher: NPS Media GmbH, Klinkerberg 9, 86152 Augsburg, Deutschland. Vertreten durch den Geschäftsführer: Nikolas Seymour. Die Marke Renovirt wird von der NPS Media GmbH betrieben. Kontakt für Datenschutzanfragen über die unter Punkt 1 genannten Kontaktdaten.',
  'datenschutz_verantwortlicher.txt',
  true
),
(
  'Datenschutz - Datenverarbeitung und Zwecke',
  'Wir erheben und verarbeiten personenbezogene Daten zur Auftragsabwicklung: Kontaktdaten und Unternehmensinformationen (Name, E-Mail, Firma); Bestelldaten (Art der Fotobearbeitung, Zusatzleistungen); Bild-Uploads und Metadaten (EXIF-Daten wie Ort, Zeit, Kameramodell); Nutzungsdaten der Web-App (IP-Adresse, Browser, Zugriffszeiten). Zwecke: Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO), Qualitätssicherung und Serviceverbesserung (Art. 6 Abs. 1 lit. f DSGVO), Kommunikation und Kundensupport.',
  'datenschutz_datenverarbeitung.txt',
  true
),
(
  'Datenschutz - Speicherdauer und Löschung',
  'Speicherdauer: Fertige Bilder werden nach Bereitstellung des Download-Links für 365 Tage gespeichert. Rechnungsdaten und buchungsrelevante Unterlagen werden gemäß gesetzlichen Aufbewahrungsfristen gespeichert (8 Jahre für Buchungsbelege, 10 Jahre für Handelsbücher). Sonstige personenbezogene Daten werden gelöscht, sobald der Zweck ihrer Speicherung entfällt und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.',
  'datenschutz_speicherdauer.txt',
  true
),
(
  'Datenschutz - Serverstandort und Drittdienstleister',
  'Datenhosting: Bild-Uploads, Metadaten und personenbezogene Daten werden auf deutschen Servern gesichert. Auftragsverarbeiter: Supabase (Datenbank), Make/Integromat (Workflow-Automatisierung), Mailjet (E-Mail-Versand), Google Drive (Cloud-Speicher), Stripe (Zahlungsabwicklung). Mit allen Dienstleistern haben wir Auftragsverarbeitungsverträge (AVV) abgeschlossen.',
  'datenschutz_server_drittanbieter.txt',
  true
),
(
  'Datenschutz - Ihre Rechte',
  'Ihre Rechte als betroffene Person: Recht auf Auskunft (Art. 15 DSGVO), Recht auf Berichtigung (Art. 16 DSGVO), Recht auf Löschung (Art. 17 DSGVO), Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO), Recht auf Widerspruch (Art. 21 DSGVO), Recht auf Datenübertragbarkeit (Art. 20 DSGVO), Recht auf Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO). Zur Geltendmachung Ihrer Rechte kontaktieren Sie uns über die angegebenen Kontaktdaten.',
  'datenschutz_rechte.txt',
  true
),
(
  'Datenschutz - Newsletter und Marketing',
  'Newsletter-Anmeldung erfolgt über Double-Opt-in-Verfahren. Verarbeitung von E-Mail-Adresse und Name auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Speicherung von IP-Adresse und Zeitpunkt der Anmeldung für Nachweis der Einwilligung. Widerruf jederzeit möglich über Abmeldelink in jeder Newsletter-E-Mail.',
  'datenschutz_newsletter.txt',
  true
),
(
  'Datenschutz - Cookies und Tracking',
  'Technisch notwendige Cookies für grundlegenden Betrieb (Log-in, Warenkorbfunktionen) auf Basis berechtigten Interesses (Art. 6 Abs. 1 lit. f DSGVO). Nicht-notwendige Cookies (Analyse, Marketing) erfordern ausdrückliche Einwilligung gemäß § 25 TTDSG. Cookie Consent Management Platform (CMP) für Einwilligung. Ablehnung muss genauso einfach möglich sein wie Annahme. Cookie-Einstellungen jederzeit über Footer-Link anpassbar.',
  'datenschutz_cookies.txt',
  true
);

-- Insert Impressum sections
INSERT INTO help_documents (title, content, file_name, is_active) VALUES 
(
  'Impressum - Anbieter und Geschäftsführer',
  'Angaben gemäß § 5 DDG: NPS Media GmbH, Klinkerberg 9, 86152 Augsburg, Deutschland. Vertreten durch Geschäftsführer: Nikolas Seymour. Kontakt: E-Mail info@renovirt.de',
  'impressum_anbieter.txt',
  true
),
(
  'Impressum - Registereintrag und Steuer-ID',
  'Registereintrag: Amtsgericht Augsburg, Handelsregisternummer: HRB 38388. Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: DE359733225',
  'impressum_register_steuer.txt',
  true
),
(
  'Impressum - Online-Streitbeilegung',
  'Plattform der EU-Kommission zur Online-Streitbeilegung: https://ec.europa.eu/consumers/odr/ - Wir sind zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle nicht verpflichtet und nicht bereit.',
  'impressum_streitbeilegung.txt',
  true
);