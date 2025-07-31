-- Test-Daten für Help Analytics erstellen (mit korrekten Rating-Werten)
INSERT INTO help_interactions (
  user_id,
  session_id,
  question,
  ai_response,
  response_time_ms,
  feedback_rating,
  contacted_support,
  ip_address,
  user_agent
) VALUES 
(
  'dbdbe5a3-1b2c-47d8-89c1-d13edeb087a5',
  'test-session-1',
  'Wann bekomme ich meine Bilder?',
  'In der Regel erhalten Sie Ihre bearbeiteten Bilder innerhalb von 48 Stunden. Bei Premium-Aufträgen erfolgt die Bearbeitung priorisiert, aber trotzdem innerhalb von 48h. Mit dem Express-Zusatz für 2€ pro Bild verkürzt sich die Bearbeitungszeit auf 24 Stunden.',
  1500,
  1,
  false,
  '127.0.0.1',
  'Test Browser'
),
(
  NULL,
  'test-session-2',
  'Was kostet die Bildbearbeitung?',
  'Die Preise beginnen bei unserem Basic-Paket mit Farb-/Belichtungskorrektur und Perspektivkorrektur. Premium bietet zusätzlich Objektentfernung und Retusche. Es gibt Staffelrabatte: 5% ab 10, 10% ab 20, 15% ab 30, 25% ab 40 Bildern.',
  1200,
  1,
  false,
  '127.0.0.1',
  'Test Browser'
),
(
  NULL,
  'test-session-3',
  'Wie lade ich Bilder hoch?',
  'Sie können Ihre Bilder direkt über unsere Plattform hochladen. Wählen Sie zunächst Ihr gewünschtes Paket aus und folgen Sie den Anweisungen im Upload-Bereich.',
  800,
  0,
  true,
  '127.0.0.1',
  'Test Browser'
);