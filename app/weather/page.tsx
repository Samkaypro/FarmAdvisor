"use client"

import { useState, useEffect } from "react"
import { Calendar, Cloud, CloudRain, Droplets, MapPin, Thermometer, Wind, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { WeatherChart } from "@/components/weather-chart"
import { SoilMap } from "@/components/soil-map"

// Define interfaces for weather data
interface CurrentWeather {
  main: {
    temp: number
    feels_like: number
    humidity: number
  }
  wind: {
    speed: number
    deg: number
  }
  rain?: {
    '1h'?: number
  }
  clouds: {
    all: number
  }
}

interface ForecastItem {
  dt: number
  main: {
    temp: number
    temp_min: number
    temp_max: number
  }
  rain?: {
    '3h'?: number
  }
  clouds: {
    all: number
  }
}

interface WeatherData {
  current: CurrentWeather | null
  forecast: ForecastItem[]
}

// Location coordinates mapping
const LOCATION_COORDINATES: { [key: string]: { lat: number, lon: number } } = {
  "abia": { lat: 5.5320, lon: 7.4860 },
  "adamawa": { lat: 9.3265, lon: 12.3984 },
  "akwa_ibom": { lat: 5.0280, lon: 7.9270 },
  "anambra": { lat: 6.2209, lon: 7.0670 },
  "bauchi": { lat: 10.3142, lon: 9.8463 },
  "bayelsa": { lat: 4.7719, lon: 6.0699 },
  "benue": { lat: 7.7278, lon: 8.5391 },
  "borno": { lat: 11.8333, lon: 13.1500 },
  "cross_river": { lat: 5.9631, lon: 8.3340 },
  "delta": { lat: 5.8904, lon: 5.6800 },
  "ebonyi": { lat: 6.2649, lon: 8.0130 },
  "edo": { lat: 6.5244, lon: 5.8987 },
  "ekiti": { lat: 7.6210, lon: 5.2210 },
  "enugu": { lat: 6.5244, lon: 7.5170 },
  "gombe": { lat: 10.2897, lon: 11.1710 },
  "imo": { lat: 5.5720, lon: 7.0580 },
  "jigawa": { lat: 12.2280, lon: 9.5610 },
  "kaduna": { lat: 10.5267, lon: 7.4406 },
  "kano": { lat: 12.0022, lon: 8.5920 },
  "katsina": { lat: 12.9908, lon: 7.6000 },
  "kebbi": { lat: 12.4539, lon: 4.1970 },
  "kogi": { lat: 7.7337, lon: 6.6906 },
  "kwara": { lat: 8.4799, lon: 4.5418 },
  "lagos": { lat: 6.5244, lon: 3.3792 },
  "nasarawa": { lat: 8.5380, lon: 8.5460 },
  "niger": { lat: 9.9300, lon: 5.5983 },
  "ogun": { lat: 7.1600, lon: 3.3500 },
  "ondo": { lat: 7.2500, lon: 5.2000 },
  "osun": { lat: 7.5620, lon: 4.5620 },
  "oyo": { lat: 7.3775, lon: 3.9470 },
  "plateau": { lat: 9.0238, lon: 8.8923 },
  "rivers": { lat: 4.8156, lon: 7.0498 },
  "sokoto": { lat: 13.0059, lon: 5.2476 },
  "taraba": { lat: 8.8937, lon: 11.3600 },
  "yobe": { lat: 12.0000, lon: 11.5000 },
  "zamfara": { lat: 12.1667, lon: 6.2500 },
  "abuja": { lat: 9.0765, lon: 7.3986 }
}

export default function WeatherSoilPage() {
  const [selectedLocation, setSelectedLocation] = useState("lagos")
  const [weatherData, setWeatherData] = useState<WeatherData>({
    current: null,
    forecast: []
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Function to get wind direction
  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
    const index = Math.round(degrees / 22.5) % 16
    return directions[index]
  }

  // Function to fetch weather data
  const fetchWeatherData = async (location: string) => {
    setLoading(true)
    setError(null)

    try {
      const { lat, lon } = LOCATION_COORDINATES[location]
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY

      if (!apiKey) {
        throw new Error('OpenWeatherMap API key is not defined')
      }

      // Fetch current weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      )
      const currentData = await currentResponse.json()

      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      )
      const forecastData = await forecastResponse.json()

      // Process forecast data to get one item per day
      const processedForecast = forecastData.list.filter((item: ForecastItem, index: number, array: ForecastItem[]) => {
        const currentDate = new Date(item.dt * 1000).getDate()
        const previousItem = index > 0 ? new Date(array[index - 1].dt * 1000).getDate() : null
        return previousItem !== currentDate
      }).slice(0, 7)

      setWeatherData({
        current: currentData,
        forecast: processedForecast
      })

    } catch (err) {
      console.error('Weather data fetch error:', err)
      setError('Failed to fetch weather data. Please try again.')
      toast({
        title: "Error",
        description: "Failed to fetch weather data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch weather data when location changes
  useEffect(() => {
    fetchWeatherData(selectedLocation)
  }, [selectedLocation])

  // Render error message
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg flex items-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mr-4" />
          <div>
            <p className="text-red-700 text-lg font-semibold mb-2">Weather Data Unavailable</p>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (loading || !weatherData.current) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="animate-spin h-10 w-10 border-4 border-green-700 border-t-transparent rounded-full"></div>
      </div>
    )
  }

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

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Thermometer className="h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">{Math.round(weatherData.current.main.temp)}°C</div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Feels like {Math.round(weatherData.current.main.feels_like)}°C
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Humidity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Droplets className="h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">{weatherData.current.main.humidity}%</div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {weatherData.current.main.humidity > 70 ? "High humidity" : 
                 weatherData.current.main.humidity > 40 ? "Moderate humidity" : "Low humidity"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Rainfall</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <CloudRain className="h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">
                  {weatherData.current.rain ? 
                    `${weatherData.current.rain['1h'] || 0}mm` : 
                    '0mm'}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {weatherData.current.clouds.all > 80 ? "Heavy clouds" : 
                 weatherData.current.clouds.all > 50 ? "Partly cloudy" : "Clear skies"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Wind</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Wind className="h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">{Math.round(weatherData.current.wind.speed)}km/h</div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Direction: {getWindDirection(weatherData.current.wind.deg)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="weather">
        
          <TabsContent value="weather" className="p-4 border rounded-lg mt-4">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">7-Day Weather Forecast</h3>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Updated: {new Date().toLocaleString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit', 
                      hour12: true 
                    })}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 overflow-x-auto pb-2">
                {weatherData.forecast.map((day, i) => {
                  const date = new Date(day.dt * 1000)
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
                  
                  return (
                    <Card key={day.dt} className={i === 0 ? "bg-muted" : ""}>
                      <CardContent className="p-3 text-center">
                        <p className="text-sm font-medium">{dayName}</p>
                        <div className="my-2">
                          {day.clouds.all > 80 ? (
                            <CloudRain className="h-8 w-8 mx-auto text-blue-500" />
                          ) : day.clouds.all > 50 ? (
                            <Cloud className="h-8 w-8 mx-auto text-gray-500" />
                          ) : (
                            <Thermometer className="h-8 w-8 mx-auto text-orange-500" />
                          )}
                        </div>
                        <p className="text-sm font-bold">{Math.round(day.main.temp_max)}°C</p>
                        <p className="text-xs text-muted-foreground">{Math.round(day.main.temp_min)}°C</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

             

              
            </div>
          </TabsContent>
          
        </Tabs>
      </div>
    </div>
  )
}