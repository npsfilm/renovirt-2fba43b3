-- FAQ-Einträge für Änderungen und nachträgliche Bildhinzufügung
INSERT INTO public.help_documents (title, content, is_active, created_by) VALUES 
(
  'Kann ich nach dem Upload noch Änderungen vornehmen?',
  'Nach dem Upload können keine direkten Änderungen an den hochgeladenen Bildern vorgenommen werden. Falls Sie Änderungen benötigen, nutzen Sie bitte erneut unser Uploadformular, da wir sonst nicht garantieren können, dass Ihre Bilder korrekt zugeordnet werden und die Bearbeitung länger als 48 Stunden dauern kann.',
  true,
  NULL
),
(
  'Kann ich nachträglich weitere Bilder hinzufügen?',
  'Das nachträgliche Hinzufügen von Bildern zu einer bestehenden Bestellung ist nicht direkt möglich. Für zusätzliche Bilder nutzen Sie bitte erneut unser Uploadformular, da wir sonst nicht garantieren können, dass Ihre Bilder korrekt zugeordnet werden und die Bearbeitung länger als 48 Stunden dauern kann.',
  true,
  NULL
);

-- Suchpatterns für AI Chat
INSERT INTO public.help_question_patterns (question_pattern, count, avg_satisfaction) VALUES 
('änderungen nach upload', 1, NULL),
('bilder ändern nach hochladen', 1, NULL),
('upload ändern', 1, NULL),
('nachträglich ändern', 1, NULL),
('weitere bilder hinzufügen', 1, NULL),
('nachträglich bilder hinzufügen', 1, NULL),
('mehr bilder hochladen', 1, NULL),
('zusätzliche bilder', 1, NULL),
('bilder nachtragen', 1, NULL),
('upload ergänzen', 1, NULL);