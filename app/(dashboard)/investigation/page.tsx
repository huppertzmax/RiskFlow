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
import { EXAMPLE_CVE, EXAMPLE_CVE_2 } from "./example-cve"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { parseCVEWithAI } from "../actions/parseCVEWithAI"
import { runAnalysisInBackground } from "../actions/run-analysis-in-background"
import { isLoadingAnalysis } from "../actions/analysis-db-actions"
import { toast } from "@/components/ui/use-toast"

export const maxDuration = 300;

const steps = [
  {
    name: "Upload CVE",
    value: 10,
  },
  {
    name: "Select Systems",
    value: 40,
  },
  {
    name: "Run Analysis",
    value: 80,
  }
]

const isCVEFormat = (obj: any): obj is typeof EXAMPLE_CVE => {
  return (
    typeof obj.id === "string" &&
    typeof obj.name === "string" &&
    true
  )
}

const parseCVEData = async (text: string): Promise<typeof EXAMPLE_CVE> => {
  try {
    const parsedData = JSON.parse(text)
    if (isCVEFormat(parsedData)) {
      return parsedData
    }
    const result = await parseCVEWithAI(text)
    if (result) {
      return result
    }
    throw new Error("Failed to parse CVE data")
  } catch (error) {
    const result = await parseCVEWithAI(text)
    if (result) {
      return result
    }
    throw new Error("Failed to parse CVE data")
  }
}

export default function InvestigationPage() {
  const [currentStep, setCurrentStep] = useState({ name: "", value: 0 })
  const [selectedSystems, setSelectedSystems] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [cves, setCves] = useState<typeof EXAMPLE_CVE[]>([EXAMPLE_CVE_2])
  const [jsonInput, setJsonInput] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setCurrentStep(steps[0]), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (cves.length > 1 || (cves.length > 0 && cves[0].id !== EXAMPLE_CVE_2.id)) {
      setCurrentStep(steps[1])
    } else {
      setCurrentStep(steps[0])
    }
    if (selectedSystems.length > 0) {
      setCurrentStep(steps[2])
    }
  }, [cves, selectedSystems])

  const filteredSystems = listOfSystems
    .filter(sys => {
      const displayName = `${sys.name} (${sys.id})`
      return displayName.toLowerCase().includes(searchTerm.toLowerCase())
    })
    .slice(0, 200)

  const handleAnalyze = async () => {
    console.log("Analyzing:", { selectedSystems, cves })
    const selectedSystemObjects = listOfSystems.filter(sys => 
      selectedSystems.includes(sys.id)
    );
    toast({ title: "Processing Started!", description: "This might take up to a minute. Once done, the newest report will be available in the reports tab!", variant: "default", className: "bg-blue-400 text-white", duration: 6000 });
    runAnalysisInBackground(cves, selectedSystemObjects);
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const parsedCVE = await parseCVEData(text)
      setCves([...cves, parsedCVE])
    } catch (error) {
      alert("Failed to parse CVE data")
    }
  }

  const handleAddCVE = async () => {
    try {
      const parsedCVE = await parseCVEData(jsonInput)
      setCves([...cves, parsedCVE])
      setJsonInput("")
      setDialogOpen(false)
    } catch (error) {
      alert("Failed to parse CVE data")
    }
  }

  return (
    <>
      <div className="text-2xl font-semibold mb-2">{currentStep.name}</div>
      <Progress value={currentStep.value} className="my-8 w-[90%] [&>div]:bg-blue-400 shadow-sm" />

      <div className="grid grid-cols-3 gap-6">
        {/* CVE List Column */}
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">CVEs</h3>
            <div className="flex gap-2">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileUpload}
                accept=".json,.txt"
              />
              <Button size="sm" variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add CVE</DialogTitle>
                  </DialogHeader>
                  <Textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder="Paste CVE JSON here..."
                    className="min-h-[200px]"
                  />
                  <Button onClick={handleAddCVE} className="mt-4">Add CVE</Button>
                </DialogContent>
              </Dialog>
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
                <label className="text-sm">{system.name} ({system.id})</label>
              </div>
            ))}
          </ScrollArea>
        </div>

        {cves.length > 0 && (
          <div className="border rounded-lg p-4 flex flex-col justify-between">
            <CVESpiderChart cves={cves} />
            <Button
              className="w-full mt-4"
              size="lg"
              onClick={handleAnalyze}
            >
              Run Analysis
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

