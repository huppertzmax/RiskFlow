import { Report, Vulnerability } from './types';

export function convertReportToVulnerabilities(report: Report): Vulnerability[] {
    return report.individual_scores.map((score, index): Vulnerability => {
        // Determine color based on risk scores
        const overallRisk = calculateOverallRisk(score.risk.probability.score, score.risk.impact.score);
        
        return {
            id: `VULN-${score.system_id}-${index}`,
            color: getRiskColor(overallRisk),
            label: `System ${score.system_id} Vulnerability`,
            description: `Critical vulnerability detected in system ${score.system_id}`,
            content: {
                system_id: score.system_id,
                severity: overallRisk,
                human_readable: generateHumanReadableDescription(score),
                risk_scores: {
                    probability_score: score.risk.probability.score,
                    impact_score: score.risk.impact.score,
                    overall_danger: overallRisk,
                },
                reasons: {
                    probability: score.risk.probability.reasons.map(reason => ({
                        cve: reason.cve,
                        epss: reason.epss,
                        description: `CVE ${reason.cve} with an EPSS score of ${reason.epss}`,
                    })),
                    impact: score.risk.impact.reasons,
                },
                recommended_actions: {
                    isolate_network: score.recommended_actions.isolate_network,
                    patchable: score.recommended_actions.patchable,
                    patch_timeline: generatePatchTimeline(score.recommended_actions.days),
                },
                responsible_personnel: {
                    technical_contacts: score.persons.technical,
                    manager: score.persons.manager[0] || 'Unassigned',
                },
                cve_summary: {
                    cve_id: score.risk.probability.reasons[0]?.cve || 'No CVE',
                    occurrences: getCVEOccurrences(score.risk.probability.reasons[0]?.cve || '', report.cve_count),
                    notes: generateCVENotes(score),
                },
            },
        };
    });
}

function calculateOverallRisk(probability: number, impact: number): "High" | "Medium" | "Low" {
    const score = probability * impact;
    if (score > 0.66) return "High";
    if (score > 0.33) return "Medium";
    return "Low";
}

function getRiskColor(risk: "High" | "Medium" | "Low"): string {
    return {
        High: "red",
        Medium: "yellow",
        Low: "green",
    }[risk];
}

function generateHumanReadableDescription(score: Report['individual_scores'][0]): string {
    return `System ${score.system_id} has been identified with ${score.risk.probability.reasons.length} potential vulnerabilities. 
    The system shows a probability score of ${(score.risk.probability.score * 100).toFixed(1)}% and an impact score of ${(score.risk.impact.score * 100).toFixed(1)}%. 
    ${score.recommended_actions.patchable ? 'This vulnerability can be patched' : 'This vulnerability requires manual intervention'}.`;
}

function generatePatchTimeline(days: number): string {
    if (days === 0) return "Immediate action required";
    if (days <= 7) return "Patch within one week";
    if (days <= 30) return "Patch within one month";
    return "Patch during next maintenance window";
}

function generateCVENotes(score: Report['individual_scores'][0]): string {
    const actionNeeded = score.recommended_actions.patchable 
        ? `Patchable vulnerability - action required within ${score.recommended_actions.days} days`
        : "Manual intervention required";
    return `${actionNeeded}. Impact reasons: ${score.risk.impact.reasons.join(". ")}`;
}

function getCVEOccurrences(cve: string, cveCount: Report['cve_count']): number {
    return cveCount.find(c => c.name === cve)?.count || 1;
} 