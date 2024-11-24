import { Report } from "@/lib/types";

const internetAccessFactor = 0.005;

export function calculateRiskScores(affectedSystems: Map<number, object>, cves: any[]) {
    let individual_scores = calculateScoresBySystem(affectedSystems, cves);
    let global_scores = individual_scores.global;
    let cve_count = getCVECount(affectedSystems, cves);

    return {individual_scores: individual_scores.individualScores, overall_score: global_scores, cve_count: cve_count};
}


function calculateScoresBySystem(affectedSystems: Map<number, object>, cves: any[]) {
    let individualScores = []
    let mulProp = 1.;
    let mulImpact = 1.;

    affectedSystems.forEach(sys => {
        let dictProb = calculateIndividualProbScore(sys, cves);
        let dictImpact = calculateIndividualImpactScore(sys);
        let dictRecommendations = calculateRecommendActions(dictProb.allPatchable, dictImpact.score, dictProb.prob);
        let dictPersons = sys['persons'];
        let dict = {system_id: sys.id, recommended_actions: dictRecommendations, persons: dictPersons, risk: dictProb.dict, impact: dictImpact.dict}
        individualScores.push(dict);

        mulProp *= (1. - dictProb.prob);
        mulImpact *= (1. - dictImpact.score);
    })

    let global = calculateOverallScores(mulProp, mulImpact);

    return {individualScores: individualScores, global: global};
}

function calculateIndividualProbScore(system: object, cves: any) {
    let mul = 1.; 
    let prob = 1.;
    let allPatchable = true;
    let reasons = [];
    for (let i = 0; i < system.cves.length; i++) {
        let cve = findMatchingCVE(system.cves[i], cves);
        let epss = cve.epss/100.;
        reasons.push({cve: cve.id, epss: epss});

        if (!cve.patchable) {
            epss = (1. - Math.pow((1. - epss), 2)) 
            allPatchable = false;
        }
        mul *= (1. - epss)
    }
    prob -= mul;

    if (system['risk']['accessible_from_internet'] == false) {
        prob *= internetAccessFactor;
    }

    return {dict: {probability: {score: Math.abs(prob), reasons: reasons}}, prob: Math.abs(prob), allPatchable: allPatchable};
}

function calculateIndividualImpactScore(system: object) {
    let points = 0.;
    let reasons = [];

    if (system['risk']['critical_system']) {
        points += 5; 
        reasons.push('Critical System');
    }

    if (system['risk']['system_type'] === 'Client') {
        points += 1; 
    }
    else if (system['risk']['system_type'] === 'Server') {
        points += 1.5
    }
    else if (system['risk']['system_type'] === 'Router') {
        points += 2
    }
    reasons.push(system['risk']['system_type']);

    if (system['risk']['network_segment_risk'] >= 1 && system['risk']['network_segment_risk'] < 3) {
        points += 1; 
        reasons.push('Low network segment risk');
    }
    else if (system['risk']['network_segment_risk'] >= 3 && system['risk']['network_segment_risk'] < 10) {
        points += 2;
        reasons.push('Medium network segment risk');
    }
    else if (system['risk']['network_segment_risk'] >= 10) {
        points += 3;
        reasons.push('High network segment risk');
    }

    if (system['risk']['network_segment_exposed'] >= 1 && system['risk']['network_segment_exposed'] < 3) {
        points += 1; 
        reasons.push('Low network segment exposure');
    }
    else if (system['risk']['network_segment_exposed'] >= 3 && system['risk']['network_segment_exposed'] < 10) {
        points += 2;
        reasons.push('Medium network segment exposure');
    }
    else if (system['risk']['network_segment_exposed'] >= 10) {
        points += 3;
        reasons.push('High network segment exposure');
    }

    points /= 23.;

    return {dict: {impact: {score: points, reasons: reasons}}, score: points};
}

function calculateRecommendActions(allPatchable, impact, probability) {
    let isolation = 'none';
    if (!allPatchable) {isolation = 'necessary'}
    else if (impact >= 7.5) {isolation = 'recommended'}

    let days = Math.abs(60 - Math.round(60 * (probability * impact)));
    
    return {isolate_network: isolation, patchable: allPatchable, days: days};
}

function calculateOverallScores(mulProp, mulImpact) {
    let prop = 1. - mulProp;
    let impact = 1. - mulImpact;
    let mul = Math.abs(prop * impact);
    let danger: "low" | "medium" | "high" = 'low';

    if ( mul <= 0.3) {
        danger = 'low';
    }
    else if (mul > 0.3 && mul < 70) {
        danger = 'medium';
    }
    else if (mul >= 0.7) {
        danger = 'high';
    }

    return {probability: prop, impact: impact, danger: danger}
}

function getCVECount(affectedSystems: Map<number, object>, cves: any[]) {
    let cveCount = [];
    let count = 0;

    let systems = Array.from(affectedSystems.values());

    cves.forEach(cve => {
        for (let i = 0; i < systems.length; i++) {
            if (systems[i]['cves'].includes(cve.id)) {
                count++;
            }
        }
        cveCount.push({name: cve.id, count: count});
        count = 0;
    });
    return cveCount;
}

function findMatchingCVE(cveId: string, cves: any[]) {
    for (let i = 0; i < cves.length; i++) {
        if (cveId === cves[i].id) {
            return cves[i];
        }
    }
}
