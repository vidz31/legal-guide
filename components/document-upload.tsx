"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "@/lib/dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText } from "lucide-react"
import { t, type Language } from "@/lib/translations"
import type { DocumentData, RiskItem } from "@/app/page"

interface DocumentUploadProps {
  onDocumentProcessed: (document: DocumentData) => void
  language: Language
}

export function DocumentUpload({ onDocumentProcessed, language }: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<string>("")

  // Mock AI processing function
  const processDocument = async (file: File): Promise<DocumentData> => {
    // Simulate OCR extraction
    setStatus(t("extractingText", language))
    setProgress(25)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate AI summarization
    setStatus(t("generatingSummary", language))
    setProgress(50)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate risk detection
    setStatus(t("analyzingRisks", language))
    setProgress(75)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate translation if needed
    if (language === "hi") {
      setStatus("हिंदी में अनुवाद किया जा रहा है...")
      setProgress(90)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    setProgress(100)
    setStatus(t("processingComplete", language))

    // Mock document data
    const mockContent = `RENTAL AGREEMENT

This Rental Agreement ("Agreement") is entered into on [DATE] between [LANDLORD NAME] ("Landlord") and [TENANT NAME] ("Tenant").

PROPERTY: The property located at [ADDRESS] ("Property").

TERM: This lease shall commence on [START DATE] and terminate on [END DATE].

RENT: Tenant agrees to pay monthly rent of $[AMOUNT] due on the 1st of each month. Late fees of $50 will be charged for payments received after the 5th of the month.

SECURITY DEPOSIT: Tenant shall pay a security deposit of $[AMOUNT] which may be used for damages beyond normal wear and tear.

TERMINATION: Either party may terminate this agreement with 30 days written notice. Early termination by tenant will result in forfeiture of security deposit and payment of remaining rent.

AUTO-RENEWAL: This lease will automatically renew for additional 12-month terms unless either party provides 60 days written notice.

MAINTENANCE: Tenant is responsible for all maintenance and repairs regardless of cause, including normal wear and tear.`

    const mockRisks: RiskItem[] = [
      {
        id: "1",
        text: "Late fees of $50 will be charged for payments received after the 5th of the month",
        level: "yellow",
        explanation:
          language === "en"
            ? "This clause imposes late fees. Make sure you understand the grace period and fee amount."
            : "यह खंड विलंब शुल्क लगाता है। सुनिश्चित करें कि आप छूट अवधि और शुल्क राशि को समझते हैं।",
        position: { start: 350, end: 420 },
      },
      {
        id: "2",
        text: "Early termination by tenant will result in forfeiture of security deposit and payment of remaining rent",
        level: "red",
        explanation:
          language === "en"
            ? "This is a very restrictive clause. You could lose your deposit AND pay remaining rent if you leave early."
            : "यह एक बहुत प्रतिबंधात्मक खंड है। यदि आप जल्दी छोड़ते हैं तो आप अपनी जमा राशि खो सकते हैं और शेष किराया भी दे सकते हैं।",
        position: { start: 650, end: 750 },
      },
      {
        id: "3",
        text: "This lease will automatically renew for additional 12-month terms unless either party provides 60 days written notice",
        level: "yellow",
        explanation:
          language === "en"
            ? "Auto-renewal clause requires 60 days notice. Mark your calendar to avoid unwanted renewal."
            : "स्वचालित नवीकरण खंड के लिए 60 दिन का नोटिस चाहिए। अवांछित नवीकरण से बचने के लिए अपने कैलेंडर में चिह्नित करें।",
        position: { start: 800, end: 900 },
      },
      {
        id: "4",
        text: "Tenant is responsible for all maintenance and repairs regardless of cause, including normal wear and tear",
        level: "red",
        explanation:
          language === "en"
            ? "This clause makes you responsible for ALL repairs, even normal wear and tear. This is unusual and potentially unfair."
            : "यह खंड आपको सभी मरम्मत के लिए जिम्मेदार बनाता है, यहां तक कि सामान्य टूट-फूट के लिए भी। यह असामान्य और संभावित रूप से अनुचित है।",
        position: { start: 950, end: 1050 },
      },
    ]

    const mockSummary =
      language === "en"
        ? `This rental agreement contains several concerning clauses:

**Key Terms:**
• Monthly rent payment due on 1st of each month
• Security deposit required
• 30-day notice required for termination

**⚠️ Risk Highlights:**
• **High Risk**: Early termination results in loss of deposit AND remaining rent payments
• **High Risk**: Tenant responsible for ALL maintenance, including normal wear and tear
• **Caution**: Auto-renewal with 60-day notice requirement
• **Caution**: $50 late fee after 5-day grace period

**What this means for you:**
This agreement heavily favors the landlord with unusual clauses that could cost you significantly. The maintenance clause and early termination penalty are particularly concerning and may not be enforceable in some jurisdictions.`
        : `इस किराया समझौते में कई चिंताजनक खंड हैं:

**मुख्य शर्तें:**
• मासिक किराया हर महीने की 1 तारीख को देय
• सिक्यूरिटी डिपॉजिट आवश्यक
• समाप्ति के लिए 30 दिन का नोटिस आवश्यक

**⚠️ जोखिम हाइलाइट्स:**
• **उच्च जोखिम**: जल्दी समाप्ति से जमा राशि और शेष किराया दोनों का नुकसान
• **उच्च जोखिम**: किरायेदार सभी रखरखाव के लिए जिम्मेदार, सामान्य टूट-फूट सहित
• **सावधानी**: 60 दिन के नोटिस के साथ स्वचालित नवीकरण
• **सावधानी**: 5 दिन की छूट अवधि के बाद $50 विलंब शुल्क

**आपके लिए इसका मतलब:**
यह समझौता असामान्य खंडों के साथ मकान मालिक का भारी पक्ष लेता है जो आपको काफी नुकसान पहुंचा सकता है। रखरखाव खंड और जल्दी समाप्ति जुर्माना विशेष रूप से चिंताजनक हैं।`

    return {
      id: Date.now().toString(),
      name: file.name,
      content: mockContent,
      summary: mockSummary,
      risks: mockRisks,
      language,
    }
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      setUploading(true)
      setProgress(0)

      try {
        const processedDocument = await processDocument(file)
        onDocumentProcessed(processedDocument)
      } catch (error) {
        console.error("Error processing document:", error)
        setStatus(t("processingError", language))
      } finally {
        setUploading(false)
        setProgress(0)
        setStatus("")
      }
    },
    [language, onDocumentProcessed],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxFiles: 1,
    disabled: uploading,
  })

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t("uploadTitle", language)}</CardTitle>
          <CardDescription>{t("uploadSubtitle", language)}</CardDescription>
        </CardHeader>
        <CardContent>
          {!uploading ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {isDragActive ? t("dropHere", language) : t("dragDropText", language)}
              </h3>
              <p className="text-muted-foreground mb-4">{t("supportedFiles", language)}</p>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                {t("chooseFile", language)}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{status}</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            </div>
          )}

          {/* Sample Documents */}
          <div className="mt-8 pt-6 border-t">
            <h4 className="font-semibold mb-3">{t("sampleDocuments", language)}</h4>
            <div className="grid gap-2">
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {
                  const mockFile = new File([""], "rental-agreement.pdf", { type: "application/pdf" })
                  onDrop([mockFile])
                }}
                disabled={uploading}
              >
                <FileText className="w-4 h-4 mr-2" />
                {t("sampleRental", language)}
              </Button>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {
                  const mockFile = new File([""], "loan-agreement.pdf", { type: "application/pdf" })
                  onDrop([mockFile])
                }}
                disabled={uploading}
              >
                <FileText className="w-4 h-4 mr-2" />
                {t("sampleLoan", language)}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
