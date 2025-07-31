-- Deactivate all existing help documents
UPDATE public.help_documents SET is_active = false;

-- Insert new FAQ entries with the updated content
INSERT INTO public.help_documents (title, content, is_active, created_by) VALUES
('Welche Bildbearbeitungsleistungen bietet Renovirt an?', 'Renovirt bietet einen professionellen Fotobearbeitungsservice speziell für Immobilienfotos von Maklern und Architekten. Zu unseren Standardleistungen gehören Belichtungs- und Farboptimierung, die Entfernung kleiner Makel und störender Objekte (z. B. Schilder, Hausnummern, Personen) und Perspektivkorrekturen. Aufwendigere Retuschen sind gegen Aufpreis möglich. Alle Bearbeitungen erfolgen professionell und von Hand in Deutschland.', true, NULL),

('Wer bearbeitet meine Fotos? Kommen automatische Filter oder echte Designer zum Einsatz?', 'Ihre Bilder werden primär von menschlichen Fotoeditoren in Deutschland bearbeitet. Unser Team stellt sicher, dass jedes Foto optimal angepasst wird. Wir nutzen teilweise KI-Funktionen in unseren Tools, beispielsweise zum Entfernen von störenden Objekten, die Hauptarbeit bleibt jedoch manuell.', true, NULL),

('Kann ich spezielle Bearbeitungswünsche für meine Fotos angeben?', 'Ja, bei der Auftragsstellung können Sie genaue Anweisungen und Wünsche angeben, z. B. ob bestimmte Objekte entfernt, Farben angepasst oder ein bestimmter Stil umgesetzt werden soll. Sollten Ihre Wünsche über das gewählte Paket hinausgehen, melden wir uns separat per E-Mail.', true, NULL),

('Könnt Ihr unerwünschte Objekte oder Personen aus Immobilienfotos entfernen?', 'Ja, das Entfernen kleinerer störender Elemente ist im Premium-Paket enthalten. Größere Objekte (z. B. Autos in der Auffahrt) können wir kostenpflichtig bzw. mit einem Aufpreis von 79 € pro Bild entfernen.', true, NULL),

('Bietet Ihr auch virtuelle Möblierung oder Renovierung an?', 'Aktuell konzentrieren wir uns auf die Optimierung Ihrer vorhandenen Fotos. Virtuelle Möblierung oder das digitale Einfügen von Möbeln bieten wir standardmäßig noch nicht an, sind aber für die Zukunft geplant.', true, NULL),

('Bearbeitet Ihr auch Immobilienvideos oder nur Fotos?', 'Aktuell ist unser Service auf die Bearbeitung von Fotos spezialisiert. Die Bearbeitung von Immobilienvideos bieten wir derzeit noch nicht an, arbeiten aber daran.', true, NULL),

('Wie sind die Preise und gibt es Rabatte?', 'Wir bieten transparente Preise pro Bild ohne Abonnements. Die Kosten hängen vom gewählten Paket ab: Basic-Paket: Enthält Farb- und Belichtungskorrektur, Perspektivkorrektur, Objektivkorrektur. Premium-Paket: Enthält alle Basic-Features sowie die Entfernung störender Objekte, professionelle Retusche und HDR-Optimierung. Je mehr Bilder Sie bearbeiten lassen, desto günstiger wird der Preis pro Bild. Wir bieten folgende Mengenrabatte: 5% Rabatt ab 10 Bildern, 10% Rabatt ab 20 Bildern, 15% Rabatt ab 30 Bildern, 25% Rabatt ab 40 Bildern.', true, NULL),

('Wie lange dauert es, bis ich meine bearbeiteten Bilder erhalte?', 'In der Regel erhalten Sie Ihre bearbeiteten Bilder innerhalb von 48 Stunden, unabhängig vom gewählten Paket. Premium-Aufträge werden jedoch priorisiert bearbeitet. Wenn es besonders eilig ist, können Sie die Express-Bearbeitung als kostenpflichtige Zusatzoption wählen. Diese garantiert eine Lieferung innerhalb von 24 Stunden für alle Pakete.', true, NULL),

('Werden Aufträge auch am Wochenende oder an Feiertagen bearbeitet?', 'Unsere regulären Betriebszeiten sind an Werktagen.', true, NULL),

('Wie werden die fertigen Bilder geliefert?', 'Sobald die Fotos bearbeitet sind, erhalten Sie eine Benachrichtigung per E-Mail. Die fertigen Bilder stehen dann in Ihrem Konto zum Download bereit, in der Regel als hochauflösende JPEG-Dateien.', true, NULL),

('Kann ich den Status meiner Bearbeitung verfolgen?', 'Ja, in Ihrem Kundenbereich können Sie jederzeit den Status Ihres Auftrags einsehen. Sie werden zudem automatisch informiert, sobald die Bearbeitung abgeschlossen ist.', true, NULL),

('Welche Dateiformate werden akzeptiert?', 'Wir akzeptieren alle gängigen Bildformate, insbesondere JPEG, PNG, TIFF und RAW-Dateien. RAW-Dateien bieten die beste Grundlage für hochwertige Bearbeitungen.', true, NULL),

('In welchem Format werden die bearbeiteten Bilder geliefert?', 'Die bearbeiteten Bilder werden standardmäßig als hochauflösende JPEG-Dateien geliefert.', true, NULL),

('Gibt es Mindest- oder Maximalgrößen für die Bilder?', 'Es gibt keine spezifischen Mindest- oder Maximalgrößen. Wir empfehlen jedoch eine Mindestauflösung von 1920x1080 Pixeln für optimale Ergebnisse. Je höher, desto besser das Ergebnis.', true, NULL),

('Wie sicher sind meine Daten und Fotos bei Euch?', 'Ihre Daten und Fotos werden DSGVO-konform auf deutschen Servern gespeichert und verarbeitet. Wir haben strenge Sicherheitsmaßnahmen implementiert und geben Ihre Daten niemals an Dritte weiter.', true, NULL),

('Werden meine Fotos nach der Bearbeitung gelöscht?', 'Ihre bearbeiteten Fotos werden für 365 Tage in Ihrem Konto gespeichert und stehen zum Download zur Verfügung. Nach Ablauf dieser Zeit werden sie automatisch gelöscht.', true, NULL),

('Kann ich eine Revision oder Nachbesserung verlangen, wenn mir das Ergebnis nicht gefällt?', 'Ja, falls Sie mit dem Ergebnis nicht zufrieden sind, nehmen wir gerne eine kostenlose Nachbesserungen vor. Teilen Sie uns einfach mit, was geändert werden soll.', true, NULL),

('Bietet Ihr auch HDR-Bearbeitung an?', 'Ja, HDR-Optimierung ist im Premium-Paket enthalten. Wir können aus mehreren Belichtungen ein HDR-Bild erstellen oder vorhandene HDR-Aufnahmen optimieren.', true, NULL),

('Was ist Bracketing und wie funktioniert das bei Euch?', 'Bracketing bedeutet, dass Sie mehrere Fotos mit unterschiedlichen Belichtungen vom selben Motiv aufnehmen. Wir können diese zu einem perfekt belichteten HDR-Bild zusammenfügen. Dies ist besonders nützlich bei schwierigen Lichtverhältnissen.', true, NULL),

('Kann ich auch einzelne Fotos statt ganzer Serien bearbeiten lassen?', 'Ja, Sie können sowohl einzelne Fotos als auch ganze Fotoserien bei uns bearbeiten lassen. Es gibt keine Mindestanzahl.', true, NULL),

('Wie funktioniert die Bezahlung?', 'Die Bezahlung erfolgt sicher über Stripe und unterstützt alle gängigen Kreditkarten sowie Klarna, Google Pay, PayPal und Apple Pay.', true, NULL),

('Kann ich auf Rechnung zahlen?', 'Selbstverständlich. Beim Abschluss der bestellung können Sie zwischen Kreditkarte, Paypal sowie Rechnung wählen.', true, NULL),

('Was passiert, wenn ich mit dem Service nicht zufrieden bin?', 'Ihre Zufriedenheit ist uns wichtig. Bei Problemen kontaktieren Sie uns direkt – wir finden eine Lösung.', true, NULL),

('Wie kann ich meine Bestellung stornieren oder ändern?', 'Eine Stornierung oder Änderung einer Bestellung ist bis zu 30 min nach Bestellaufgabe möglich. Bitte kontaktieren Sie in diesem Fall direkt unseren Support über das Kontaktformular auf der Hilfeseite oder per E-Mail, um die Details zu besprechen.', true, NULL),

('Wie kann ich den Kundenservice erreichen?', 'Wenn Sie über die Suche in unserem Hilfe-Center keine Antwort finden, nutzen Sie bitte das Kontaktformular auf der Hilfeseite. Sie können uns auch direkt per E-Mail an support@renovirt.de kontaktieren.', true, NULL);