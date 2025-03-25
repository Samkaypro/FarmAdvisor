import Link from "next/link"
import { ArrowRight, Cloud, Droplets, MapPin, Sprout } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('/placeholder.svg?height=1080&width=1920')" }}
        ></div>
        <div className="container relative z-20 mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center text-white">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Nigerian Farmers Advisory System
              </h1>
              <p className="mx-auto max-w-[700px] text-lg md:text-xl">
                Get personalized crop recommendations and pest management advice based on your location and conditions
              </p>
            </div>
            <div className="w-full max-w-md space-y-2">
              <div className="flex w-full max-w-md items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Enter your location"
                  className="bg-white/90 text-black placeholder:text-gray-500"
                />
                <Button type="submit" className="bg-green-700 hover:bg-green-800">
                  <MapPin className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>
            <Link href="/crop-recommendation">
              <Button size="lg" className="mt-4 bg-green-700 hover:bg-green-800">
                Get Crop & Pest Advice
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50 dark:bg-green-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Why Use Our Advisory System?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Our platform provides tailored advice to help you maximize your farm's productivity
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-800">
                <Sprout className="h-6 w-6 text-green-700 dark:text-green-100" />
              </div>
              <h3 className="text-xl font-bold">AI-Powered Recommendations</h3>
              <p className="text-center text-muted-foreground">
                Get personalized crop recommendations based on your specific soil type and local conditions
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-800">
                <Cloud className="h-6 w-6 text-green-700 dark:text-green-100" />
              </div>
              <h3 className="text-xl font-bold">Offline Support</h3>
              <p className="text-center text-muted-foreground">
                Access critical farming advice even when you're in areas with limited internet connectivity
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-800">
                <Droplets className="h-6 w-6 text-green-700 dark:text-green-100" />
              </div>
              <h3 className="text-xl font-bold">Multilingual Access</h3>
              <p className="text-center text-muted-foreground">
                Get advice in your preferred language including English, Hausa, Yoruba, and Igbo
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm dark:bg-green-800">Features</div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Everything you need to make informed farming decisions
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform combines local knowledge with modern agricultural science to help you select the right
                crops, manage pests effectively, and monitor weather conditions.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/crop-recommendation">
                  <Button className="bg-green-700 hover:bg-green-800">Crop Recommendations</Button>
                </Link>
                <Link href="/pest-management">
                  <Button variant="outline">Pest Management</Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src="/placeholder.svg?height=400&width=600"
                width={600}
                height={400}
                alt="Nigerian farmer using a tablet in the field"
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

