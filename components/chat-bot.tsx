"use client"

import type React from "react"

import { useState } from "react"
import { Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface ChatBotProps {
  language: string
}

interface Message {
  role: "user" | "assistant"
  content: string
}

export function ChatBot({ language }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        language === "english"
          ? "Hello! I'm your farming assistant. How can I help you today?"
          : language === "hausa"
            ? "Sannu! Ni ne mataimakinka na noma. Yaya zan taimaka maka yau?"
            : language === "yoruba"
              ? "Bawo ni! Mo je oluranlowo oko rẹ. Bawo ni mo ṣe le ran ọ lọwọ loni?"
              : language === "igbo"
                ? "Nnọọ! Abụ m onye enyemaka gị n'ọrụ ugbo. Kedu ka m ga-esi nyere gị aka taa?"
                : "Hello! I'm your farming assistant. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (input.trim()) {
      // Add user message
      setMessages([...messages, { role: "user", content: input }])

      // Simulate AI response
      setTimeout(() => {
        let response = ""

        if (input.toLowerCase().includes("pest") || input.toLowerCase().includes("insect")) {
          response =
            language === "english"
              ? "For pest control, I recommend using neem oil or introducing natural predators. Would you like specific recommendations for your crop?"
              : "I recommend using organic pest control methods."
        } else if (input.toLowerCase().includes("fertilizer") || input.toLowerCase().includes("nutrient")) {
          response =
            language === "english"
              ? "For optimal nutrient management, consider using a balanced NPK fertilizer. The exact ratio depends on your soil test results and crop needs."
              : "I recommend balanced fertilizers based on soil tests."
        } else if (input.toLowerCase().includes("rain") || input.toLowerCase().includes("water")) {
          response =
            language === "english"
              ? "Based on the weather forecast, we expect moderate rainfall next week. Consider preparing your irrigation system as backup."
              : "We expect rainfall next week. Prepare irrigation as backup."
        } else {
          response =
            language === "english"
              ? "Thank you for your question. I'll need more information about your specific farming situation to provide tailored advice."
              : "I need more information to help you better."
        }

        setMessages((prev) => [...prev, { role: "assistant", content: response }])
      }, 1000)

      // Clear input
      setInput("")
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
        <CardTitle>AI Farming Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 h-[400px] overflow-y-auto p-4 rounded-lg border">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
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
          />
          <Button type="submit" size="icon" className="bg-green-700 hover:bg-green-800" onClick={handleSend}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

