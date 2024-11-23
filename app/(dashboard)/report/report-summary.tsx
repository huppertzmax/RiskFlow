import React from "react"
import { RadialChartText } from "./radial-chart-text"
import { RadialChartStacked } from "./radial-chart-stacked"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface CVECount {
  name: string
  count: number
}

interface Report {
  individual_scores: any[] // Define more specific types as needed
  overall_score: {
    probability: number
    impact: number
    danger: string
  }
  cve_count: CVECount[]
}

interface ReportSummaryChartsProps {
  report: Report
}

export default function ReportSummaryCharts({ report }: ReportSummaryChartsProps) {
  const { overall_score, cve_count } = report
  const totalCVE = cve_count.reduce((acc, curr) => acc + curr.count, 0)

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Top Row: Probability and Impact */}
      <RadialChartText
        title="Probability Score"
        value={overall_score.probability}
        maxValue={10}
        gradientColors={["green", "red"]}
      />
      <RadialChartText
        title="Impact Score"
        value={overall_score.impact}
        maxValue={10}
        gradientColors={["green", "red"]}
      />

      {/* Bottom Row: CVE Count and Top CVEs */}
      <RadialChartStacked
        title="CVE Distribution"
        data={cve_count}
        total={totalCVE}
      />
      <Card>
        <CardHeader>
          <CardTitle>Top CVEs</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5">
            {cve_count.map((cve) => (
              <li key={cve.name}>
                {cve.name}: {cve.count}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

