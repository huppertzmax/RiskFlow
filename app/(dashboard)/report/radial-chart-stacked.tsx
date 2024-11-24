"use client"

import React from "react"
import { PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
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
  vulnerabilities: {
    label: "Vulnerabilities",
    color: "hsl(var(--chart-1))",
  },
  uniqueCVE: {
    label: "Unique CVEs",
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
  const cveSum = data.reduce((acc, cve) => acc + cve.count, 0)
  const chartData = [{
    ...data.reduce((acc, cve, index) => ({
      ...acc,
      [cve.name]: (cve.count / total) * 100,
      [`${cve.name}Count`]: cve.count
    }), {})
  }]

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Distribution of {cveSum} vulnerabilities originating from {data.length} unique CVEs</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px] mb-[-60px] mt-[60px]"
        >
          <RadialBarChart
            width={200}
            height={200}
            data={chartData}
            innerRadius="70%"
            outerRadius="100%"
            startAngle={180}
            endAngle={0}
          >
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const dataKey = payload[0].dataKey as string
                  const count = payload[0].payload[`${dataKey}Count`]
                  const percentage = payload[0].value
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {dataKey}
                          </span>
                          <span className="font-bold">
                            {count} ({typeof percentage === 'number' ? percentage.toFixed(1) : percentage}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            {data.map((cve, index) => (
              <RadialBar
                key={cve.name}
                dataKey={cve.name}
                stackId="stack1"
                fill={`hsl(${180 + (index * 37) % 360}, 80%, 70%)`}
                className="stroke-transparent stroke-2"
              />
            ))}
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
