"use server"

import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI();

const CVESchema = z.object({
    id: z.string(),
    name: z.string(),
    date: z.string(),
    description: z.string(),
    epss: z.number(),
    cvss: z.object({
        base_score: z.number(),
        exploitability_score: z.number(),
        impact_score: z.number(),
        access_vector: z.string(),
        access_complexity: z.string(),
        authentication: z.string(),
        confidentiality_impact: z.string(),
        integrity_impact: z.string(),
        availability_impact: z.string(),
    }),
    affected_cpe: z.array(z.object({
        vendor: z.string(),
        product: z.string(),
        min_version: z.string(),
        max_version: z.string(),
    })),
    solution: z.string(),
});

export async function parseCVEWithAI(plainText: string) {
    const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "Extract the CVE information." },
            { role: "user", content: plainText },
        ],
        response_format: zodResponseFormat(CVESchema, "cve"),
    });
    const gptReport = completion.choices[0].message.parsed;
    return gptReport;
}
