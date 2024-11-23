"use client"

import React from "react"
import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

interface RadialChartTextProps {
  title: string
  value: number
  maxValue: number
  gradientColors: [string, string] // e.g., ["green", "red"]
}

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function RadialChartText({
  title,
  value,
  maxValue,
  gradientColors,
}: RadialChartTextProps) {
  const percentage = (value / maxValue) * 100
  const chartData = [{ name: title, value: percentage, fill: "url(#colorGradient)" }]

  const gradientId = `gradient-${title.replace(/\s+/g, "-").toLowerCase()}`

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Score out of {maxValue}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            width={200}
            height={200}
            data={chartData}
            innerRadius="70%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={gradientColors[0]} />
                <stop offset="100%" stopColor={gradientColors[1]} />
              </linearGradient>
            </defs>
            <RadialBar background dataKey="value" fill={`url(#${gradientId})`} />

            <PolarGrid />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              {/* <Label
                content={({ viewBox }) => {
                  const { cx, cy } = viewBox
                  return (
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-foreground text-4xl font-bold"
                    >
                      {value}
                    </text>
                  )
                }}
              /> */}
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">Current Score</p>
      </CardFooter>
    </Card>
  )
}
