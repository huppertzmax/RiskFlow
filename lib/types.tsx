import { z } from "zod";

export type Task = {
  id: number;
  title: string;
  description: string;
  urgency: "High" | "Medium" | "Low";
};


export type Employee = {
  id: number;
  name: string;
  role: string;
  status: "Available" | "Busy";
};

export const VulnerabilitySchema = z.object({
  id: z.string().describe("Unique identifier for the vulnerability"),
  color: z.string().describe("Color indicating severity: green, yellow, red"),
  label: z.string().describe("Short label for the vulnerability"),
  description: z.string().describe("Detailed description of the vulnerability"),
  content: z.object({
      system_id: z.string().describe("Identifier for the affected system"),
      severity: z.enum(["High", "Medium", "Low"]).describe("Severity level of the vulnerability"),
      human_readable: z.string().describe("Human-readable explanation of the vulnerability"),
      risk_scores: z.object({
          probability_score: z.number().describe("Score indicating the probability of exploitation"),
          impact_score: z.number().describe("Score indicating the potential impact of the vulnerability"),
          overall_danger: z.enum(["High", "Medium", "Low"]).describe("Overall danger level of the vulnerability"),
      }),
      reasons: z.object({
          probability: z.array(z.object({
              cve: z.string().describe("CVE identifier related to the probability"),
              epss: z.number().describe("Expected Probability of Seriousness Score"),
              description: z.string().describe("Description of the reason for the probability score"),
          })),
          impact: z.array(z.string()).describe("List of reasons for the impact score"),
      }),
      recommended_actions: z.object({
          isolate_network: z.string().describe("Recommended action to isolate the network"),
          patchable: z.boolean().describe("Indicates if the vulnerability is patchable"),
          patch_timeline: z.string().describe("Recommended timeline for patching the vulnerability"),
      }),
      responsible_personnel: z.object({
          technical_contacts: z.array(z.string()).describe("List of technical contacts responsible for the vulnerability"),
          manager: z.string().describe("Manager responsible for overseeing the vulnerability"),
      }),
      cve_summary: z.object({
          cve_id: z.string().describe("CVE identifier for the vulnerability summary"),
          occurrences: z.number().describe("Number of occurrences of this vulnerability"),
          notes: z.string().describe("Additional notes regarding the vulnerability"),
      }),
  }),
});

export type Vulnerability = z.infer<typeof VulnerabilitySchema>;


export const ReportSchema = z.object({
  individual_scores: z.array(z.object({
    system_id: z.string(),
    recommended_actions: z.object({
      isolate_network: z.string(),
      patchable: z.boolean(),
      days: z.number(),
    }),
    persons: z.object({
      technical: z.array(z.string()),
      manager: z.array(z.string()),
    }),
    risk: z.object({
      probability: z.object({
        score: z.number(),
        reasons: z.array(z.object({
          cve: z.string(),
          epss: z.number(),
        })),
      }),
    }),
    impact: z.object({
      score: z.number(),
      reasons: z.array(z.string()),
    }),
  })),
  overall_score: z.object({
    probability: z.number(),
    impact: z.number(),
    danger: z.enum(["high", "medium", "low"]),
  }),
  cve_count: z.array(z.object({
    name: z.string(),
    count: z.number(),
  })),
});

export type Report = z.infer<typeof ReportSchema>;

export type EnrichedReport = Report & {
  gpt_vulnerabilities: Vulnerability[];
}