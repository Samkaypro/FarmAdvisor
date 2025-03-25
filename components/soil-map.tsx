"use client"

import { useEffect, useRef } from "react"

interface SoilMapProps {
  location: string
}

export function SoilMap({ location }: SoilMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // This is a placeholder for an actual map implementation
    // In a real application, you would use a library like Leaflet or Google Maps
    if (mapRef.current) {
      const canvas = document.createElement("canvas")
      canvas.width = mapRef.current.clientWidth
      canvas.height = mapRef.current.clientHeight
      mapRef.current.innerHTML = ""
      mapRef.current.appendChild(canvas)

      const ctx = canvas.getContext("2d")
      if (ctx) {
        // Draw a placeholder map with some soil zones
        ctx.fillStyle = "#e9e5d6"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw some soil zones
        const colors = ["#d4a373", "#ccd5ae", "#e9edc9", "#faedcd"]
        for (let i = 0; i < 8; i++) {
          ctx.fillStyle = colors[i % colors.length]
          ctx.beginPath()
          ctx.ellipse(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 100 + 50,
            Math.random() * 100 + 50,
            0,
            0,
            Math.PI * 2,
          )
          ctx.fill()
        }

        // Add a legend
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(10, 10, 150, 120)
        ctx.strokeStyle = "#000000"
        ctx.strokeRect(10, 10, 150, 120)

        ctx.font = "bold 14px Arial"
        ctx.fillStyle = "#000000"
        ctx.fillText("Soil Types", 15, 30)

        ctx.font = "12px Arial"
        colors.forEach((color, index) => {
          const y = 50 + index * 20
          ctx.fillStyle = color
          ctx.fillRect(15, y, 20, 15)
          ctx.strokeRect(15, y, 20, 15)
          ctx.fillStyle = "#000000"

          const soilTypes = ["Sandy Loam", "Clay", "Loamy", "Silty"]
          ctx.fillText(soilTypes[index], 45, y + 12)
        })

        // Add location marker
        ctx.fillStyle = "#ff0000"
        ctx.beginPath()
        ctx.arc(canvas.width / 2, canvas.height / 2, 8, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2
        ctx.stroke()

        // Add location name
        ctx.font = "bold 16px Arial"
        ctx.fillStyle = "#000000"
        ctx.textAlign = "center"
        ctx.fillText(
          location === "lagos"
            ? "Lagos"
            : location === "kano"
              ? "Kano"
              : location === "abuja"
                ? "Abuja"
                : "Selected Location",
          canvas.width / 2,
          canvas.height / 2 + 30,
        )
      }
    }
  }, [location])

  return (
    <div ref={mapRef} className="w-full h-full bg-muted flex items-center justify-center">
      <div className="text-muted-foreground">Loading soil map...</div>
    </div>
  )
}

