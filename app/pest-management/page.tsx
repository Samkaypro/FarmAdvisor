"use client"

import type React from "react"
import { useState } from "react"
import { Bug, ChevronRight, Leaf, Search, Shield, Download, AlertTriangle } from "lucide-react"
import { GoogleGenerativeAI } from '@google/generative-ai'
import * as PDFLib from 'pdf-lib'
import { saveAs } from 'file-saver'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { toast } from "@/components/ui/use-toast"

interface PestDetails {
  name: string
  scientificName: string
  affectedCrops: string[]
  identificationSigns: string
  managementStrategies: {
    organic: string[]
    chemical: string[]
    prevention: string[]
  }
  damagePotential: number
}

export default function PestManagementPage() {
  const [selectedPest, setSelectedPest] = useState("")
  const [selectedCrop, setSelectedCrop] = useState("")
  const [manualPestInput, setManualPestInput] = useState("")
  const [manualCropInput, setManualCropInput] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pestDetails, setPestDetails] = useState<PestDetails | null>(null)

  const defaultPests = [
    "Fall Armyworm", "Stem Borer", "Aphids", "Whiteflies", 
    "Grasshoppers", "Mealybugs"
  ]

  const defaultCrops = [
    "Maize", "Cassava", "Yam", "Rice", "Tomato", "Pepper"
  ]

  const extractJSON = (text: string): any => {
    const jsonBlockRegex = /```json\s*(\{[\s\S]*?\})\s*```/;
    const jsonBracketRegex = /(\{[\s\S]*?\})/;

    let jsonMatch;
    if (jsonBlockRegex.test(text)) {
      jsonMatch = text.match(jsonBlockRegex);
    } else {
      jsonMatch = text.match(jsonBracketRegex);
    }

    if (!jsonMatch) {
      throw new Error('No valid JSON found in the response');
    }

    try {
      return JSON.parse(jsonMatch[1]);
    } catch (parseError) {
      console.error('JSON Parsing Error:', parseError);
      throw new Error('Failed to parse the JSON response');
    }
  }

  const validateForm = (): boolean => {
    const pest = selectedPest || manualPestInput
    const crop = selectedCrop || manualCropInput

    if (!pest) {
      toast({
        title: "Validation Error",
        description: "Please select or enter a pest",
        variant: "destructive"
      })
      return false
    }

    if (!crop) {
      toast({
        title: "Validation Error",
        description: "Please select or enter a crop",
        variant: "destructive"
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset previous states
    setError(null)
    setPestDetails(null)
    
    // Validate form
    if (!validateForm()) return

    setLoading(true)

    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY
      if (!apiKey) {
        throw new Error('API key is not defined')
      }
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' })

      const pest = selectedPest || manualPestInput
      const crop = selectedCrop || manualCropInput

      const prompt = `
        Provide comprehensive pest management details for the following:
        - Pest: ${pest}
        - Affected Crop: ${crop}

        Provide response ONLY as a JSON object with this exact structure:
        \`\`\`json
        {
          "name": "Pest Name",
          "scientificName": "Scientific Name",
          "affectedCrops": ["List of crops"],
          "identificationSigns": "Detailed description of how to identify the pest",
          "managementStrategies": {
            "organic": ["Organic control methods"],
            "chemical": ["Chemical control methods with dosages"],
            "prevention": ["Preventive measures and cultural practices"]
          },
          "damagePotential": 0-100
        }
        \`\`\`
      `

      const result = await model.generateContent(prompt)
      const responseText = await result.response.text()

      // Extract and parse JSON
      const pestInfo = extractJSON(responseText)

      setPestDetails(pestInfo)
      setShowResults(true)

      // Scroll to results
      setTimeout(() => {
        const resultsSection = document.getElementById("pest-details-section")
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)

    } catch (err) {
      console.error(err)
      setError('Failed to generate pest details. Please try again.')
      toast({
        title: "Error",
        description: "Failed to generate pest management information",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const generatePDFGuide = async () => {
    if (!pestDetails) {
      toast({
        title: "Error",
        description: "No pest details available to generate guide",
        variant: "destructive"
      })
      return
    }

    setDownloadLoading(true)

    try {
      // Create a new PDF document
      const pdfDoc = await PDFLib.PDFDocument.create()
      const page = pdfDoc.addPage([600, 800])
      const { width, height } = page.getSize()
      const fontSize = 12
      const margin = 50

      const helveticaFont = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica)
      const helveticaBoldFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold)

      const drawText = (text: string, x: number, y: number, font = helveticaFont, size = fontSize) => {
        page.drawText(text, { x, y, size, font })
      }

      // Title
      drawText(`Pest Management Guide: ${pestDetails.name}`, margin, height - margin, helveticaBoldFont, 18)
      
      // Subtitle
      drawText(`Affecting ${selectedCrop || manualCropInput}`, margin, height - margin - 30, helveticaFont, 14)

      // Scientific Details
      let yPosition = height - margin - 70
      drawText(`Scientific Name: ${pestDetails.scientificName}`, margin, yPosition)
      yPosition -= 20
      drawText(`Damage Potential: ${pestDetails.damagePotential}%`, margin, yPosition)

      // Identification
      yPosition -= 40
      drawText('Identification Signs:', margin, yPosition, helveticaBoldFont)
      yPosition -= 20
      const identificationLines = splitTextToLines(pestDetails.identificationSigns, 70)
      identificationLines.forEach(line => {
        drawText(line, margin, yPosition, helveticaFont)
        yPosition -= 15
      })

      // Management Strategies
      yPosition -= 30
      drawText('Management Strategies:', margin, yPosition, helveticaBoldFont, 14)

      // Organic Solutions
      yPosition -= 30
      drawText('Organic Solutions:', margin, yPosition, helveticaBoldFont)
      yPosition -= 20
      pestDetails.managementStrategies.organic.forEach(strategy => {
        const lines = splitTextToLines(strategy, 70)
        lines.forEach(line => {
          drawText('• ' + line, margin, yPosition, helveticaFont)
          yPosition -= 15
        })
      })

      // Chemical Control
      yPosition -= 30
      drawText('Chemical Control:', margin, yPosition, helveticaBoldFont)
      yPosition -= 20
      pestDetails.managementStrategies.chemical.forEach(strategy => {
        const lines = splitTextToLines(strategy, 70)
        lines.forEach(line => {
          drawText('• ' + line, margin, yPosition, helveticaFont)
          yPosition -= 15
        })
      })

      // Prevention
      yPosition -= 30
      drawText('Prevention Strategies:', margin, yPosition, helveticaBoldFont)
      yPosition -= 20
      pestDetails.managementStrategies.prevention.forEach(strategy => {
        const lines = splitTextToLines(strategy, 70)
        lines.forEach(line => {
          drawText('• ' + line, margin, yPosition, helveticaFont)
          yPosition -= 15
        })
      })

      // Finalize PDF
      const pdfBytes = await pdfDoc.save()

      // Download PDF
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      saveAs(blob, `${pestDetails.name}_Pest_Management_Guide.pdf`)

      toast({
        title: "Guide Downloaded",
        description: `Detailed guide for ${pestDetails.name} has been generated`,
        variant: "default"
      })
    } catch (err) {
      console.error(err)
      toast({
        title: "Download Error",
        description: "Failed to generate PDF guide",
        variant: "destructive"
      })
    } finally {
      setDownloadLoading(false)
    }
  }
    // Helper function to split long text into lines
    const splitTextToLines = (text: string, maxLength: number): string[] => {
      const words = text.split(' ')
      const lines: string[] = []
      let currentLine = ''
  
      words.forEach(word => {
        if ((currentLine + word).length > maxLength) {
          lines.push(currentLine.trim())
          currentLine = word + ' '
        } else {
          currentLine += word + ' '
        }
      })
  
      if (currentLine) lines.push(currentLine.trim())
      return lines
    }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Pest Management</h1>
          <p className="text-muted-foreground">
            Identify pests affecting your crops and get comprehensive management strategies to protect your harvest.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Find Pest Solutions</CardTitle>
              <CardDescription>Select a pest or enter custom pest details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Pest (or enter manually)</Label>
                  <div className="flex items-center space-x-2">
                    <Select 
                      value={selectedPest}
                      onValueChange={(value) => {
                        setSelectedPest(value)
                        setManualPestInput("")
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a pest" />
                      </SelectTrigger>
                      <SelectContent>
                        {defaultPests.map(pest => (
                          <SelectItem key={pest} value={pest}>{pest}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span>or</span>
                  </div>
                  <Input 
                    placeholder="Enter pest name" 
                    value={manualPestInput}
                    onChange={(e) => {
                      setManualPestInput(e.target.value)
                      setSelectedPest("")
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Select Crop (or enter manually)</Label>
                  <div className="flex items-center space-x-2">
                    <Select 
                      value={selectedCrop}
                      onValueChange={(value) => {
                        setSelectedCrop(value)
                        setManualCropInput("")
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop type" />
                      </SelectTrigger>
                      <SelectContent>
                        {defaultCrops.map(crop => (
                          <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span>or</span>
                  </div>
                  <Input 
                    placeholder="Enter crop name" 
                    value={manualCropInput}
                    onChange={(e) => {
                      setManualCropInput(e.target.value)
                      setSelectedCrop("")
                    }}
                  />
                </div>

                <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
                  Get Solutions
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            {loading && (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin h-10 w-10 border-4 border-green-700 border-t-transparent rounded-full"></div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-center">
                <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {showResults && pestDetails && (
              <div id="pest-details-section">
                <CardHeader>
                  <CardTitle>{pestDetails.name} Management</CardTitle>
                  <CardDescription>
                    Scientific Name: {pestDetails.scientificName} | 
                    Damage Potential: {pestDetails.damagePotential}%
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Identification</h3>
                    <p className="text-muted-foreground">{pestDetails.identificationSigns}</p>
                  </div>

                  <Tabs defaultValue="organic">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="organic">
                        <Leaf className="h-4 w-4 mr-2" />
                        Organic Solutions
                      </TabsTrigger>
                      <TabsTrigger value="chemical">
                        <Shield className="h-4 w-4 mr-2" />
                        Chemical Control
                      </TabsTrigger>
                      <TabsTrigger value="prevention">
                        <Bug className="h-4 w-4 mr-2" />
                        Prevention
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="organic" className="space-y-4 mt-4">
                      {pestDetails.managementStrategies.organic.map((strategy, index) => (
                        <div key={index} className="space-y-2">
                          <p className="text-sm text-muted-foreground">{strategy}</p>
                        </div>
                      ))}
                    </TabsContent>
                    <TabsContent value="chemical" className="space-y-4 mt-4">
                      {pestDetails.managementStrategies.chemical.map((strategy, index) => (
                        <div key={index} className="space-y-2">
                          <p className="text-sm text-muted-foreground">{strategy}</p>
                        </div>
                      ))}
                    </TabsContent>
                    <TabsContent value="prevention" className="space-y-4 mt-4">
                      {pestDetails.managementStrategies.prevention.map((strategy, index) => (
                        <div key={index} className="space-y-2">
                          <p className="text-sm text-muted-foreground">{strategy}</p>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter>
                    <Button 
              variant="outline" 
              className="w-full" 
              onClick={generatePDFGuide}
              disabled={downloadLoading}
            >
              {downloadLoading ? 'Generating Guide...' : 'Download Detailed Guide'}
              {!downloadLoading && <Download className="ml-2 h-4 w-4" />}
            </Button>
                </CardFooter>
              </div>
            )}

            {!loading && !showResults && (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <Bug className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium">Select a pest and crop to see management recommendations</h3>
                <p className="text-muted-foreground mt-2">
                  Get detailed information on identification, prevention, and treatment options
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}