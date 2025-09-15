"use client"

import { useState } from "react"
import { DocumentUpload } from "@/components/document-upload"
import { DocumentSummary } from "@/components/document-summary"
import { ChatInterface } from "@/components/chat-interface"
import { DocumentComparison } from "@/components/document-comparison"
import { LanguageToggle } from "@/components/language-toggle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Scale, Shield, MessageCircle, GitCompare } from "lucide-react"
import { t, type Language } from "@/lib/translations"

export interface DocumentData {
  id: string
  name: string
  content: string
  summary: string
  risks: RiskItem[]
  language: Language
}

export interface RiskItem {
  id: string
  text: string
  level: "green" | "yellow" | "red"
  explanation: string
  position: { start: number; end: number }
}

export default function HomePage() {
  const [documents, setDocuments] = useState<DocumentData[]>([])
  const [activeDocument, setActiveDocument] = useState<DocumentData | null>(null)
  const [language, setLanguage] = useState<Language>("en")

  const handleDocumentProcessed = (document: DocumentData) => {
    setDocuments((prev) => [...prev, document])
    setActiveDocument(document)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setDocuments([])
                setActiveDocument(null)
              }}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer group"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg group-hover:scale-105 transition-transform">
                <Scale className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{t("appName", language)}</h1>
                <p className="text-sm text-muted-foreground">{t("appTagline", language)}</p>
              </div>
            </button>
            <LanguageToggle language={language} onLanguageChange={setLanguage} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {documents.length === 0 ? (
          /* Welcome Screen */
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">{t("welcomeTitle", language)}</h2>
              <p className="text-xl text-muted-foreground mb-8 text-pretty">{t("welcomeSubtitle", language)}</p>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card>
                <CardHeader className="text-center">
                  <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">{t("riskDetection", language)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">{t("riskDetectionDesc", language)}</CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <MessageCircle className="w-8 h-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">{t("askQuestions", language)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">{t("askQuestionsDesc", language)}</CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <GitCompare className="w-8 h-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">{t("compareDocsTitle", language)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">{t("compareDocsDesc", language)}</CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Scale className="w-8 h-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">{t("multilingualTitle", language)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">{t("multilingualDesc", language)}</CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Upload Section */}
            <DocumentUpload onDocumentProcessed={handleDocumentProcessed} language={language} />
          </div>
        ) : (
          /* Main App Interface */
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary">{t("summary", language)}</TabsTrigger>
                <TabsTrigger value="chat">{t("askQuestions", language)}</TabsTrigger>
                <TabsTrigger value="compare">{t("compare", language)}</TabsTrigger>
                <TabsTrigger value="upload">{t("uploadNew", language)}</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="mt-6">
                {activeDocument && <DocumentSummary document={activeDocument} language={language} />}
              </TabsContent>

              <TabsContent value="chat" className="mt-6">
                {activeDocument && <ChatInterface document={activeDocument} language={language} />}
              </TabsContent>

              <TabsContent value="compare" className="mt-6">
                <DocumentComparison documents={documents} language={language} />
              </TabsContent>

              <TabsContent value="upload" className="mt-6">
                <DocumentUpload onDocumentProcessed={handleDocumentProcessed} language={language} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Scale className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">{t("appName", language)}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {language === "en"
                  ? "Making legal documents accessible to everyone through AI-powered analysis and plain language explanations."
                  : "एआई-संचालित विश्लेषण और सरल भाषा स्पष्टीकरण के माध्यम से कानूनी दस्तावेजों को सभी के लिए सुलभ बनाना।"}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{language === "en" ? "Features" : "विशेषताएं"}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>{t("riskDetection", language)}</li>
                <li>{language === "en" ? "AI Summarization" : "एआई सारांश"}</li>
                <li>{language === "en" ? "Document Comparison" : "दस्तावेज़ तुलना"}</li>
                <li>{language === "en" ? "Multilingual Support" : "बहुभाषी समर्थन"}</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{language === "en" ? "Privacy & Security" : "गोपनीयता और सुरक्षा"}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>{language === "en" ? "Documents processed securely" : "दस्तावेज़ सुरक्षित रूप से प्रसंस्कृत"}</li>
                <li>{language === "en" ? "No data stored permanently" : "कोई डेटा स्थायी रूप से संग्रहीत नहीं"}</li>
                <li>{language === "en" ? "Privacy-first design" : "गोपनीयता-प्राथमिक डिज़ाइन"}</li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>
              {language === "en"
                ? "© 2024 NyaySaar. Built for legal document accessibility."
                : "© 2024 न्यायसार। कानूनी दस्तावेज़ पहुंच के लिए निर्मित।"}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
