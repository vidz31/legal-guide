"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { GitCompare, FileText, AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { DocumentData } from "@/app/page"

interface DocumentComparisonProps {
  documents: DocumentData[]
  language: "en" | "hi"
}

interface ComparisonResult {
  category: string
  document1: string
  document2: string
  difference: "better" | "worse" | "same"
  explanation: string
}

export function DocumentComparison({ documents, language }: DocumentComparisonProps) {
  const [selectedDoc1, setSelectedDoc1] = useState<string>("")
  const [selectedDoc2, setSelectedDoc2] = useState<string>("")
  const [comparisonResults, setComparisonResults] = useState<ComparisonResult[]>([])
  const [isComparing, setIsComparing] = useState(false)

  // Mock comparison function
  const generateComparison = async (doc1: DocumentData, doc2: DocumentData): Promise<ComparisonResult[]> => {
    // Simulate AI comparison processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock comparison results
    const results: ComparisonResult[] = [
      {
        category: language === "en" ? "Rent Terms" : "किराया शर्तें",
        document1: "$1,200/month, due 1st",
        document2: "$1,350/month, due 5th",
        difference: "better",
        explanation:
          language === "en"
            ? "Document 1 has lower rent and earlier due date, which is generally better for cash flow."
            : "दस्तावेज़ 1 में कम किराया और पहली तारीख है, जो आम तौर पर बेहतर है।",
      },
      {
        category: language === "en" ? "Late Fees" : "विलंब शुल्क",
        document1: "$50 after 5 days",
        document2: "$25 after 3 days",
        difference: "worse",
        explanation:
          language === "en"
            ? "Document 1 has higher late fees but longer grace period. Document 2 is more forgiving overall."
            : "दस्तावेज़ 1 में अधिक विलंब शुल्क है लेकिन अधिक छूट अवधि है। दस्तावेज़ 2 कुल मिलाकर बेहतर है।",
      },
      {
        category: language === "en" ? "Security Deposit" : "सिक्यूरिटी डिपॉजिट",
        document1: "2 months rent",
        document2: "1 month rent",
        difference: "worse",
        explanation:
          language === "en"
            ? "Document 1 requires double the security deposit, tying up more of your money."
            : "दस्तावेज़ 1 में दोगुनी सिक्यूरिटी डिपॉजिट चाहिए, जो आपके अधिक पैसे बांधती है।",
      },
      {
        category: language === "en" ? "Early Termination" : "जल्दी समाप्ति",
        document1: "Forfeit deposit + remaining rent",
        document2: "2 months penalty",
        difference: "worse",
        explanation:
          language === "en"
            ? "Document 1 has much harsher early termination penalties. Document 2's fixed penalty is more predictable."
            : "दस्तावेज़ 1 में बहुत कठोर जल्दी समाप्ति दंड है। दस्तावेज़ 2 का निश्चित दंड अधिक अनुमानित है।",
      },
      {
        category: language === "en" ? "Maintenance Responsibility" : "रखरखाव जिम्मेदारी",
        document1: "Tenant pays all repairs",
        document2: "Landlord pays major repairs",
        difference: "worse",
        explanation:
          language === "en"
            ? "Document 1 makes tenant responsible for all repairs, which is unusual and potentially costly."
            : "दस्तावेज़ 1 किरायेदार को सभी मरम्मत के लिए जिम्मेदार बनाता है, जो असामान्य और संभावित रूप से महंगा है।",
      },
      {
        category: language === "en" ? "Auto-Renewal Notice" : "स्वचालित नवीकरण नोटिस",
        document1: "60 days notice required",
        document2: "30 days notice required",
        difference: "worse",
        explanation:
          language === "en"
            ? "Document 1 requires longer notice period, making it harder to avoid unwanted renewal."
            : "दस्तावेज़ 1 में अधिक नोटिस अवधि चाहिए, जिससे अवांछित नवीकरण से बचना कठिन हो जाता है।",
      },
    ]

    return results
  }

  const handleCompare = async () => {
    if (!selectedDoc1 || !selectedDoc2 || selectedDoc1 === selectedDoc2) return

    const doc1 = documents.find((d) => d.id === selectedDoc1)
    const doc2 = documents.find((d) => d.id === selectedDoc2)

    if (!doc1 || !doc2) return

    setIsComparing(true)
    try {
      const results = await generateComparison(doc1, doc2)
      setComparisonResults(results)
    } catch (error) {
      console.error("Error comparing documents:", error)
    } finally {
      setIsComparing(false)
    }
  }

  const getDifferenceIcon = (difference: ComparisonResult["difference"]) => {
    switch (difference) {
      case "better":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "worse":
        return <TrendingDown className="w-4 h-4 text-red-600" />
      case "same":
        return <Minus className="w-4 h-4 text-gray-600" />
    }
  }

  const getDifferenceBadge = (difference: ComparisonResult["difference"]) => {
    const variants = {
      better: "default" as const,
      worse: "destructive" as const,
      same: "secondary" as const,
    }

    const labels = {
      en: { better: "Better", worse: "Worse", same: "Same" },
      hi: { better: "बेहतर", worse: "खराब", same: "समान" },
    }

    return (
      <Badge variant={variants[difference]} className="text-xs">
        {labels[language][difference]}
      </Badge>
    )
  }

  const getOverallRecommendation = () => {
    if (comparisonResults.length === 0) return null

    const betterCount = comparisonResults.filter((r) => r.difference === "better").length
    const worseCount = comparisonResults.filter((r) => r.difference === "worse").length

    const doc1 = documents.find((d) => d.id === selectedDoc1)
    const doc2 = documents.find((d) => d.id === selectedDoc2)

    if (betterCount > worseCount) {
      return {
        recommended: doc1?.name || "Document 1",
        reason:
          language === "en"
            ? `Document 1 is better in ${betterCount} out of ${comparisonResults.length} categories`
            : `दस्तावेज़ 1, ${comparisonResults.length} में से ${betterCount} श्रेणियों में बेहतर है`,
        color: "text-green-600",
      }
    } else if (worseCount > betterCount) {
      return {
        recommended: doc2?.name || "Document 2",
        reason:
          language === "en"
            ? `Document 2 is better in ${worseCount} out of ${comparisonResults.length} categories`
            : `दस्तावेज़ 2, ${comparisonResults.length} में से ${worseCount} श्रेणियों में बेहतर है`,
        color: "text-green-600",
      }
    } else {
      return {
        recommended: language === "en" ? "Both documents are similar" : "दोनों दस्तावेज़ समान हैं",
        reason:
          language === "en"
            ? "Consider other factors like location, amenities, and landlord reputation"
            : "स्थान, सुविधाओं और मकान मालिक की प्रतिष्ठा जैसे अन्य कारकों पर विचार करें",
        color: "text-muted-foreground",
      }
    }
  }

  if (documents.length < 2) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <GitCompare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="text-xl">{language === "en" ? "Document Comparison" : "दस्तावेज़ तुलना"}</CardTitle>
            <CardDescription>
              {language === "en"
                ? "Upload at least 2 documents to compare them side-by-side"
                : "साथ-साथ तुलना करने के लिए कम से कम 2 दस्तावेज़ अपलोड करें"}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              {language === "en"
                ? "You currently have " + documents.length + " document(s). Upload more documents to enable comparison."
                : "आपके पास वर्तमान में " + documents.length + " दस्तावेज़ है। तुलना सक्षम करने के लिए अधिक दस्तावेज़ अपलोड करें।"}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const recommendation = getOverallRecommendation()

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Document Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-primary" />
            {language === "en" ? "Compare Documents" : "दस्तावेज़ों की तुलना करें"}
          </CardTitle>
          <CardDescription>
            {language === "en"
              ? "Select two documents to compare their terms, risks, and conditions"
              : "उनकी शर्तों, जोखिमों और स्थितियों की तुलना करने के लिए दो दस्तावेज़ चुनें"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">{language === "en" ? "Document 1" : "दस्तावेज़ 1"}</label>
              <Select value={selectedDoc1} onValueChange={setSelectedDoc1}>
                <SelectTrigger>
                  <SelectValue placeholder={language === "en" ? "Select first document" : "पहला दस्तावेज़ चुनें"} />
                </SelectTrigger>
                <SelectContent>
                  {documents.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id} disabled={doc.id === selectedDoc2}>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {doc.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{language === "en" ? "Document 2" : "दस्तावेज़ 2"}</label>
              <Select value={selectedDoc2} onValueChange={setSelectedDoc2}>
                <SelectTrigger>
                  <SelectValue placeholder={language === "en" ? "Select second document" : "दूसरा दस्तावेज़ चुनें"} />
                </SelectTrigger>
                <SelectContent>
                  {documents.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id} disabled={doc.id === selectedDoc1}>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {doc.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleCompare}
              disabled={!selectedDoc1 || !selectedDoc2 || selectedDoc1 === selectedDoc2 || isComparing}
              className="w-full"
            >
              {isComparing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  {language === "en" ? "Comparing..." : "तुलना कर रहा है..."}
                </div>
              ) : (
                <>
                  <GitCompare className="w-4 h-4 mr-2" />
                  {language === "en" ? "Compare" : "तुलना करें"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {comparisonResults.length > 0 && (
        <>
          {/* Overall Recommendation */}
          {recommendation && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{language === "en" ? "Recommendation" : "सिफारिश"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className={`font-semibold text-lg ${recommendation.color}`}>{recommendation.recommended}</h3>
                    <p className="text-muted-foreground mt-1">{recommendation.reason}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Detailed Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{language === "en" ? "Detailed Comparison" : "विस्तृत तुलना"}</CardTitle>
              <CardDescription>
                {language === "en"
                  ? "Side-by-side analysis of key terms and conditions"
                  : "मुख्य शर्तों और स्थितियों का साथ-साथ विश्लेषण"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {comparisonResults.map((result, index) => (
                    <div key={index}>
                      <div className="grid md:grid-cols-4 gap-4 items-start">
                        <div className="font-medium text-sm">{result.category}</div>
                        <div className="text-sm">
                          <div className="font-medium text-xs text-muted-foreground mb-1">
                            {documents.find((d) => d.id === selectedDoc1)?.name}
                          </div>
                          <div>{result.document1}</div>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium text-xs text-muted-foreground mb-1">
                            {documents.find((d) => d.id === selectedDoc2)?.name}
                          </div>
                          <div>{result.document2}</div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {getDifferenceIcon(result.difference)}
                            {getDifferenceBadge(result.difference)}
                          </div>
                          <p className="text-xs text-muted-foreground">{result.explanation}</p>
                        </div>
                      </div>
                      {index < comparisonResults.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Risk Comparison */}
          <div className="grid md:grid-cols-2 gap-6">
            {[selectedDoc1, selectedDoc2].map((docId, index) => {
              const doc = documents.find((d) => d.id === docId)
              if (!doc) return null

              const riskCounts = doc.risks.reduce(
                (acc, risk) => {
                  acc[risk.level]++
                  return acc
                },
                { green: 0, yellow: 0, red: 0 },
              )

              return (
                <Card key={docId}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      {doc.name}
                    </CardTitle>
                    <CardDescription>
                      {language === "en" ? "Risk Analysis Summary" : "जोखिम विश्लेषण सारांश"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
                        <div className="text-xl font-bold text-green-700">{riskCounts.green}</div>
                        <div className="text-xs text-green-600">{language === "en" ? "Safe" : "सुरक्षित"}</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                        <div className="text-xl font-bold text-yellow-700">{riskCounts.yellow}</div>
                        <div className="text-xs text-yellow-600">{language === "en" ? "Caution" : "सावधानी"}</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-red-50 border border-red-200">
                        <div className="text-xl font-bold text-red-700">{riskCounts.red}</div>
                        <div className="text-xs text-red-600">{language === "en" ? "High Risk" : "उच्च जोखिम"}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">{language === "en" ? "Top Risks:" : "मुख्य जोखिम:"}</h4>
                      {doc.risks
                        .filter((r) => r.level === "red")
                        .slice(0, 2)
                        .map((risk) => (
                          <div key={risk.id} className="text-xs text-muted-foreground">
                            • {risk.text.substring(0, 60)}...
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
