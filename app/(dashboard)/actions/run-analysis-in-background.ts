"use server"

import { analysisReports, db } from "@/lib/db"
import { runRiskAnalysis } from "../actions"
import { EXAMPLE_CVE } from "../investigation/example-cve"
import { eq, desc } from "drizzle-orm"

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
        const report = await runRiskAnalysis(cves, systems);
        
        // Update report with results
        await db.update(analysisReports)
            .set({
                status: 'completed',
                timeEndProcessing: new Date(),
                report: JSON.stringify(report)
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

// Helper function to check status
export async function getAnalysisStatus() {
    const [latestReport] = await db
        .select({
            id: analysisReports.id,
            status: analysisReports.status
        })
        .from(analysisReports)
        .orderBy(desc(analysisReports.timeStartProcessing))
        .limit(1);
    
    return {
        isProcessing: latestReport?.status === 'processing',
        reportId: latestReport?.id
    };
}

export async function getLatestReport() {
    const [latestReport] = await db
        .select()
        .from(analysisReports)
        .orderBy(desc(analysisReports.timeStartProcessing))
        .limit(1);
    
    if (!latestReport) return null;
    
    return {
        ...latestReport,
        report: latestReport.report
    };
}
