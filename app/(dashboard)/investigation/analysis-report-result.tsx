export const report = {
    "individual_scores": [
        {
            "system_id": "247012576",
            "recommended_actions": {
                "isolate_network": "recommended",
                "patchable": true,
                "days": 30
            },
            "persons": {
                "technical": ["Bob Ross", "John Cena"],
                "manager": ["John Wayne"],
            },
            "risk": {
                "probability": {
                    "score": 5.5,
                    "reasons": [
                        {
                            "cve": "CVE-1900-8033",
                            "epss": 3.5,
                        },
                        {
                            "cve": "CVE-1900-8033",
                            "epss": 0.1,
                        },
                        {
                            "cve": "CVE-1900-8033",
                            "epss": 3.3,
                        }
                    ]
                },
                "impact": {
                    "score": 3.3,
                    "reasons": ["Critical System", "Client Device", "CVSS Score 5.5"]
                }
            }
        }
    ],
    "overall_score":
    {
        "probability": 5.5,
        "impact": 3.3,
        "danger": "medium",
    },
    "cve_count": [
        {
            "name": "CVE-1900-8033",
            "count": 3
        }
    ]
}