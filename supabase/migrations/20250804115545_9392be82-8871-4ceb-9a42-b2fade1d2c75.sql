-- Füge rechtliche Dokumente zur help_documents Tabelle hinzu

-- AGB (Allgemeine Geschäftsbedingungen)
INSERT INTO help_documents (title, content, file_name, is_active, created_by) VALUES 
('AGB - Allgemeine Geschäftsbedingungen', 
'§ 1 Geltungsbereich und Vertragspartner

Diese Allgemeinen Geschäftsbedingungen finden ausschließlich Anwendung auf Verträge zwischen der NPS Media GmbH (im Folgenden „Renovirt") und Unternehmern im Sinne des § 14 des Bürgerlichen Gesetzbuches (BGB). Dies umfasst insbesondere Makler, Architekturbüros, Fotografen und andere Geschäftskunden.

§ 2 Vertragsgegenstand und Leistungsumfang

Renovirt bietet digitale Dienstleistungen im Bereich der Fotobearbeitung und virtuellen Immobilienvisualisierung an. Der Vertragsgegenstand umfasst die digitale Bearbeitung von Fotos, einschließlich Optionen wie Basic-/Premium-Bearbeitung, optionalen Zusatzleistungen wie Objektentfernung und Himmelsaustausch.

§ 3 Bestellvorgang und Vertragsschluss

Der Bestellvorgang erfolgt über eine Web-App, die den Upload von Bildern und das Ausfüllen eines Formulars ermöglicht. Die Preisvorschau ist unverbindlich. Der Vertrag kommt erst durch die manuelle finale Prüfung der Bestellung und die anschließende Rechnungsstellung durch Renovirt zustande.

§ 4 Preise und Zahlungsbedingungen

Die Zahlung erfolgt ausschließlich auf Rechnung, eine Vorkasse ist nicht vorgesehen. Die Rechnungen sind innerhalb von 14 Tagen netto ohne Abzug zur Zahlung fällig.

§ 5 Lieferung und Abnahme der Leistungen

Die bearbeiteten Bilder werden als Download-Link per E-Mail innerhalb von 48 Stunden nach Vertragsschluss zugesandt. Bei der Berechnung werden Wochenenden und Feiertage nicht mitgerechnet.

§ 6 Stornierung und Kündigung

Eine Stornierung ist bis 30 Minuten nach Bestelleingang kostenlos möglich. Danach fallen Stornokosten in Höhe von 70% des Auftragswertes an.

§ 7 Urheberrecht und Nutzungsrechte

Das Urheberrecht an den Originalbildern verbleibt beim Kunden. Nach vollständiger Bezahlung erhält der Kunde umfassende Nutzungsrechte an den bearbeiteten Bildern.

§ 8 Gewährleistung und Haftung

Renovirt haftet nur bei Vorsatz und grober Fahrlässigkeit. Die Haftung für leichte Fahrlässigkeit ist ausgeschlossen, außer bei Verletzung wesentlicher Vertragspflichten.', 
'agb.md', true, NULL),

-- Datenschutzerklärung
('Datenschutzerklärung', 
'1. Verantwortlicher

Verantwortlicher im Sinne der DSGVO:
NPS Media GmbH
Klinkerberg 9
86152 Augsburg
Deutschland
Vertreten durch den Geschäftsführer: Nikolas Seymour

2. Datenverarbeitung

Wir erheben und verarbeiten personenbezogene Daten zur Auftragsabwicklung und Erbringung unserer digitalen Dienstleistungen:

- Kontaktdaten und Unternehmensinformationen
- Bestelldaten und Art der Fotobearbeitung
- Bild-Uploads und Metadaten (EXIF-Daten)
- Nutzungsdaten der Web-App (IP-Adresse, Browser, Zugriffszeiten)

Die Verarbeitung erfolgt zur Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO), Qualitätssicherung und Serviceverbesserung (Art. 6 Abs. 1 lit. f DSGVO).

2.1 Speicherdauer

- Fertige Bilder: 365 Tage nach Bereitstellung
- Rechnungsdaten: 8-10 Jahre (gesetzliche Aufbewahrungsfristen)
- Sonstige Daten: bis Zweckentfall

2.2 Datenhosting

Bild-Uploads und personenbezogene Daten werden auf deutschen Servern gesichert.

2.3 Auftragsverarbeiter

- Supabase: Datenbank für Nutzerkonten & Projektdaten
- Make (Integromat): Workflow-Automatisierung
- Mailjet: E-Mail-Versand
- Google Drive: Cloud-Speicher für fertige Bilder
- Stripe: Zahlungsabwicklung

3. Ihre Rechte

Sie haben folgende Rechte bezüglich Ihrer Daten:
- Recht auf Auskunft (Art. 15 DSGVO)
- Recht auf Berichtigung (Art. 16 DSGVO)
- Recht auf Löschung (Art. 17 DSGVO)
- Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)
- Recht auf Widerspruch (Art. 21 DSGVO)
- Recht auf Datenübertragbarkeit (Art. 20 DSGVO)
- Recht auf Beschwerde bei Aufsichtsbehörde (Art. 77 DSGVO)

4. Newsletter

Newsletter-Anmeldung erfolgt über Double-Opt-in-Verfahren. Widerruf jederzeit möglich.

5. Cookies

Wir nutzen technisch notwendige Cookies und nicht-notwendige Cookies (mit Einwilligung). Cookie-Einstellungen können jederzeit angepasst werden.

6. Datensicherheit

Wir treffen geeignete technische und organisatorische Maßnahmen zum Schutz Ihrer Daten: Verschlüsselung, Zugriffsbeschränkungen, regelmäßige Backups, Sicherheitsupdates.',
'datenschutz.md', true, NULL),

-- Impressum
('Impressum', 
'Angaben gemäß § 5 DDG (ehemals TMG)

NPS Media GmbH
Klinkerberg 9
86152 Augsburg
Deutschland

Vertreten durch:
Geschäftsführer: Nikolas Seymour

Kontakt:
E-Mail: info@renovirt.de

Registereintrag:
Amtsgericht Augsburg
Handelsregisternummer: HRB 38388

Umsatzsteuer-Identifikationsnummer:
gemäß § 27 a Umsatzsteuergesetz: DE359733225

Online-Streitbeilegung:
Plattform der EU-Kommission zur Online-Streitbeilegung: https://ec.europa.eu/consumers/odr/
Wir sind zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle nicht verpflichtet und nicht bereit.',
'impressum.md', true, NULL);