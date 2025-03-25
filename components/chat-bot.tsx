"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { MessageSquare, Send, AlertTriangle } from "lucide-react"
import { GoogleGenerativeAI } from '@google/generative-ai'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface LanguageConfig {
  initialMessage: string
  translatePrompt: string
}

const LANGUAGE_CONFIGS: Record<string, LanguageConfig> = {
  english: {
    initialMessage: "Hello! I'm your farming assistant. How can I help you today?",
    translatePrompt: "Translate the following text to English while preserving its meaning:"
  },
  hausa: {
    initialMessage: "Sannu! Ni ne mataimakinka na noma. Yaya zan taimaka maka yau?",
    translatePrompt: "Translate the following text to Hausa while preserving its meaning:"
  },
  yoruba: {
    initialMessage: "Bawo ni! Mo je oluranlowo oko rẹ. Bawo ni mo ṣe le ran ọ lọwọ loni?",
    translatePrompt: "Translate the following text to Yoruba while preserving its meaning:"
  },
  igbo: {
    initialMessage: "Nnọọ! Abụ m onye enyemaka gị n'ọrụ ugbo. Kedu ka m ga-esi nyere gị aka taa?",
    translatePrompt: "Translate the following text to Igbo while preserving its meaning:"
  }
}

interface ChatBotProps {
  language: string
}

export function ChatBot({ language }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Update initial message when language changes
  useEffect(() => {
    setMessages([{
      role: "assistant",
      content: LANGUAGE_CONFIGS[language].initialMessage
    }])
  }, [language])

  // Advanced markdown-like formatting function
  const formatResponse = (text: string) => {
    // Handle different formatting types
    // Bold, Italic, Underline, Strikethrough, Code, Headers
    let formattedText = text
      // Headers
      .replace(/^(#{1,6})\s(.+)$/gm, (match, hashes, content) => {
        const level = hashes.length
        return `<h${level}>${content}</h${level}>`
      })
      // Bold (** or __)
      .replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>')
      // Italic (* or _)
      .replace(/(\*|_)(.*?)\1/g, '<em>$2</em>')
      // Strikethrough (~~)
      .replace(/~~(.*?)~~/g, '<del>$1</del>')
      // Underline
      .replace(/__(.*?)__/g, '<u>$1</u>')
      // Code (`)
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // Code blocks
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
      // Blockquotes
      .replace(/^>\s(.+)$/gm, '<blockquote>$1</blockquote>')

    return formattedText
  }

  const translateText = async (text: string, targetLanguage: string) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY
      if (!apiKey) {
        throw new Error('API key is not defined')
      }
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' })

      const prompt = `${LANGUAGE_CONFIGS[language].translatePrompt} 

Input: ${text}
`

      const result = await model.generateContent(prompt)
      return await result.response.text()
    } catch (err) {
      console.error('Translation error:', err)
      return text  // Fallback to original text if translation fails
    }
  }

  const handleSend = async () => {
    if (input.trim()) {
      // Add user message
      const userMessage: Message = { role: "user", content: input }
      setMessages(prev => [...prev, userMessage])
      setInput("")
      setLoading(true)
      setError(null)

      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY
        if (!apiKey) {
          throw new Error('API key is not defined')
        }
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' })

        // Construct a prompt that includes context and language preference
        const prompt = `
          Your name is FarmAdvisor AI helping a farmer with agricultural questions.
          The user's preferred language is ${language}.
          
          Provide a helpful, concise, and informative response to the following question:
          ${input}

          Guidelines:
          - Use markdown-like formatting for emphasis
          - Provide practical, actionable advice
          - Use simple, clear language
          - If the question is too broad, ask for more specific details
          - Tailor the response length and complexity to the specific query
        `

        const result = await model.generateContent(prompt)
        let responseText = await result.response.text()

        // Translate if not in English
        if (language !== 'english') {
          responseText = await translateText(responseText, language)
        }

        // Add AI response
        const aiMessage: Message = { role: "assistant", content: responseText }
        setMessages(prev => [...prev, aiMessage])

      } catch (err) {
        console.error(err)
        setError('Failed to generate response. Please try again.')
        toast({
          title: "Error",
          description: "Failed to generate AI response",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>FarmAdvisor AI</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 h-[500px] overflow-y-auto p-4 rounded-lg border">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {message.role === "assistant" ? (
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code: ({node, inline, className, children, ...props}: {node?: any, inline?: boolean, className?: string, children?: React.ReactNode}) => {
                        return inline ? (
                          <code className="bg-gray-100 p-1 rounded" {...props}>
                            {children}
                          </code>
                        ) : (
                          <pre className="bg-gray-100 p-2 rounded overflow-x-auto" {...(props as React.HTMLAttributes<HTMLPreElement>)}>
                            <code>{children}</code>
                          </pre>
                        )
                      }
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  message.content
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-2 flex items-center">
                <div className="animate-spin h-4 w-4 border-2 border-green-700 border-t-transparent rounded-full mr-2"></div>
                FarmAdvisor AI is Typing...
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-start">
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 flex items-center">
                <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                {error}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder={
              language === "english"
                ? "Type your farming question..."
                : language === "hausa"
                  ? "Rubuta tambayarka ta noma..."
                  : language === "yoruba"
                    ? "Tẹ ibeere oko rẹ..."
                    : language === "igbo"
                      ? "Dee ajụjụ ọrụ ugbo gị..."
                      : "Type your farming question..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="bg-green-700 hover:bg-green-800" 
            onClick={handleSend}
            disabled={loading || input.trim() === ""}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default function FarmAssistantPage() {
  const [language, setLanguage] = useState("english")

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">FarmAdvisor AI</h1>
            <p className="text-muted-foreground">
              Get instant answers to your farming questions and personalized advice for your crops.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="hausa">Hausa</SelectItem>
                <SelectItem value="yoruba">Yoruba</SelectItem>
                <SelectItem value="igbo">Igbo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1 space-y-4">
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-lg font-medium mb-2">How to use FarmAdvisor AI</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Ask questions about crop management</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Get advice on pest and disease control</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Learn about best farming practices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Receive weather-based recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Get help with soil management</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-lg font-medium mb-2">Example Questions</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>"How do I control fall armyworm in maize?"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>"What fertilizer is best for cassava?"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>"When should I plant yams in Plateau state?"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>"How can I improve soil fertility naturally?"</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-2">
            <ChatBot language={language} />
          </div>
        </div>
      </div>
    </div>
  )
}