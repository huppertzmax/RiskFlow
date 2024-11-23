"use client"

import React from "react"
import { PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

interface CVECount {
  name: string
  count: number
}

interface RadialChartStackedProps {
  title: string
  data: CVECount[]
  total: number
}

export function RadialChartStacked({
  title,
  data,
  total,
}: RadialChartStackedProps) {
  const chartData = data.map((cve) => ({
    name: cve.name,
    value: (cve.count / total) * 100,
    fill: `hsl(${Math.random() * 360}, 70%, 50%)`, // Random color for each CVE
  }))

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
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
            <RadialBar background dataKey="value" />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground text-4xl font-bold"
              >
                {total}
              </text>
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">CVE Distribution</p>
      </CardFooter>
    </Card>
  )
}
