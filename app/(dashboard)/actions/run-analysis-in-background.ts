"use server"

import { analysisReports, db } from "@/lib/db"
import { runRiskAnalysis } from "../actions"
import { EXAMPLE_CVE } from "../investigation/example-cve"
import { eq, desc } from "drizzle-orm"
import { parseCVEWithAI } from "./parseCVEWithAI"
import { EnrichedReport } from "@/lib/types"
import { convertReportToVulnerabilities } from "@/lib/reportToVulnerabilities"
import { Report } from "@/lib/types"


export async function runAnalysisInBackground(
    cves: typeof EXAMPLE_CVE[],
    systems: {
        id: number;
        name: string;
    }[]
) {
    // Create new report entry and get its ID
    const [newReport] = await db.insert(analysisReports)
        .values({
            status: 'processing',
            timeStartProcessing: new Date(),
        })
        .returning({ id: analysisReports.id });

    try {
        const report: Report = await runRiskAnalysis(cves, systems);

        const gptVulnerabilities = convertReportToVulnerabilities(report);
        const enrichedReport = {
            ...report,
            gpt_vulnerabilities: gptVulnerabilities
        }

        // Update report with results
        await db.update(analysisReports)
            .set({
                status: 'completed',
                timeEndProcessing: new Date(),
                report: JSON.stringify(enrichedReport)
            })
            .where(eq(analysisReports.id, newReport.id));

        return newReport.id;
    } catch (error) {
        // Update report with error status
        await db.update(analysisReports)
            .set({
                status: 'error',
                timeEndProcessing: new Date(),
            })
            .where(eq(analysisReports.id, newReport.id));

        throw error;
    }
}

