import { VulnerabilitySchema } from "@/lib/types";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI();


export async function parseCVEWithAI(singleVulnerabilityAsString: string) {
    const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "I want you to generate a technical report for a single vulnerability. Interpret the technical report given to display relevant information to the user." },
            { role: "user", content: singleVulnerabilityAsString },
        ],
        response_format: zodResponseFormat(VulnerabilitySchema, "vulnerability"),
    });
    const cve = completion.choices[0].message.parsed;
    return cve;
}
