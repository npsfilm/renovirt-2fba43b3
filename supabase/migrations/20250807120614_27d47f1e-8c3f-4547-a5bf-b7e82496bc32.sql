-- Update payment-related help documents to reflect invoice-only payments

-- Update "Wie funktioniert die Bezahlung?"
UPDATE help_documents 
SET content = 'Die Bezahlung erfolgt ausschließlich auf Rechnung. Sie erhalten eine Rechnung per E-Mail nach Abschluss der Bearbeitung mit 14 Tagen Zahlungsziel.',
    updated_at = now()
WHERE id = 'ee921897-ce6d-49b3-a54f-656de99c549d';

-- Update "Kann ich auf Rechnung zahlen?"
UPDATE help_documents 
SET content = 'Ja, die Bezahlung erfolgt ausschließlich auf Rechnung. Eine Vorauszahlung ist nicht erforderlich.',
    updated_at = now()
WHERE id = '731342e5-3f16-4c4c-87b4-f079ef07ec88';

-- Update "Wann und wie erfolgt die Bezahlung?"
UPDATE help_documents 
SET content = 'Die Bezahlung erfolgt nach Abschluss der Bildbearbeitung auf Rechnung mit einem Zahlungsziel von 14 Tagen ab Rechnungsdatum.',
    updated_at = now()
WHERE id = 'ef42bda3-5fcc-4209-a487-22df35eb3baa';

-- Update Datenschutzerklärung to remove Stripe
UPDATE help_documents 
SET content = '1. Verantwortlicher

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
    updated_at = now()
WHERE id = 'd02ef7de-4bc7-481c-b198-3ea44b739beb';

-- Update Datenschutz Drittdienstleister to remove Stripe
UPDATE help_documents 
SET content = 'Datenhosting: Bild-Uploads, Metadaten und personenbezogene Daten werden auf deutschen Servern gesichert. Auftragsverarbeiter: Supabase (Datenbank), Make/Integromat (Workflow-Automatisierung), Mailjet (E-Mail-Versand), Google Drive (Cloud-Speicher). Mit allen Dienstleistern haben wir Auftragsverarbeitungsverträge (AVV) abgeschlossen.',
    updated_at = now()
WHERE id = '76234644-fed6-4c39-8d66-bc582acbdb40';