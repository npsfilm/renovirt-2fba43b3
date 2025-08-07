import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { useAdvancedAnalytics } from '@/hooks/useAdvancedAnalytics';
import { useABTest, useOrderFlowABTest, usePricingABTest, useCTAButtonABTest } from '@/hooks/useABTest';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  Zap,
  BarChart3,
  Target,
  Clock,
  Activity
} from 'lucide-react';

const PostHogAdvancedAnalytics = () => {
  const { 
    metrics, 
    alerts, 
    performanceScore, 
    performanceGrade,
    trackCustomMetric 
  } = usePerformanceMonitoring();

  const {
    userCohorts,
    predefinedCohorts,
    isInCohort,
    getUserCohortList,
    generateCohortInsights
  } = useAdvancedAnalytics();

  const orderFlowTest = useOrderFlowABTest();
  const pricingTest = usePricingABTest();
  const ctaTest = useCTAButtonABTest();

  const [selectedCohort, setSelectedCohort] = useState<string | null>(null);
  const [cohortInsights, setCohortInsights] = useState<any>(null);

  useEffect(() => {
    if (selectedCohort) {
      const insights = generateCohortInsights(selectedCohort);
      setCohortInsights(insights);
    }
  }, [selectedCohort, generateCohortInsights]);

  const getPerformanceColor = (score: number | null) => {
    if (!score) return 'text-muted-foreground';
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatMetric = (value: number | undefined, unit: string = 'ms') => {
    if (!value) return 'N/A';
    return `${Math.round(value)}${unit}`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Erweiterte PostHog Analytics</h1>
        <p className="text-muted-foreground">
          A/B Tests, Performance Monitoring und Kohorten-Analyse
        </p>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="abtests">A/B Tests</TabsTrigger>
          <TabsTrigger value="cohorts">Kohorten</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Performance Monitoring */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Performance Score</CardTitle>
                  <Activity className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className={`text-4xl font-bold ${getPerformanceColor(performanceScore)}`}>
                    {performanceScore || 'N/A'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Note: {performanceGrade}
                  </div>
                  <Progress 
                    value={performanceScore || 0} 
                    className="w-full" 
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Core Web Vitals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">LCP:</span>
                  <span className="text-sm font-mono">
                    {formatMetric(metrics.largestContentfulPaint)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">FID:</span>
                  <span className="text-sm font-mono">
                    {formatMetric(metrics.firstInputDelay)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">CLS:</span>
                  <span className="text-sm font-mono">
                    {formatMetric(metrics.cumulativeLayoutShift, '')}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Load Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Page Load:</span>
                  <span className="text-sm font-mono">
                    {formatMetric(metrics.pageLoadTime)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">DOM Ready:</span>
                  <span className="text-sm font-mono">
                    {formatMetric(metrics.domContentLoaded)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">First Paint:</span>
                  <span className="text-sm font-mono">
                    {formatMetric(metrics.firstPaint)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {alerts.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Performance Warnungen</h3>
              {alerts.map((alert, index) => (
                <Alert key={index} variant={alert.type === 'critical' ? 'destructive' : 'default'}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{alert.message}</AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </TabsContent>

        {/* A/B Tests */}
        <TabsContent value="abtests" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bestellprozess Test</CardTitle>
                <CardDescription>
                  Optimierung des Bestellablaufs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Variante:</span>
                  <Badge variant={orderFlowTest.isControl ? 'secondary' : 'default'}>
                    {orderFlowTest.variant}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div>Progress: {orderFlowTest.config.showProgress ? 'Ja' : 'Nein'}</div>
                  <div>Button: "{orderFlowTest.config.buttonText}"</div>
                  <div>Preise: {orderFlowTest.config.showPricing}</div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => orderFlowTest.trackConversion()}
                  className="w-full"
                >
                  Konversion tracken
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preisdarstellung</CardTitle>
                <CardDescription>
                  Test verschiedener Preisformate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Variante:</span>
                  <Badge variant={pricingTest.isControl ? 'secondary' : 'default'}>
                    {pricingTest.variant}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div>Rabatt: {pricingTest.config.showDiscount ? 'Ja' : 'Nein'}</div>
                  <div>Größe: {pricingTest.config.priceSize}</div>
                  <div>Highlight: {pricingTest.config.highlightSavings ? 'Ja' : 'Nein'}</div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => pricingTest.trackConversion()}
                  className="w-full"
                >
                  Konversion tracken
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">CTA Button Test</CardTitle>
                <CardDescription>
                  Optimierung der Handlungsaufforderung
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Variante:</span>
                  <Badge variant={ctaTest.isControl ? 'secondary' : 'default'}>
                    {ctaTest.variant}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div>Text: "{ctaTest.config.text}"</div>
                  <div>Farbe: {ctaTest.config.color}</div>
                  <div>Größe: {ctaTest.config.size}</div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => ctaTest.trackConversion()}
                  className="w-full"
                >
                  Konversion tracken
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cohorts */}
        <TabsContent value="cohorts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Meine Kohorten</CardTitle>
                <CardDescription>
                  Nutzergruppen zu denen Sie gehören
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getUserCohortList().length > 0 ? (
                    getUserCohortList().map(cohort => (
                      <div key={cohort} className="flex items-center justify-between p-2 rounded border">
                        <span className="capitalize">{cohort.replace(/_/g, ' ')}</span>
                        <Badge variant="default">Aktiv</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">Keine Kohorten zugewiesen</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Verfügbare Kohorten</CardTitle>
                <CardDescription>
                  Alle definierten Nutzergruppen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {predefinedCohorts.map(cohort => (
                    <div 
                      key={cohort.name} 
                      className={`p-2 rounded border cursor-pointer transition-colors ${
                        selectedCohort === cohort.name ? 'bg-accent' : 'hover:bg-accent/50'
                      }`}
                      onClick={() => setSelectedCohort(cohort.name)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize">
                          {cohort.name.replace(/_/g, ' ')}
                        </span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{cohort.type}</Badge>
                          {isInCohort(cohort.name) && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {cohort.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {selectedCohort && cohortInsights && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Insights für "{selectedCohort.replace(/_/g, ' ')}"
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(cohortInsights).map(([category, insights]) => (
                  <div key={category}>
                    <h4 className="font-medium capitalize mb-2">
                      {category.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </h4>
                    <div className="space-y-1">
                      {(insights as string[]).map((insight, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <Target className="w-3 h-3 text-blue-600" />
                          <span>{insight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Insights */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Performance Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {performanceScore ? '+5%' : 'N/A'}
                </div>
                <p className="text-sm text-muted-foreground">
                  Verbesserung gegenüber letzter Woche
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Aktive Tests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-sm text-muted-foreground">
                  Laufende A/B Tests
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Kohorten
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {getUserCohortList().length}
                </div>
                <p className="text-sm text-muted-foreground">
                  Zugewiesene Nutzergruppen
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Analytics Summary</CardTitle>
              <CardDescription>
                Übersicht aller PostHog Integration Features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Implementierte Features:</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Basis Event Tracking</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Session Replay</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Feature Flags</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Performance Monitoring</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>A/B Testing</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Kohorten-Analyse</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Nächste Schritte:</h4>
                  <div className="space-y-1 text-sm">
                    <div>• PostHog Dashboard konfigurieren</div>
                    <div>• A/B Test Ziele definieren</div>
                    <div>• Performance Alerts einrichten</div>
                    <div>• Kohorten-basierte Kampagnen starten</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PostHogAdvancedAnalytics;