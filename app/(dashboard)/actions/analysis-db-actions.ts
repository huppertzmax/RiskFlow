"use server";

import { db, analysisReports } from "@/lib/db";
import { desc } from "drizzle-orm";
import { getAnalysisStatus } from "./run-analysis-in-background";


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

    return {
        ...latestReport,
        report: latestReport.report
    };
}
