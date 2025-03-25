"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"

export function WeatherChart() {
  // Sample data for temperature and rainfall over time
  const data = [
    { name: "Week 1", temperature: 32, rainfall: 5 },
    { name: "Week 2", temperature: 30, rainfall: 10 },
    { name: "Week 3", temperature: 31, rainfall: 15 },
    { name: "Week 4", temperature: 29, rainfall: 8 },
    { name: "Week 5", temperature: 28, rainfall: 12 },
    { name: "Week 6", temperature: 27, rainfall: 20 },
    { name: "Week 7", temperature: 26, rainfall: 18 },
    { name: "Week 8", temperature: 28, rainfall: 5 },
  ]

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#f97316"
            strokeWidth={2}
            activeDot={{ r: 8 }}
            name="Temperature (°C)"
          />
          <Line
            type="monotone"
            dataKey="rainfall"
            stroke="#0ea5e9"
            strokeWidth={2}
            activeDot={{ r: 8 }}
            name="Rainfall (mm)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

