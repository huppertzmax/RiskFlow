"use client"

import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus, Trash2, Upload } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CVESpiderChart } from "./cve-spider-chart"
import { listOfSystems } from "./neo4j_query_table_data_2024-11-23"

const steps = [
  {
    name: "Upload CVE",
    value: 10,
  }
]

const EXAMPLE_CVE = {
  "id": "CVE-1900-8033",
  "name": "Critical Remote Code Execution Vulnerability in Docker",
  "date": "2024-11-20",
  "description": "A critical vulnerability has been discovered in Docker’s container runtime, identified as CVE-1900-8033. This vulnerability allows an attacker to execute arbitrary code on the host system by exploiting a flaw in the handling of API requests. The issue arises from improper validation of input data, leading to a buffer overflow condition. Impact: Successful exploitation of this vulnerability can lead to remote code execution, allowing attackers to gain control over the host system. This can result in data breaches, service disruptions, and unauthorized access to sensitive information.",
  "epss": 96.89,
  "cvss": {
    "base_score": 5.5,
    "exploitability_score": 1.3,
    "impact_score": 5.8,
    "access_vector": "network",
    "access_complexity": "medium",
    "authentication": "none",
    "confidentiality_impact": "complete",
    "integrity_impact": "complete",
    "availability_impact": "complete"
  },
  "affected_cpe": [
    {
      "vendor": "docker",
      "product": "docker",
      "min_version": "23.0",
      "max_version": "26.1.3"
    },
    {
      "vendor": "docker",
      "product": "cli",
      "min_version": "23.0",
      "max_version": "26.1.3"
    },
    {
      "vendor": "docker",
      "product": "desktop",
      "min_version": "23.0",
      "max_version": "26.1.3"
    }
  ],
  "solution": "Currently, there is no official solution available. Implement network segmentation to limit exposure. Monitor systems for unusual activity and apply security best practices."
}

export default function InvestigationPage() {
  const [currentStep, setCurrentStep] = useState({ name: "", value: 0 })
  const [selectedSystems, setSelectedSystems] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [cves, setCves] = useState<typeof EXAMPLE_CVE[]>([])

  useEffect(() => {
    const timer = setTimeout(() => setCurrentStep(steps[0]), 500)
    return () => clearTimeout(timer)
  }, [])

  const filteredSystems = listOfSystems
    .filter(sys =>
      sys.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 100)

  const handleAnalyze = () => {
    if (selectedSystems.length === 0 || cves.length === 0) {
      alert("Please select at least one system and one CVE")
      return
    }
    console.log("Analyzing:", { selectedSystems, cves })
  }

  return (
    <div className="p-8">
      <div className="text-2xl font-semibold mb-2">{currentStep.name}</div>
      <Progress value={currentStep.value} className="my-8 w-[90%] [&>div]:bg-blue-400 shadow-sm" />

      <div className="grid grid-cols-3 gap-6">
        {/* CVE List Column */}
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">CVEs</h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
          {cves && cves.length > 0 ? (
            <ScrollArea className="h-[500px]">
              {cves.map((cve, i) => (
                <div key={i} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded">
                  <div>
                    <div className="font-medium">{cve.id}</div>
                    <div className="text-sm text-muted-foreground">{cve.name}</div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setCves(cves.filter((_, idx) => idx !== i))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </ScrollArea>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              No CVEs added yet
            </div>
          )}
        </div>

        {/* Systems List Column */}
        <div className="border rounded-lg p-4">
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search systems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8"
              />
            </div>
          </div>
          <ScrollArea className="h-[500px]">
            {filteredSystems.map((system) => (
              <div key={system.id} className="flex items-center space-x-2 p-2">
                <Checkbox
                  checked={selectedSystems.includes(system.id)}
                  onCheckedChange={(checked: boolean) => {
                    setSelectedSystems(
                      checked
                        ? [...selectedSystems, system.id]
                        : selectedSystems.filter(id => id !== system.id)
                    )
                  }}
                />
                <label className="text-sm">{system.name}</label>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Visualization Column */}
        <div>
          <CVESpiderChart cves={cves} />
          <Button
            className="w-full mt-4"
            size="lg"
            onClick={handleAnalyze}
            disabled={selectedSystems.length === 0 || cves.length === 0}
          >
            Run Analysis
          </Button>
        </div>
      </div>
    </div>
  )
}

