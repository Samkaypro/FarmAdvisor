"use client"

import { useState } from "react"
import { Calendar, Cloud, CloudRain, Droplets, MapPin, Thermometer, Wind } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WeatherChart } from "@/components/weather-chart"
import { SoilMap } from "@/components/soil-map"

export default function WeatherSoilPage() {
  const [selectedLocation, setSelectedLocation] = useState("lagos")

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Weather & Soil Data</h1>
          <p className="text-muted-foreground">
            Access real-time weather forecasts and soil quality information to make informed farming decisions.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <span>Location:</span>
          </div>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lagos">Lagos</SelectItem>
              <SelectItem value="kano">Kano</SelectItem>
              <SelectItem value="abuja">Abuja (FCT)</SelectItem>
              <SelectItem value="rivers">Rivers</SelectItem>
              <SelectItem value="kaduna">Kaduna</SelectItem>
              <SelectItem value="plateau">Plateau</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="ml-auto">
            Use My Current Location
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Thermometer className="h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">32°C</div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Feels like 35°C</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Humidity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Droplets className="h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">78%</div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">High humidity</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Rainfall</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <CloudRain className="h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">2.5mm</div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Light rain expected</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Wind</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Wind className="h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">8km/h</div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Direction: SW</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="weather">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="weather">
              <Cloud className="h-4 w-4 mr-2" />
              Weather Forecast
            </TabsTrigger>
            <TabsTrigger value="soil">
              <MapPin className="h-4 w-4 mr-2" />
              Soil Data
            </TabsTrigger>
          </TabsList>
          <TabsContent value="weather" className="p-4 border rounded-lg mt-4">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">7-Day Weather Forecast</h3>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Updated: Today, 10:30 AM</span>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 overflow-x-auto pb-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                  <Card key={day} className={i === 0 ? "bg-muted" : ""}>
                    <CardContent className="p-3 text-center">
                      <p className="text-sm font-medium">{day}</p>
                      <div className="my-2">
                        {i === 0 || i === 5 ? (
                          <CloudRain className="h-8 w-8 mx-auto text-blue-500" />
                        ) : i === 1 || i === 2 ? (
                          <Cloud className="h-8 w-8 mx-auto text-gray-500" />
                        ) : (
                          <Thermometer className="h-8 w-8 mx-auto text-orange-500" />
                        )}
                      </div>
                      <p className="text-sm font-bold">{30 - i}°C</p>
                      <p className="text-xs text-muted-foreground">{20 - i}°C</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-medium mb-4">Temperature & Rainfall Trends</h3>
                <WeatherChart />
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Seasonal Planting Advice</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Based on the current weather patterns and seasonal forecast for{" "}
                  {selectedLocation === "lagos" ? "Lagos" : selectedLocation === "kano" ? "Kano" : "your region"}:
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium">Recommended Actions</h4>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <span>Consider planting drought-resistant varieties in the next 2 weeks</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <span>Prepare irrigation systems for the upcoming dry spell</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <span>Apply mulch to retain soil moisture during high temperatures</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Crops to Consider</h4>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <span>Cassava: Ideal for planting now through next month</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <span>Sorghum: Good drought tolerance for upcoming conditions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <span>Cowpea: Can be planted as rainfall decreases</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="soil" className="p-4 border rounded-lg mt-4">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Soil Quality Map</h3>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Data updated: Last month</span>
                </div>
              </div>

              <div className="h-[400px] w-full rounded-lg border overflow-hidden">
                <SoilMap location={selectedLocation} />
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Soil pH</CardTitle>
                    <CardDescription>Average for selected area</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">6.2</div>
                    <p className="text-sm text-muted-foreground">Slightly acidic</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Organic Matter</CardTitle>
                    <CardDescription>Percentage in topsoil</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2.8%</div>
                    <p className="text-sm text-muted-foreground">Moderate fertility</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Soil Type</CardTitle>
                    <CardDescription>Predominant classification</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Loamy</div>
                    <p className="text-sm text-muted-foreground">Good water retention</p>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Soil Management Recommendations</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium">Improvement Strategies</h4>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <span>Add organic compost to increase organic matter content</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <span>Consider green manure crops to improve soil structure</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <span>Implement crop rotation to prevent nutrient depletion</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Fertilizer Guidance</h4>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <span>NPK 15-15-15: 200kg/ha for general crop nutrition</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <span>Apply lime at 1 ton/ha to raise pH if growing vegetables</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <span>Split fertilizer application for better nutrient uptake</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

