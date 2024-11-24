import React from "react"
import { RadialChartText } from "./radial-chart-text"
import { RadialChartStacked } from "./radial-chart-stacked"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { EnrichedReport } from "@/lib/types"

interface ReportSummaryChartsProps {
  report: EnrichedReport
}

export default function ReportSummaryCharts({ report }: ReportSummaryChartsProps) {
  const { overall_score, cve_count } = report
  const totalCVE = cve_count.reduce((acc, curr) => acc + curr.count, 0)

  if (!report) {
    return null
  }
  return (
    <div className="grid grid-cols-2 gap-4 p-8">
      {/* Top Row: Probability and Impact */}
      <RadialChartText
        title="Probability Score"
        value={overall_score.probability}
        maxValue={10}
      />
      <RadialChartText
        title="Impact Score"
        value={overall_score.impact}
        maxValue={10}
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
          <div className="space-y-2">
            {cve_count.map((cve) => (
              <div
                key={cve.name}
                className="flex items-center justify-between rounded-lg border p-3 text-sm"
              >
                <span className="font-medium">{cve.name}</span>
                <span className="rounded-full bg-muted px-2 py-1 text-xs">
                  {cve.count}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

