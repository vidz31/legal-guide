"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, Shield, AlertCircle, FileText, Eye, EyeOff } from "lucide-react"
import type { DocumentData, RiskItem } from "@/app/page"

interface DocumentSummaryProps {
  document: DocumentData
  language: "en" | "hi"
}

export function DocumentSummary({ document, language }: DocumentSummaryProps) {
  const [showOriginal, setShowOriginal] = useState(false)
  const [selectedRisk, setSelectedRisk] = useState<RiskItem | null>(null)

  const getRiskIcon = (level: RiskItem["level"]) => {
    switch (level) {
      case "green":
        return <Shield className="w-4 h-4 text-green-600" />
      case "yellow":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case "red":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
    }
  }

  const getRiskLabel = (level: RiskItem["level"]) => {
    const labels = {
      en: { green: "Safe", yellow: "Caution", red: "High Risk" },
      hi: { green: "सुरक्षित", yellow: "सावधानी", red: "उच्च जोखिम" },
    }
    return labels[language][level]
  }

  const highlightRisks = (content: string, risks: RiskItem[]) => {
    let highlightedContent = content
    const sortedRisks = [...risks].sort((a, b) => b.position.start - a.position.start)

    sortedRisks.forEach((risk) => {
      const before = highlightedContent.substring(0, risk.position.start)
      const riskText = highlightedContent.substring(risk.position.start, risk.position.end)
      const after = highlightedContent.substring(risk.position.end)

      const highlightClass = `risk-${risk.level} document-highlight`
      highlightedContent = `${before}<span class="${highlightClass}" data-risk-id="${risk.id}">${riskText}</span>${after}`
    })

    return highlightedContent
  }

  const riskCounts = document.risks.reduce(
    (acc, risk) => {
      acc[risk.level]++
      return acc
    },
    { green: 0, yellow: 0, red: 0 },
  )

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Summary Panel */}
      <div className="lg:col-span-2 space-y-6">
        {/* Document Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-primary" />
                <div>
                  <CardTitle className="text-xl">{document.name}</CardTitle>
                  <CardDescription>{language === "en" ? "AI-Generated Summary" : "एआई-जनरेटेड सारांश"}</CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowOriginal(!showOriginal)}>
                {showOriginal ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showOriginal
                  ? language === "en"
                    ? "Hide Original"
                    : "मूल छुपाएं"
                  : language === "en"
                    ? "Show Original"
                    : "मूल दिखाएं"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ __html: document.summary.replace(/\n/g, "<br>") }} />
            </div>
          </CardContent>
        </Card>

        {/* Original Document */}
        {showOriginal && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {language === "en" ? "Original Document with Risk Highlights" : "जोखिम हाइलाइट्स के साथ मूल दस्तावेज़"}
              </CardTitle>
              <CardDescription>
                {language === "en"
                  ? "Click on highlighted text to see risk explanations"
                  : "जोखिम स्पष्टीकरण देखने के लिए हाइलाइट किए गए टेक्स्ट पर क्लिक करें"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 w-full rounded border p-4">
                <div
                  className="whitespace-pre-wrap text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlightRisks(document.content, document.risks),
                  }}
                  onClick={(e) => {
                    const target = e.target as HTMLElement
                    const riskId = target.getAttribute("data-risk-id")
                    if (riskId) {
                      const risk = document.risks.find((r) => r.id === riskId)
                      setSelectedRisk(risk || null)
                    }
                  }}
                />
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Risk Analysis Panel */}
      <div className="space-y-6">
        {/* Risk Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary" />
              {language === "en" ? "Risk Analysis" : "जोखिम विश्लेषण"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Risk Counts */}
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="text-2xl font-bold text-green-700">{riskCounts.green}</div>
                  <div className="text-xs text-green-600">{language === "en" ? "Safe" : "सुरक्षित"}</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                  <div className="text-2xl font-bold text-yellow-700">{riskCounts.yellow}</div>
                  <div className="text-xs text-yellow-600">{language === "en" ? "Caution" : "सावधानी"}</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-red-50 border border-red-200">
                  <div className="text-2xl font-bold text-red-700">{riskCounts.red}</div>
                  <div className="text-xs text-red-600">{language === "en" ? "High Risk" : "उच्च जोखिम"}</div>
                </div>
              </div>

              {/* Overall Risk Score */}
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-lg font-semibold text-foreground">
                  {language === "en" ? "Overall Risk Level" : "समग्र जोखिम स्तर"}
                </div>
                <Badge
                  variant={riskCounts.red > 0 ? "destructive" : riskCounts.yellow > 0 ? "secondary" : "default"}
                  className="mt-2"
                >
                  {riskCounts.red > 0
                    ? language === "en"
                      ? "High Risk"
                      : "उच्च जोखिम"
                    : riskCounts.yellow > 0
                      ? language === "en"
                        ? "Medium Risk"
                        : "मध्यम जोखिम"
                      : language === "en"
                        ? "Low Risk"
                        : "कम जोखिम"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{language === "en" ? "Risk Details" : "जोखिम विवरण"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {document.risks.map((risk, index) => (
                  <div key={risk.id}>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start p-3 h-auto">
                          <div className="flex items-start gap-3 text-left">
                            {getRiskIcon(risk.level)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant={risk.level === "red" ? "destructive" : "secondary"} className="text-xs">
                                  {getRiskLabel(risk.level)}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">{risk.text}</p>
                            </div>
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80" align="start">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            {getRiskIcon(risk.level)}
                            <Badge variant={risk.level === "red" ? "destructive" : "secondary"}>
                              {getRiskLabel(risk.level)}
                            </Badge>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm mb-2">
                              {language === "en" ? "Risky Clause:" : "जोखिमपूर्ण खंड:"}
                            </h4>
                            <p className="text-sm text-muted-foreground italic">"{risk.text}"</p>
                          </div>
                          <Separator />
                          <div>
                            <h4 className="font-semibold text-sm mb-2">
                              {language === "en" ? "What this means:" : "इसका मतलब:"}
                            </h4>
                            <p className="text-sm">{risk.explanation}</p>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    {index < document.risks.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Selected Risk Modal */}
      {selectedRisk && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getRiskIcon(selectedRisk.level)}
                  <CardTitle className="text-lg">{getRiskLabel(selectedRisk.level)}</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedRisk(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">{language === "en" ? "Risky Clause:" : "जोखिमपूर्ण खंड:"}</h4>
                <p className="text-sm text-muted-foreground italic">"{selectedRisk.text}"</p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold text-sm mb-2">{language === "en" ? "What this means:" : "इसका मतलब:"}</h4>
                <p className="text-sm">{selectedRisk.explanation}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
