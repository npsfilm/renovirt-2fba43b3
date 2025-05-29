
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Camera, Sparkles, Download, Clock, CheckCircle, Upload, Star, Users, Building2, Zap, FileText, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Wird geladen...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center border-b bg-white">
        <div className="flex items-center gap-8">
          <div className="text-2xl font-bold text-gray-900">
            <span className="text-blue-600">R</span> Renovirt
          </div>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600">
                Willkommen, {user.email}
              </span>
              <Button variant="outline" onClick={handleSignOut}>
                Abmelden
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/auth">
                <Button variant="ghost">Anmelden</Button>
              </Link>
              <Link to="/auth">
                <Button>Registrieren</Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16 text-center bg-gradient-to-br from-blue-50 to-green-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-sm text-blue-600 font-medium mb-4">
            KI-gestützte Immobilienfotobearbeitung
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Immobilienbilder{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
              perfekt
            </span>{" "}
            in 3 Minuten
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Verwandeln Sie Ihre Immobilienfotos mit KI-gestützter Bearbeitung in professionelle, 
            verkaufsfördernde Bilder. Automatisch, schnell und präzise.
          </p>

          {/* Role Selector */}
          <div className="mb-8">
            <p className="text-lg font-medium mb-4">Ich bin:</p>
            <div className="flex justify-center gap-4 mb-8">
              <Button variant="outline" className="gap-2">
                <Building2 className="w-4 h-4" />
                Makler
              </Button>
              <Button variant="outline" className="gap-2">
                <Users className="w-4 h-4" />
                Architekt
              </Button>
              <Button variant="outline" className="gap-2">
                <Camera className="w-4 h-4" />
                Fotograf
              </Button>
            </div>
          </div>

          {/* Upload Area */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-blue-400 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Bilder hier hinziehen oder klicken</h3>
              <p className="text-gray-600">Unterstützt JPG, PNG • Bis zu 50 Bilder gleichzeitig</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Alles was Sie brauchen
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Von Upload bis Export - unser kompletter Workflow für professionelle Immobilienfotos
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Upload</h3>
              <p className="text-gray-600">Drag & Drop, ZIP-Upload oder Cloud-Integration</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">KI-Extras</h3>
              <p className="text-gray-600">Himmel-Austausch, Objekt-Entfernung, automatische Retusche</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dashboard</h3>
              <p className="text-gray-600">Übersichtliche Verwaltung aller Projekte und Aufträge</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">PDF-Export</h3>
              <p className="text-gray-600">Professionelle Zusammenfassung mit allen bearbeiteten Bildern</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Before/After Section */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sehen Sie den Unterschied
            </h2>
            <p className="text-lg text-gray-600">
              KI-gestützte Bearbeitung macht aus jedem Foto ein Verkaufsargument
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="aspect-video bg-gray-300 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-600">Vorher</span>
              </div>
              <h3 className="text-lg font-semibold">Originalfoto</h3>
            </div>
            <div className="text-center">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-green-100 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-700">Nachher</span>
              </div>
              <h3 className="text-lg font-semibold">KI-bearbeitetes Foto</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Das sagen unsere Kunden
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Renovirt hat unsere Arbeitsweise revolutioniert. Professionelle Fotos in Minuten statt Stunden."
                </p>
                <div>
                  <p className="font-semibold">Sarah Mueller</p>
                  <p className="text-sm text-gray-600">Maklerin</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Die KI-gestützte Bearbeitung ist beeindruckend. Unsere Projekte kommen viel besser zur Geltung."
                </p>
                <div>
                  <p className="font-semibold">Thomas Weber</p>
                  <p className="text-sm text-gray-600">Architekt</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Ein Game-Changer für mein Business. Mehr Zeit für Kreativität, weniger für Nachbearbeitung."
                </p>
                <div>
                  <p className="font-semibold">Lisa Schmidt</p>
                  <p className="text-sm text-gray-600">Fotografin</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transparente Preise
            </h2>
            <p className="text-lg text-gray-600">
              Wählen Sie das passende Paket für Ihre Bedürfnisse
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Basic</CardTitle>
                <div className="text-3xl font-bold">€2,99<span className="text-sm font-normal text-gray-600">/pro Bild</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Grundbearbeitung
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Farbanpassung
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    24h Bearbeitung
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    JPG Download
                  </li>
                </ul>
                <Button className="w-full" variant="outline">Jetzt starten</Button>
              </CardContent>
            </Card>

            <Card className="border-blue-500 border-2 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">Beliebteste</span>
              </div>
              <CardHeader>
                <CardTitle>Premium</CardTitle>
                <div className="text-3xl font-bold">€4,99<span className="text-sm font-normal text-gray-600">/pro Bild</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Alles aus Basic
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    KI-Retusche
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Himmel-Austausch
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    6h Bearbeitung
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    PDF Export
                  </li>
                </ul>
                <Button className="w-full">Jetzt starten</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Custom</CardTitle>
                <div className="text-3xl font-bold">€8,99<span className="text-sm font-normal text-gray-600">/pro Bild</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Alles aus Premium
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Objekt-Entfernung
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Exposé-Text
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    2h Bearbeitung
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Priority Support
                  </li>
                </ul>
                <Button className="w-full" variant="outline">Jetzt starten</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Häufige Fragen
            </h2>
          </motion.div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Wie lange dauert die Bearbeitung?</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Welche Dateiformate werden unterstützt?</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kann ich mehrere Bilder gleichzeitig hochladen?</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Gibt es eine Geld-zurück-Garantie?</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-gradient-to-r from-blue-600 to-green-600">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bereit für perfekte Immobilienfotos?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Starten Sie noch heute und überzeugen Sie sich von der Qualität unserer KI-Bearbeitung.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Kostenlos testen
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-blue-600">
              Demo anfordern
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold mb-4">
                <span className="text-blue-400">R</span> Renovirt
              </div>
              <p className="text-gray-400">
                KI-gestützte Immobilienfotobearbeitung für Profis.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produkt</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Features</li>
                <li>Preise</li>
                <li>API</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Unternehmen</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Über uns</li>
                <li>Karriere</li>
                <li>Kontakt</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Hilfe</li>
                <li>FAQ</li>
                <li>Datenschutz</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Renovirt. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
