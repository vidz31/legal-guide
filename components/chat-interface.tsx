"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, Bot, User, Lightbulb } from "lucide-react"
import type { DocumentData } from "@/app/page"

interface ChatMessage {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  document: DocumentData
  language: "en" | "hi"
}

export function ChatInterface({ document, language }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Sample questions based on language
  const sampleQuestions = {
    en: [
      "Can the landlord increase rent anytime?",
      "What happens if I break the lease early?",
      "Am I responsible for all repairs?",
      "How much notice do I need to give to move out?",
      "What are the late payment penalties?",
    ],
    hi: [
      "क्या मकान मालिक कभी भी किराया बढ़ा सकता है?",
      "अगर मैं जल्दी लीज तोड़ूं तो क्या होगा?",
      "क्या मैं सभी मरम्मत के लिए जिम्मेदार हूं?",
      "बाहर जाने के लिए मुझे कितना नोटिस देना होगा?",
      "देर से भुगतान की क्या पेनल्टी है?",
    ],
  }

  // Mock AI response function
  const generateAIResponse = async (question: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock responses based on common legal questions
    const responses = {
      en: {
        rent: "Based on your rental agreement, the landlord cannot increase rent during the lease term without your consent. However, the lease will automatically renew, and rent increases may apply at renewal. Check your local rent control laws for additional protections.",
        early:
          "According to the document, early termination will result in forfeiture of your security deposit AND payment of remaining rent. This is an unusually harsh penalty. Consider negotiating this clause or consulting a local tenant rights organization.",
        repairs:
          "The agreement states you're responsible for ALL maintenance and repairs, including normal wear and tear. This is unusual and potentially unenforceable in many jurisdictions. Normal wear and tear is typically the landlord's responsibility.",
        notice:
          "The document requires 30 days written notice for termination. However, there's also an auto-renewal clause requiring 60 days notice to avoid renewal. Make sure to provide the longer notice period to avoid unwanted renewal.",
        late: "Late fees of $50 apply after the 5th of the month. This appears reasonable, but check your local laws as some jurisdictions cap late fees or require longer grace periods.",
      },
      hi: {
        rent: "आपके किराया समझौते के आधार पर, मकान मालिक आपकी सहमति के बिना लीज अवधि के दौरान किराया नहीं बढ़ा सकता। हालांकि, लीज स्वचालित रूप से नवीकृत होगी, और नवीकरण पर किराया वृद्धि लागू हो सकती है।",
        early:
          "दस्तावेज के अनुसार, जल्दी समाप्ति से आपकी सिक्यूरिटी डिपॉजिट जब्त हो जाएगी और शेष किराया भी देना होगा। यह असामान्य रूप से कठोर दंड है।",
        repairs:
          "समझौते में कहा गया है कि आप सभी रखरखाव और मरम्मत के लिए जिम्मेदार हैं, सामान्य टूट-फूट सहित। यह असामान्य है और कई न्यायक्षेत्रों में संभावित रूप से अप्रवर्तनीय है।",
        notice:
          "दस्तावेज़ में समाप्ति के लिए 30 दिन का लिखित नोटिस आवश्यक है। हालांकि, नवीकरण से बचने के लिए 60 दिन के नोटिस की आवश्यकता वाला एक स्वचालित नवीकरण खंड भी है।",
        late: "महीने की 5 तारीख के बाद $50 का विलंब शुल्क लागू होता है। यह उचित लगता है, लेकिन अपने स्थानीय कानूनों की जांच करें।",
      },
    }

    // Simple keyword matching for demo
    const lowerQuestion = question.toLowerCase()
    if (lowerQuestion.includes("rent") || lowerQuestion.includes("किराया")) {
      return responses[language].rent
    } else if (lowerQuestion.includes("early") || lowerQuestion.includes("break") || lowerQuestion.includes("जल्दी")) {
      return responses[language].early
    } else if (
      lowerQuestion.includes("repair") ||
      lowerQuestion.includes("maintenance") ||
      lowerQuestion.includes("मरम्मत")
    ) {
      return responses[language].repairs
    } else if (lowerQuestion.includes("notice") || lowerQuestion.includes("move") || lowerQuestion.includes("नोटिस")) {
      return responses[language].notice
    } else if (lowerQuestion.includes("late") || lowerQuestion.includes("penalty") || lowerQuestion.includes("देर")) {
      return responses[language].late
    } else {
      // Generic response
      return language === "en"
        ? "I've analyzed your document and can help explain specific clauses. Could you ask about a particular aspect like rent, termination, repairs, or penalties? I can provide detailed explanations based on what's written in your agreement."
        : "मैंने आपके दस्तावेज़ का विश्लेषण किया है और विशिष्ट खंडों को समझाने में मदद कर सकता हूं। क्या आप किराया, समाप्ति, मरम्मत, या दंड जैसे किसी विशेष पहलू के बारे में पूछ सकते हैं?"
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await generateAIResponse(input.trim())
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error generating response:", error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          language === "en"
            ? "Sorry, I encountered an error. Please try again."
            : "क्षमा करें, मुझे एक त्रुटि का सामना करना पड़ा। कृपया पुनः प्रयास करें।",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSampleQuestion = (question: string) => {
    setInput(question)
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages])

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-primary" />
            <div>
              <CardTitle className="text-xl">
                {language === "en" ? "Ask Questions About Your Document" : "अपने दस्तावेज़ के बारे में प्रश्न पूछें"}
              </CardTitle>
              <CardDescription>
                {language === "en"
                  ? "Get instant answers about clauses, risks, and legal terms"
                  : "खंडों, जोखिमों और कानूनी शर्तों के बारे में तुरंत उत्तर प्राप्त करें"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col gap-4">
          {/* Chat Messages */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {language === "en" ? "Start a conversation" : "बातचीत शुरू करें"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {language === "en"
                      ? "Ask me anything about your legal document. I can explain clauses, identify risks, and provide guidance."
                      : "अपने कानूनी दस्तावेज़ के बारे में मुझसे कुछ भी पूछें। मैं खंडों को समझा सकता हूं, जोखिमों की पहचान कर सकता हूं।"}
                  </p>

                  {/* Sample Questions */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
                      <Lightbulb className="w-4 h-4" />
                      {language === "en" ? "Try asking:" : "पूछने की कोशिश करें:"}
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {sampleQuestions[language].slice(0, 3).map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSampleQuestion(question)}
                          className="text-xs"
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.type === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  {message.type === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="bg-muted rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {language === "en" ? "Analyzing..." : "विश्लेषण कर रहा है..."}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t pt-4">
            {messages.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                  <Lightbulb className="w-4 h-4" />
                  {language === "en" ? "More questions you can ask:" : "अधिक प्रश्न जो आप पूछ सकते हैं:"}
                </div>
                <div className="flex flex-wrap gap-2">
                  {sampleQuestions[language].slice(3).map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSampleQuestion(question)}
                      className="text-xs h-7"
                      disabled={isLoading}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  language === "en"
                    ? "Ask about clauses, risks, or legal terms..."
                    : "खंडों, जोखिमों या कानूनी शर्तों के बारे में पूछें..."
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                disabled={isLoading}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!input.trim() || isLoading} size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Context */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Badge variant="outline">{language === "en" ? "Document Context" : "दस्तावेज़ संदर्भ"}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">
              <strong>{language === "en" ? "Document:" : "दस्तावेज़:"}</strong> {document.name}
            </p>
            <p className="mb-2">
              <strong>{language === "en" ? "Risks Found:" : "जोखिम मिले:"}</strong>{" "}
              <span className="text-red-600">{document.risks.filter((r) => r.level === "red").length} High</span>,{" "}
              <span className="text-yellow-600">
                {document.risks.filter((r) => r.level === "yellow").length} Medium
              </span>
              , <span className="text-green-600">{document.risks.filter((r) => r.level === "green").length} Low</span>
            </p>
            <p className="text-xs">
              {language === "en"
                ? "I can answer questions about any part of this document and explain legal terms in plain language."
                : "मैं इस दस्तावेज़ के किसी भी हिस्से के बारे में प्रश्नों का उत्तर दे सकता हूं और कानूनी शर्तों को सरल भाषा में समझा सकता हूं।"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
