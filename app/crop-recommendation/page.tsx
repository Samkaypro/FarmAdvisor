"use client"

import type React from "react"

import { useState } from "react"
import { ArrowRight, Calendar, Droplets, Leaf, Thermometer } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export default function CropRecommendationPage() {
  const [showResults, setShowResults] = useState(false)
  const [soilPh, setSoilPh] = useState([6.5])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowResults(true)

    // Scroll to recommendations after a short delay to ensure they're rendered
    setTimeout(() => {
      const recommendationsSection = document.getElementById("recommendations-section")
      if (recommendationsSection) {
        recommendationsSection.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
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

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Farm Details</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="region">Region/State</Label>
                <Select required>
                  <SelectTrigger id="region">
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lagos">Lagos</SelectItem>
                    <SelectItem value="kano">Kano</SelectItem>
                    <SelectItem value="abuja">Abuja (FCT)</SelectItem>
                    <SelectItem value="rivers">Rivers</SelectItem>
                    <SelectItem value="kaduna">Kaduna</SelectItem>
                    <SelectItem value="plateau">Plateau</SelectItem>
                    <SelectItem value="benue">Benue</SelectItem>
                    <SelectItem value="oyo">Oyo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="soil-type">Soil Type</Label>
                <Select required>
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
                <Select required>
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
                <Input id="farm-size" type="number" min="0.1" step="0.1" placeholder="Enter farm size" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="flex justify-between">
                  <Label htmlFor="soil-ph">Soil pH Level: {soilPh[0]}</Label>
                  <span className="text-sm text-muted-foreground">(Acidic 0-7, Alkaline 7-14)</span>
                </div>
                <Slider id="soil-ph" min={0} max={14} step={0.1} value={soilPh} onValueChange={setSoilPh} />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Acidic</span>
                  <span>Neutral</span>
                  <span>Alkaline</span>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
              Get Recommendations
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>

        {showResults && (
          <div id="recommendations-section" className="p-4 border rounded-lg mt-4 space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Recommended Crops</h2>
              <p className="text-muted-foreground">
                Based on your soil type, pH level, and location, here are the most suitable crops for your farm:
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Crop Card 1 */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Cassava</CardTitle>
                  <CardDescription>
                    <div className="flex items-center">
                      <span className="font-medium text-green-700 dark:text-green-500">Suitability Score: 95%</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Planting: Mar-Apr</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Leaf className="h-4 w-4 text-muted-foreground" />
                      <span>Harvest: 9-12 months</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Droplets className="h-4 w-4 text-muted-foreground" />
                      <span>Water: Moderate</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Thermometer className="h-4 w-4 text-muted-foreground" />
                      <span>Temp: 25-29°C</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    See Best Practices
                  </Button>
                </CardFooter>
              </Card>

              {/* Crop Card 2 */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Maize (Corn)</CardTitle>
                  <CardDescription>
                    <div className="flex items-center">
                      <span className="font-medium text-green-700 dark:text-green-500">Suitability Score: 88%</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Planting: Apr-May</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Leaf className="h-4 w-4 text-muted-foreground" />
                      <span>Harvest: 3-4 months</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Droplets className="h-4 w-4 text-muted-foreground" />
                      <span>Water: High</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Thermometer className="h-4 w-4 text-muted-foreground" />
                      <span>Temp: 24-30°C</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    See Best Practices
                  </Button>
                </CardFooter>
              </Card>

              {/* Crop Card 3 */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Yam</CardTitle>
                  <CardDescription>
                    <div className="flex items-center">
                      <span className="font-medium text-green-700 dark:text-green-500">Suitability Score: 82%</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Planting: Dec-Jan</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Leaf className="h-4 w-4 text-muted-foreground" />
                      <span>Harvest: 7-10 months</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Droplets className="h-4 w-4 text-muted-foreground" />
                      <span>Water: Moderate</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Thermometer className="h-4 w-4 text-muted-foreground" />
                      <span>Temp: 25-30°C</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    See Best Practices
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="flex justify-center mt-8">
              <Button className="bg-green-700 hover:bg-green-800">View All Compatible Crops</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

