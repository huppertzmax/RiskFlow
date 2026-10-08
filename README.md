# RiskFlow

**From a CVE report to affected systems, risk scores and a remediation plan in seconds.**

🥈 2nd place in the **Siemens challenge at [hackaTUM 2024](https://hack.tum.de/)** · [Devpost](https://devpost.com/software/riskflow)

Modern infrastructure is too large to check by hand every time a new vulnerability is published. RiskFlow automates that workflow. You upload a CVE, and RiskFlow works out which systems in the network are affected, how likely an attack is, how much damage it could do, and who needs to act.

## How it works

1. **Extract:** the raw CVE text is parsed by an LLM (OpenAI structured outputs + Zod schema) into structured data: CVSS, EPSS, affected vendors/products/versions, and the available fix.
2. **Match:** optimized Cypher queries run against a Neo4j graph of the infrastructure (provided by Siemens) to find every affected system and its network context.
3. **Score:** for each system, RiskFlow combines the exploit probability (EPSS, weighted higher when no patch exists) with an impact score. It also adds new metrics such as **reachability from the internet or from already-compromised systems**, and an impact analysis per network segment based on critical systems and newly reachable offline systems.
4. **Report:** interactive dashboards and a report with recommended actions and responsible persons, written for both engineers and decision-makers.

## Engineering highlight

The first version of the graph query took **over 80 seconds**. With parallel query execution, strategic indexing and restructured Cypher queries, we brought it down to **~13 seconds**.

## Tech stack

Next.js (App Router) · TypeScript · Neo4j · OpenAI API · Mantine / Radix UI · Postgres (Neon) · NextAuth · Vercel

## Running locally

```bash
npm install
npm run dev
```

Create a `.env` file with:

| Variable | Purpose |
|---|---|
| `OPENAI_API_KEY` | LLM-based CVE extraction |
| `NEO4J_URI`, `NEO4J_USERNAME`, `NEO4J_PASSWORD` | Infrastructure graph database |
| `POSTGRES_URL` | App database |
| `GITHUB_ID`, `GITHUB_SECRET` | GitHub login via NextAuth |

> The Neo4j infrastructure dataset was provided by Siemens for the hackathon and is not part of this repository.

*Hackathon code, kept as it was at submission time.*
