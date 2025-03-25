"use client"

import type React from "react"
import { useState } from "react"
import { ArrowRight, Calendar, Droplets, Leaf, Thermometer, AlertTriangle } from "lucide-react"
import { GoogleGenerativeAI } from '@google/generative-ai'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/components/ui/use-toast"

interface CropRecommendation {
  name: string
  suitability: number
  plantingTime: string
  harvestTime: string
  waterNeeds: string
  tempRange: string
  soilType: string
  pHRange: string
  growthDuration: string
  profitabilityIndex: number
  additionalTips: string
}

interface FormData {
  region: string
  soilType: string
  rainfallLevel: string
  farmSize: number
  soilPh: number
}

export default function CropRecommendationPage() {
  const [formData, setFormData] = useState<FormData>({
    region: '',
    soilType: '',
    rainfallLevel: '',
    farmSize: 0,
    soilPh: 6.5
  })
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([])

  const validateForm = (): boolean => {
    const { region, soilType, rainfallLevel, farmSize } = formData
    
    if (!region) {
      toast({
        title: "Validation Error",
        description: "Please select a region/state",
        variant: "destructive"
      })
      return false
    }

    if (!soilType) {
      toast({
        title: "Validation Error",
        description: "Please select a soil type",
        variant: "destructive"
      })
      return false
    }

    if (!rainfallLevel) {
      toast({
        title: "Validation Error",
        description: "Please select rainfall level",
        variant: "destructive"
      })
      return false
    }

    if (farmSize <= 0) {
      toast({
        title: "Validation Error",
        description: "Farm size must be greater than 0",
        variant: "destructive"
      })
      return false
    }

    return true
  }

  const extractJSON = (text: string): any => {
    // Look for JSON within ```json ``` or { } blocks
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
      // Parse the matched JSON string
      const parsedJson = JSON.parse(jsonMatch[1]);
      
      // If the parsed JSON has a 'recommendations' key, return that
      return parsedJson.recommendations || parsedJson;
    } catch (parseError) {
      console.error('JSON Parsing Error:', parseError);
      throw new Error('Failed to parse the JSON response');
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset previous states
    setError(null)
    setRecommendations([])
    
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

      const prompt = `
        Generate crop recommendations for a farm with the following specifications:
        - Region: ${formData.region}
        - Soil Type: ${formData.soilType}
        - Rainfall Level: ${formData.rainfallLevel}
        - Farm Size: ${formData.farmSize} hectares
        - Soil pH: ${formData.soilPh}

        Provide recommendations ONLY as a JSON object with a 'recommendations' array. 
        Use this exact JSON structure:
        \`\`\`json
        {
          "recommendations": [
            {
              "name": "Crop Name",
              "suitability": 0-100,
              "plantingTime": "Optimal planting months",
              "harvestTime": "Estimated harvest period",
              "waterNeeds": "Low/Medium/High water requirement",
              "tempRange": "Optimal temperature range",
              "soilType": "Preferred soil characteristics",
              "pHRange": "Optimal soil pH range",
              "growthDuration": "Total days from planting to harvest",
              "profitabilityIndex": 0-100,
              "additionalTips": "Specific cultivation advice"
            }
          ]
        }
        \`\`\`
        Provide top 5 most suitable crops for the given conditions.
      `

      const result = await model.generateContent(prompt)
      const responseText = await result.response.text()

      // Extract and parse JSON
      const cropRecommendations = extractJSON(responseText)

      setRecommendations(cropRecommendations)
      setShowResults(true)

      // Scroll to recommendations
      setTimeout(() => {
        const recommendationsSection = document.getElementById("recommendations-section")
        if (recommendationsSection) {
          recommendationsSection.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)

    } catch (err) {
      console.error(err)
      setError('Failed to generate recommendations. Please try again.')
      toast({
        title: "Error",
        description: "Failed to generate crop recommendations",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Render additional details for each crop
  const renderAdditionalDetails = (crop: CropRecommendation) => {
    return (
      <div className="mt-4 text-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-green-600" />
            <strong>Soil Type:</strong> {crop.soilType}
          </div>
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-blue-600" />
            <strong>Soil pH Range:</strong> {crop.pHRange}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-orange-600" />
            <strong>Growth Duration:</strong> {crop.growthDuration}
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-cyan-600" />
            <strong>Profitability Index:</strong> {crop.profitabilityIndex}
          </div>
        </div>
        <div className="mt-3">
          <strong>Additional Tips:</strong>
          <p className="text-muted-foreground">{crop.additionalTips}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Crop Recommendation</h1>
          <p className="text-muted-foreground">
            Enter your farm details to get personalized crop recommendations based on your soil type, location, and
            weather conditions.
          </p>
        </div>

        {/* Form remains the same as in previous implementation */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Farm Details</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="region">Region/State</Label>
                <Select 
                  value={formData.region}
                  onValueChange={(value) => handleInputChange('region', value)}
                >
                  <SelectTrigger id="region">
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="abia">Abia</SelectItem>
                    <SelectItem value="adamawa">Adamawa</SelectItem>
                    <SelectItem value="akwa-ibom">Akwa Ibom</SelectItem>
                    <SelectItem value="anambra">Anambra</SelectItem>
                    <SelectItem value="bauchi">Bauchi</SelectItem>
                    <SelectItem value="bayelsa">Bayelsa</SelectItem>
                    <SelectItem value="benue">Benue</SelectItem>
                    <SelectItem value="borno">Borno</SelectItem>
                    <SelectItem value="cross-river">Cross River</SelectItem>
                    <SelectItem value="delta">Delta</SelectItem>
                    <SelectItem value="ebonyi">Ebonyi</SelectItem>
                    <SelectItem value="edo">Edo</SelectItem>
                    <SelectItem value="ekiti">Ekiti</SelectItem>
                    <SelectItem value="enugu">Enugu</SelectItem>
                    <SelectItem value="gombe">Gombe</SelectItem>
                    <SelectItem value="imo">Imo</SelectItem>
                    <SelectItem value="jigawa">Jigawa</SelectItem>
                    <SelectItem value="kaduna">Kaduna</SelectItem>
                    <SelectItem value="kano">Kano</SelectItem>
                    <SelectItem value="katsina">Katsina</SelectItem>
                    <SelectItem value="kebbi">Kebbi</SelectItem>
                    <SelectItem value="kogi">Kogi</SelectItem>
                    <SelectItem value="kwara">Kwara</SelectItem>
                    <SelectItem value="lagos">Lagos</SelectItem>
                    <SelectItem value="nasarawa">Nasarawa</SelectItem>
                    <SelectItem value="niger">Niger</SelectItem>
                    <SelectItem value="ogun">Ogun</SelectItem>
                    <SelectItem value="ondo">Ondo</SelectItem>
                    <SelectItem value="osun">Osun</SelectItem>
                    <SelectItem value="oyo">Oyo</SelectItem>
                    <SelectItem value="plateau">Plateau</SelectItem>
                    <SelectItem value="rivers">Rivers</SelectItem>
                    <SelectItem value="sokoto">Sokoto</SelectItem>
                    <SelectItem value="taraba">Taraba</SelectItem>
                    <SelectItem value="yobe">Yobe</SelectItem>
                    <SelectItem value="zamfara">Zamfara</SelectItem>
                    <SelectItem value="abuja">Abuja (FCT)</SelectItem>
                    </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="soil-type">Soil Type</Label>
                <Select 
                  value={formData.soilType}
                  onValueChange={(value) => handleInputChange('soilType', value)}
                >
                  <SelectTrigger id="soil-type">
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sandy">Sandy</SelectItem>
                    <SelectItem value="loamy">Loamy</SelectItem>
                    <SelectItem value="clay">Clay</SelectItem>
                    <SelectItem value="silt">Silty</SelectItem>
                    <SelectItem value="peaty">Peaty</SelectItem>
                    <SelectItem value="chalky">Chalky</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rainfall">Average Rainfall Level</Label>
                <Select 
                  value={formData.rainfallLevel}
                  onValueChange={(value) => handleInputChange('rainfallLevel', value)}
                >
                  <SelectTrigger id="rainfall">
                    <SelectValue placeholder="Select rainfall level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (Less than 800mm/year)</SelectItem>
                    <SelectItem value="medium">Medium (800-1500mm/year)</SelectItem>
                    <SelectItem value="high">High (More than 1500mm/year)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="farm-size">Farm Size (Hectares)</Label>
                <Input 
                  id="farm-size" 
                  type="number" 
                  min="0.1" 
                  step="0.1" 
                  placeholder="Enter farm size"
                  value={formData.farmSize || ''}
                  onChange={(e) => handleInputChange('farmSize', parseFloat(e.target.value))}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="flex justify-between">
                  <Label htmlFor="soil-ph">Soil pH Level: {formData.soilPh}</Label>
                  <span className="text-sm text-muted-foreground">(Acidic 0-7, Alkaline 7-14)</span>
                </div>
                <Slider 
                  id="soil-ph" 
                  min={0} 
                  max={14} 
                  step={0.1} 
                  value={[formData.soilPh]} 
                  onValueChange={(value) => handleInputChange('soilPh', value[0])} 
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Acidic</span>
                  <span>Neutral</span>
                  <span>Alkaline</span>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green-700 hover:bg-green-800" 
              disabled={loading}
            >
              {loading ? 'Generating Recommendations...' : 'Get Recommendations'}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </div>

        {loading && (
          <div className="flex justify-center items-center p-6">
            <div className="animate-spin h-10 w-10 border-4 border-green-700 border-t-transparent rounded-full"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {showResults && !loading && recommendations.length > 0 && (
          <div id="recommendations-section" className="p-4 border rounded-lg mt-4 space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Recommended Crops</h2>
              <p className="text-muted-foreground">
                Based on your soil type, pH level, and location, here are the most suitable crops for your farm:
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((crop, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle>{crop.name}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center">
                        <span className="font-medium text-green-700 dark:text-green-500">
                          Suitability Score: {crop.suitability}%
                        </span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Planting: {crop.plantingTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Leaf className="h-4 w-4 text-muted-foreground" />
                        <span>Harvest: {crop.harvestTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Droplets className="h-4 w-4 text-muted-foreground" />
                        <span>Water: {crop.waterNeeds}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Thermometer className="h-4 w-4 text-muted-foreground" />
                        <span>Temp: {crop.tempRange}</span>
                      </div>
                    </div>
                    
                  </CardContent>
                  <CardFooter>
                  {renderAdditionalDetails(crop)}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}