
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Wand2, 
  LayoutDashboard, 
  FileText, 
  Users, 
  Building, 
  Camera,
  ChevronDown,
  Star,
  Check,
  ArrowRight
} from "lucide-react";

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Renovirt</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                Login
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Registrieren
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-6 bg-emerald-100 text-emerald-800 border-emerald-200">
                KI-gestützte Immobilienfotobearbeitung
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Immobilienbilder perfekt
                <span className="text-emerald-600 block">in 3 Minuten</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Verwandeln Sie Ihre Immobilienfotos mit KI-gestützter Bearbeitung in professionelle, 
                verkaufsfördernde Bilder. Automatisch, schnell und präzise.
              </p>
            </motion.div>

            {/* Role Selection CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <div className="text-sm text-gray-500 mb-2 sm:mb-0">Ich bin:</div>
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: Users, label: "Makler", color: "bg-blue-600 hover:bg-blue-700" },
                  { icon: Building, label: "Architekt", color: "bg-emerald-600 hover:bg-emerald-700" },
                  { icon: Camera, label: "Fotograf", color: "bg-purple-600 hover:bg-purple-700" }
                ].map(({ icon: Icon, label, color }) => (
                  <Button
                    key={label}
                    onClick={() => setSelectedRole(label)}
                    className={`${color} text-white flex items-center gap-2 transform hover:scale-105 transition-all`}
                  >
                    <Icon size={18} />
                    {label}
                  </Button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white p-8 rounded-2xl shadow-2xl max-w-4xl mx-auto"
            >
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-emerald-400 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Bilder hier hinziehen oder klicken
                </h3>
                <p className="text-gray-600">
                  Unterstützt JPG, PNG • Bis zu 50 Bilder gleichzeitig
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Alles was Sie brauchen
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Von Upload bis Export - unser kompletter Workflow für professionelle Immobilienfotos
            </p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: Upload,
                title: "Smart Upload",
                description: "Drag & Drop, ZIP-Upload oder Cloud-Integration"
              },
              {
                icon: Wand2,
                title: "KI-Extras",
                description: "Himmel-Austausch, Objekt-Entfernung, automatische Retusche"
              },
              {
                icon: LayoutDashboard,
                title: "Dashboard",
                description: "Übersichtliche Verwaltung aller Projekte und Aufträge"
              },
              {
                icon: FileText,
                title: "PDF-Export",
                description: "Professionelle Zusammenfassung mit allen bearbeiteten Bildern"
              }
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="text-center h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <feature.icon className="mx-auto h-12 w-12 text-emerald-600 mb-4" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Before/After Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Sehen Sie den Unterschied
            </h2>
            <p className="text-xl text-gray-600">
              KI-gestützte Bearbeitung macht aus jedem Foto ein Verkaufsargument
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-gray-100 rounded-lg p-4">
                <Badge className="mb-2 bg-red-100 text-red-800 border-red-200">Vorher</Badge>
                <div className="aspect-video bg-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Originalfoto</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-emerald-50 rounded-lg p-4">
                <Badge className="mb-2 bg-emerald-100 text-emerald-800 border-emerald-200">Nachher</Badge>
                <div className="aspect-video bg-emerald-200 rounded-lg flex items-center justify-center">
                  <span className="text-emerald-700">KI-bearbeitetes Foto</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Das sagen unsere Kunden
            </h2>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                name: "Sarah Mueller",
                role: "Maklerin",
                text: "Renovirt hat unsere Arbeitsweise revolutioniert. Professionelle Fotos in Minuten statt Stunden.",
                rating: 5
              },
              {
                name: "Thomas Weber",
                role: "Architekt",
                text: "Die KI-gestützte Bearbeitung ist beeindruckend. Unsere Projekte kommen viel besser zur Geltung.",
                rating: 5
              },
              {
                name: "Lisa Schmidt",
                role: "Fotografin",
                text: "Ein Game-Changer für mein Business. Mehr Zeit für Kreativität, weniger für Nachbearbeitung.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Transparente Preise
            </h2>
            <p className="text-xl text-gray-600">
              Wählen Sie das passende Paket für Ihre Bedürfnisse
            </p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                name: "Basic",
                price: "€2,99",
                unit: "pro Bild",
                features: ["Grundbearbeitung", "Farbanpassung", "24h Bearbeitung", "JPG Download"]
              },
              {
                name: "Premium",
                price: "€4,99",
                unit: "pro Bild",
                features: ["Alles aus Basic", "KI-Retusche", "Himmel-Austausch", "6h Bearbeitung", "PDF Export"],
                popular: true
              },
              {
                name: "Custom",
                price: "€8,99",
                unit: "pro Bild",
                features: ["Alles aus Premium", "Objekt-Entfernung", "Exposé-Text", "2h Bearbeitung", "Priority Support"]
              }
            ].map((plan, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className={`relative h-full ${plan.popular ? 'ring-2 ring-emerald-500 scale-105' : ''}`}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white">
                      Beliebteste
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-gray-500">/{plan.unit}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-emerald-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    <Button 
                      className={`w-full mt-6 ${plan.popular ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-900 hover:bg-gray-800'} text-white`}
                    >
                      Jetzt starten
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Häufige Fragen
            </h2>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {[
              {
                question: "Wie lange dauert die Bearbeitung?",
                answer: "Je nach gewähltem Paket zwischen 2-24 Stunden. Premium-Kunden erhalten ihre Bilder priorisiert."
              },
              {
                question: "Welche Dateiformate werden unterstützt?",
                answer: "Wir unterstützen JPG und PNG Dateien. Die Ausgabe erfolgt standardmäßig als hochqualitative JPG-Datei."
              },
              {
                question: "Kann ich mehrere Bilder gleichzeitig hochladen?",
                answer: "Ja, Sie können bis zu 50 Bilder gleichzeitig hochladen oder ganze ZIP-Archive verwenden."
              },
              {
                question: "Gibt es eine Geld-zurück-Garantie?",
                answer: "Ja, wir bieten eine 14-tägige Geld-zurück-Garantie, falls Sie nicht zufrieden sind."
              }
            ].map((faq, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                    <ChevronDown 
                      className={`h-5 w-5 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                    />
                  </CardHeader>
                  {openFaq === index && (
                    <CardContent>
                      <p className="text-gray-600">{faq.answer}</p>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Bereit für perfekte Immobilienfotos?
            </h2>
            <p className="text-xl text-emerald-100 mb-8">
              Starten Sie noch heute und überzeugen Sie sich von der Qualität unserer KI-Bearbeitung.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 text-lg px-8 py-4">
                Kostenlos testen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-emerald-600 text-lg px-8 py-4"
              >
                Demo anfordern
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <span className="text-xl font-bold">Renovirt</span>
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
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Renovirt. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
