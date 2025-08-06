# Stripe Dashboard Konfiguration für Alternative Zahlungsmethoden

## Schritt 1: PayPal aktivieren

1. Gehen Sie zu Ihrem [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigieren Sie zu **Einstellungen** → **Zahlungsmethoden**
3. Suchen Sie **PayPal** und klicken Sie auf **Aktivieren**
4. Folgen Sie den Anweisungen zur Verknüpfung Ihres PayPal Business-Kontos
5. Aktivieren Sie PayPal für Ihre gewünschten Märkte (Deutschland, Europa)

## Schritt 2: Klarna aktivieren

1. Im Stripe Dashboard: **Einstellungen** → **Zahlungsmethoden**
2. Suchen Sie **Klarna** und klicken Sie auf **Aktivieren**
3. Wählen Sie die Länder aus (Deutschland, Österreich, etc.)
4. Konfigurieren Sie die Klarna-Produkte:
   - **Pay now** (Sofortüberweisung)
   - **Pay later** (Kauf auf Rechnung)
   - **Slice it** (Ratenzahlung)

## Schritt 3: SEPA Direct Debit aktivieren

1. **Einstellungen** → **Zahlungsmethoden** → **SEPA Direct Debit**
2. Klicken Sie auf **Aktivieren**
3. Vervollständigen Sie die erforderlichen Geschäftsinformationen
4. Aktivieren Sie für EU-Länder

## Schritt 4: Weitere europäische Zahlungsmethoden

### SOFORT (jetzt Teil von Klarna)
- Wird automatisch mit Klarna aktiviert
- Beliebte Methode in Deutschland

### Bancontact (Belgien)
1. **Einstellungen** → **Zahlungsmethoden** → **Bancontact**
2. Aktivieren Sie für belgische Kunden

### iDEAL (Niederlande)
1. **Einstellungen** → **Zahlungsmethoden** → **iDEAL**
2. Aktivieren Sie für niederländische Kunden

## Schritt 5: Webhooks konfigurieren (Optional)

Für robuste Zahlungsverarbeitung:

1. **Entwickler** → **Webhooks** → **Endpoint hinzufügen**
2. Endpoint URL: `https://ihr-projekt.supabase.co/functions/v1/stripe-webhook`
3. Ereignisse auswählen:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_method.attached`

## Schritt 6: Test-Modus verwenden

Bevor Sie live gehen:

1. Verwenden Sie die **Test-Schlüssel** für die Entwicklung
2. Testen Sie alle Zahlungsmethoden mit Stripe Test-Karten
3. PayPal Sandbox-Konto für PayPal-Tests
4. Klarna Test-Credentials verwenden

### Test-Karten für verschiedene Zahlungsmethoden:

**PayPal Test:**
- Verwenden Sie Ihr PayPal Sandbox-Konto

**Klarna Test:**
- Land: Deutschland
- Test-Daten werden von Klarna bereitgestellt

**SEPA Test:**
- IBAN: `DE89370400440532013000`
- BIC: Beliebige gültige deutsche BIC

## Schritt 7: Live-Schaltung

1. Aktivieren Sie Ihr Stripe-Konto für Live-Zahlungen
2. Wechseln Sie zu den **Live-Schlüsseln**
3. Verknüpfen Sie echte Konten (PayPal Business, etc.)
4. Testen Sie mit kleinen Beträgen

## Wichtige Hinweise

- **Compliance**: Stellen Sie sicher, dass Ihre AGB die verschiedenen Zahlungsmethoden abdecken
- **Währung**: Alle Zahlungsmethoden funktionieren mit EUR
- **Verfügbarkeit**: Nicht alle Methoden sind in allen Ländern verfügbar
- **Gebühren**: Jede Zahlungsmethode hat unterschiedliche Stripe-Gebühren

## Support

Bei Problemen:
1. Stripe Dashboard → **Hilfe & Support**
2. Stripe-Dokumentation: https://stripe.com/docs/payments
3. Überprüfen Sie die Stripe-Logs für detaillierte Fehlermeldungen