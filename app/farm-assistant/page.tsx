"use client"

import { useState } from "react"
import { MessageSquare } from "lucide-react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChatBot } from "@/components/chat-bot"

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

