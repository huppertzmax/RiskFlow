import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI();

const VulnerabilitySchema = z.object({
    id: z.string(),
    image: z.string(),
    label: z.string(),
    description: z.string(),
    content: z.object({
        system_id: z.string(),
        severity: z.string(),
        human_readable: z.string(),
        risk_scores: z.object({
            probability_score: z.number(),
            impact_score: z.number(),
            overall_danger: z.string(),
        }),
        reasons: z.object({
            probability: z.array(z.object({
                cve: z.string(),
                epss: z.number(),
                description: z.string(),
            })),
            impact: z.array(z.string()),
        }),
        recommended_actions: z.object({
            isolate_network: z.string(),
            patchable: z.boolean(),
            patch_timeline: z.string(),
        }),
        responsible_personnel: z.object({
            technical_contacts: z.array(z.string()),
            manager: z.string(),
        }),
        cve_summary: z.object({
            cve_id: z.string(),
            occurrences: z.number(),
            notes: z.string(),
        }),
    }),
});


export async function parseCVEWithAI(singleVulnerabilityAsString: string) {
    const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "On the basis of my requested form." }, // TODO: finish prompt
            { role: "user", content: singleVulnerabilityAsString },
        ],
        response_format: zodResponseFormat(VulnerabilitySchema, "vulnerability"),
    });
    const cve = completion.choices[0].message.parsed;
    return cve;
}
