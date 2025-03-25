"use client"

import { useState } from "react"
import { Bell, Calendar, CloudRain, FileText, Leaf, Upload, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WeatherChart } from "@/components/weather-chart"

export default function DashboardPage() {
  const [language, setLanguage] = useState("english")

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Farmer Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's an overview of your farm and recommendations.</p>
          </div>
          <div className="flex items-center gap-4">
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
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Weather Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <CloudRain className="h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">32°C</div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Light rain expected</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">3</div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Due this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Crop Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Leaf className="h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">Good</div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">No issues detected</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">5</div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">New suggestions</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="crops">My Crops</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="p-4 border rounded-lg mt-4">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Farm Overview</h3>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Weather Forecast</CardTitle>
                    <CardDescription>7-day temperature and rainfall prediction</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <WeatherChart />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Activities</CardTitle>
                    <CardDescription>Tasks scheduled for your farm</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <div className="rounded-full bg-green-100 p-1 dark:bg-green-800">
                          <Calendar className="h-4 w-4 text-green-700 dark:text-green-100" />
                        </div>
                        <div>
                          <p className="font-medium">Apply fertilizer to maize field</p>
                          <p className="text-sm text-muted-foreground">Tomorrow, 7:00 AM</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="rounded-full bg-green-100 p-1 dark:bg-green-800">
                          <Calendar className="h-4 w-4 text-green-700 dark:text-green-100" />
                        </div>
                        <div>
                          <p className="font-medium">Inspect cassava for pests</p>
                          <p className="text-sm text-muted-foreground">Wednesday, 9:00 AM</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="rounded-full bg-green-100 p-1 dark:bg-green-800">
                          <Calendar className="h-4 w-4 text-green-700 dark:text-green-100" />
                        </div>
                        <div>
                          <p className="font-medium">Harvest yams (eastern field)</p>
                          <p className="text-sm text-muted-foreground">Friday, 6:30 AM</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Add New Task
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Recommendations</CardTitle>
                  <CardDescription>Personalized advice for your farm</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <div className="rounded-full bg-green-100 p-1 dark:bg-green-800">
                        <Leaf className="h-4 w-4 text-green-700 dark:text-green-100" />
                      </div>
                      <div>
                        <p className="font-medium">Consider intercropping maize with beans</p>
                        <p className="text-sm text-muted-foreground">
                          This can improve soil fertility and maximize land use
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="rounded-full bg-green-100 p-1 dark:bg-green-800">
                        <CloudRain className="h-4 w-4 text-green-700 dark:text-green-100" />
                      </div>
                      <div>
                        <p className="font-medium">Prepare for increased rainfall next week</p>
                        <p className="text-sm text-muted-foreground">
                          Ensure proper drainage in low-lying areas of your farm
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="rounded-full bg-green-100 p-1 dark:bg-green-800">
                        <Leaf className="h-4 w-4 text-green-700 dark:text-green-100" />
                      </div>
                      <div>
                        <p className="font-medium">Apply neem oil to control aphids on vegetables</p>
                        <p className="text-sm text-muted-foreground">
                          Early signs of aphid infestation detected in your garden area
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="crops" className="p-4 border rounded-lg mt-4">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">My Crops</h3>
                <Button size="sm" className="bg-green-700 hover:bg-green-800">
                  Add New Crop
                </Button>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Maize (Corn)</CardTitle>
                    <CardDescription>Planted: 2 months ago</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Growth Stage:</span>
                        <span className="text-sm font-medium">Tasseling</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Health Status:</span>
                        <span className="text-sm font-medium text-green-600">Good</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Expected Harvest:</span>
                        <span className="text-sm font-medium">In 4 weeks</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Cassava</CardTitle>
                    <CardDescription>Planted: 5 months ago</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Growth Stage:</span>
                        <span className="text-sm font-medium">Mature</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Health Status:</span>
                        <span className="text-sm font-medium text-amber-600">Fair</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Expected Harvest:</span>
                        <span className="text-sm font-medium">In 2 months</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Yam</CardTitle>
                    <CardDescription>Planted: 7 months ago</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Growth Stage:</span>
                        <span className="text-sm font-medium">Ready for harvest</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Health Status:</span>
                        <span className="text-sm font-medium text-green-600">Excellent</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Expected Harvest:</span>
                        <span className="text-sm font-medium">Now</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Upload Crop Images</CardTitle>
                  <CardDescription>Upload images of your crops for diagnosis or record keeping</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG or JPEG (MAX. 10MB)</p>
                      </div>
                      <input id="dropzone-file" type="file" className="hidden" />
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

