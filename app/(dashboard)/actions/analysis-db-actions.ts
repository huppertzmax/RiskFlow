"use server";

import { db, analysisReports } from "@/lib/db";
import { desc, eq } from "drizzle-orm";

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

export async function isLoadingAnalysis() {
    const { isProcessing } = await getAnalysisStatus();
    return isProcessing;
}

export async function getLatestReport() {
    const [latestReport] = await db
        .select()
        .from(analysisReports)
        .orderBy(desc(analysisReports.timeStartProcessing))
        .limit(1);

    if (!latestReport) return null;

    return latestReport.report;
}

export async function getFirstFinishedReportId() {
    const [finishedReport] = await db
        .select()
        .from(analysisReports)
        .where(eq(analysisReports.status, 'completed'))
        .orderBy(desc(analysisReports.timeStartProcessing))
        .limit(1);

    return finishedReport?.report ?? null;
}

export async function getReportById(id: number) {
    const [report] = await db
        .select()
        .from(analysisReports)
        .where(eq(analysisReports.id, id))
        .limit(1);

    if (!report) return null;

    return {
        ...report,
        report: report.report
    };
}
