export type Vulnerability = {
  id: string;
  image: string;
  label: string;
  description: string;
  content: {
    system_id: string;
    severity: string;
    human_readable: string;
    risk_scores: {
      probability_score: number;
      impact_score: number;
      overall_danger: string;
    };
    reasons: {
      probability: { cve: string; epss: number; description: string }[];
      impact: string[];
    };
    recommended_actions: {
      isolate_network: string;
      patchable: boolean;
      patch_timeline: string;
    };
    responsible_personnel: {
      technical_contacts: string[];
      manager: string;
    };
    cve_summary: {
      cve_id: string;
      occurrences: number;
      notes: string;
    };
  };
}


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

