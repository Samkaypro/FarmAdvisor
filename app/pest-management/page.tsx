"use client"

import type React from "react"

import { useState } from "react"
import { Bug, ChevronRight, Leaf, Search, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export default function PestManagementPage() {
  const [showResults, setShowResults] = useState(false)
  const [selectedPest, setSelectedPest] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedPest) {
      setShowResults(true)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Pest Management</h1>
          <p className="text-muted-foreground">
            Identify common pests affecting your crops and get effective management strategies to protect your harvest.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Find Pest Solutions</CardTitle>
              <CardDescription>Select a pest or search by symptoms to get management recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pest-select">Select Pest</Label>
                  <Select required value={selectedPest} onValueChange={(value) => setSelectedPest(value)}>
                    <SelectTrigger id="pest-select">
                      <SelectValue placeholder="Choose a pest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fall-armyworm">Fall Armyworm</SelectItem>
                      <SelectItem value="stem-borer">Stem Borer</SelectItem>
                      <SelectItem value="aphids">Aphids</SelectItem>
                      <SelectItem value="whiteflies">Whiteflies</SelectItem>
                      <SelectItem value="grasshoppers">Grasshoppers</SelectItem>
                      <SelectItem value="mealybugs">Mealybugs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="crop-type">Affected Crop</Label>
                  <Select>
                    <SelectTrigger id="crop-type">
                      <SelectValue placeholder="Select crop type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maize">Maize (Corn)</SelectItem>
                      <SelectItem value="cassava">Cassava</SelectItem>
                      <SelectItem value="yam">Yam</SelectItem>
                      <SelectItem value="rice">Rice</SelectItem>
                      <SelectItem value="tomato">Tomato</SelectItem>
                      <SelectItem value="pepper">Pepper</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Or search by symptoms..." className="pl-8" />
                </div>

                <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
                  Get Solutions
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            {!showResults ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <Bug className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium">Select a pest to see management recommendations</h3>
                <p className="text-muted-foreground mt-2">
                  Get detailed information on identification, prevention, and treatment options
                </p>
              </div>
            ) : (
              <div>
                <CardHeader>
                  <CardTitle>Fall Armyworm Management</CardTitle>
                  <CardDescription>
                    Scientific name: Spodoptera frugiperda | Primarily affects: Maize, Sorghum, Rice
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Identification</h3>
                    <Carousel className="w-full max-w-md mx-auto">
                      <CarouselContent>
                        <CarouselItem>
                          <div className="p-1">
                            <div className="overflow-hidden rounded-lg">
                              <img
                                src="/placeholder.svg?height=300&width=400"
                                alt="Fall Armyworm on maize leaf"
                                className="h-[200px] w-full object-cover"
                              />
                              <div className="p-2 text-center text-sm">Fall Armyworm on maize leaf</div>
                            </div>
                          </div>
                        </CarouselItem>
                        <CarouselItem>
                          <div className="p-1">
                            <div className="overflow-hidden rounded-lg">
                              <img
                                src="/placeholder.svg?height=300&width=400"
                                alt="Fall Armyworm damage to maize"
                                className="h-[200px] w-full object-cover"
                              />
                              <div className="p-2 text-center text-sm">Typical damage to maize</div>
                            </div>
                          </div>
                        </CarouselItem>
                        <CarouselItem>
                          <div className="p-1">
                            <div className="overflow-hidden rounded-lg">
                              <img
                                src="/placeholder.svg?height=300&width=400"
                                alt="Adult Fall Armyworm moth"
                                className="h-[200px] w-full object-cover"
                              />
                              <div className="p-2 text-center text-sm">Adult Fall Armyworm moth</div>
                            </div>
                          </div>
                        </CarouselItem>
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
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
                      <div className="space-y-2">
                        <h4 className="font-medium">Neem Oil Extract</h4>
                        <p className="text-sm text-muted-foreground">
                          Apply neem oil solution (30-50 ml per 10 liters of water) to affected plants. Spray during
                          early morning or late evening for best results.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Biological Control</h4>
                        <p className="text-sm text-muted-foreground">
                          Release natural predators like Trichogramma wasps that parasitize armyworm eggs. Apply
                          Bacillus thuringiensis (Bt) as a biological insecticide.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Ash and Soil Application</h4>
                        <p className="text-sm text-muted-foreground">
                          Apply wood ash to the whorls of young maize plants. This traditional method can help deter
                          armyworm larvae.
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="chemical" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Recommended Pesticides</h4>
                        <ul className="text-sm text-muted-foreground space-y-2">
                          <li>• Emamectin benzoate (Proclaim): 0.2-0.4 kg/ha</li>
                          <li>• Chlorantraniliprole (Coragen): 50-100 ml/ha</li>
                          <li>• Spinetoram (Radiant): 50-75 ml/ha</li>
                        </ul>
                        <p className="text-sm text-muted-foreground mt-2">
                          Always follow manufacturer instructions and wear protective equipment when applying chemicals.
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="prevention" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Early Warning Signs</h4>
                        <p className="text-sm text-muted-foreground">
                          Look for small holes in leaves, "window paning" of leaves, and sawdust-like frass in the whorl
                          of maize plants.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Cultural Practices</h4>
                        <ul className="text-sm text-muted-foreground space-y-2">
                          <li>• Practice crop rotation to break pest cycles</li>
                          <li>• Early planting to avoid peak infestation periods</li>
                          <li>• Intercropping maize with beans or cowpeas</li>
                          <li>• Regular field monitoring, especially during vegetative stages</li>
                        </ul>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Download Detailed Guide
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

