
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { supabase } from '@/integrations/supabase/client';
import { 
  Package, 
  CreditCard, 
  Upload, 
  Settings, 
  User, 
  FileImage,
  Clock,
  HelpCircle
} from 'lucide-react';


const HelpFAQSection = () => {
  const [faqData, setFaqData] = useState<Array<{title: string, content: string}>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFAQData = async () => {
      try {
        const { data, error } = await supabase
          .from('help_documents')
          .select('title, content')
          .eq('is_active', true)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching FAQ data:', error);
        } else {
          setFaqData(data || []);
        }
      } catch (error) {
        console.error('Error fetching FAQ data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQData();
  }, []);

  // Group FAQs into categories for display
  const categorizedFAQs = [
    {
      id: 'packages',
      title: 'Pakete & Preise',
      icon: Package,
      description: 'Informationen zu unseren Bearbeitungspaketen',
      questions: faqData.filter(faq => 
        faq.title.toLowerCase().includes('paket') || 
        faq.title.toLowerCase().includes('preis') ||
        faq.title.toLowerCase().includes('rabatt') ||
        faq.title.toLowerCase().includes('bildbearbeitungsleistungen')
      )
    },
    {
      id: 'delivery',
      title: 'Lieferung & Bearbeitung',
      icon: Clock,
      description: 'Lieferzeiten und Bearbeitungsprozess',
      questions: faqData.filter(faq => 
        faq.title.toLowerCase().includes('lange') ||
        faq.title.toLowerCase().includes('lieferung') ||
        faq.title.toLowerCase().includes('bearbeitung') ||
        faq.title.toLowerCase().includes('wochenende') ||
        faq.title.toLowerCase().includes('revision') ||
        faq.title.toLowerCase().includes('zufrieden')
      )
    },
    {
      id: 'upload',
      title: 'Upload & Dateiformate',
      icon: Upload,
      description: 'Alles rund um den Bildupload',
      questions: faqData.filter(faq => 
        faq.title.toLowerCase().includes('format') ||
        faq.title.toLowerCase().includes('größe') ||
        faq.title.toLowerCase().includes('gelöscht') ||
        faq.title.toLowerCase().includes('sicher')
      )
    },
    {
      id: 'editing',
      title: 'Bildbearbeitung',
      icon: FileImage,
      description: 'Details zur Bearbeitung Ihrer Fotos',
      questions: faqData.filter(faq => 
        faq.title.toLowerCase().includes('bearbeitet') ||
        faq.title.toLowerCase().includes('objekt') ||
        faq.title.toLowerCase().includes('hdr') ||
        faq.title.toLowerCase().includes('bracketing') ||
        faq.title.toLowerCase().includes('wünsche') ||
        faq.title.toLowerCase().includes('virtual') ||
        faq.title.toLowerCase().includes('video') ||
        faq.title.toLowerCase().includes('einzelne')
      )
    },
    {
      id: 'payment',
      title: 'Zahlung & Abrechnung',
      icon: CreditCard,
      description: 'Zahlungsmethoden und Abrechnungsfragen',
      questions: faqData.filter(faq => 
        faq.title.toLowerCase().includes('bezahlung') ||
        faq.title.toLowerCase().includes('rechnung') ||
        faq.title.toLowerCase().includes('stornieren')
      )
    },
    {
      id: 'support',
      title: 'Support & Kontakt',
      icon: HelpCircle,
      description: 'Hilfe und Kontaktmöglichkeiten',
      questions: faqData.filter(faq => 
        faq.title.toLowerCase().includes('kundenservice') ||
        faq.title.toLowerCase().includes('status') ||
        faq.title.toLowerCase().includes('zufrieden') ||
        faq.title.toLowerCase().includes('kontakt')
      )
    }
  ].filter(category => category.questions.length > 0);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-light text-foreground">
            Häufig gestellte Fragen
          </h2>
          <p className="text-lg text-muted-foreground">
            Lade FAQs...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-light text-foreground">
          Häufig gestellte Fragen
        </h2>
        <p className="text-lg text-muted-foreground">
          Finden Sie schnell Antworten auf die wichtigsten Fragen
        </p>
      </div>

      {/* FAQ Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categorizedFAQs.map((category) => (
          <Card key={category.id} className="h-full hover:shadow-md transition-shadow">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <category.icon className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">{category.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-sm">
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {item.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HelpFAQSection;
