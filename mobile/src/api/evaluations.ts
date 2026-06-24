import { API_BASE_URL } from "./config";

export type EvaluationResponse = {
    id: number;
    checklist_item_id: number; 
    checklist_item: {
        id: number;
        code: string;
        description: string;
        max_points: number;
        display_order: number;
    };
    score: number;
    remarks: string | null;
}

export type Evaluation = {
    id: number;
    site_id: number;
    evaluator_id: number;
    template_id: number; 
    evaluation_date: string;
    total_score: number;
    percentage: number;
    benchmark_band: string | null;
    general_comments: string | null;
    site_in_charge_name: string | null;
    horticulturist_in_charge_name: string | null;
    status: string;
    responses: EvaluationResponse[];
};

export async function getEvaluationsForSite(
    token: string,
    siteId: number
): Promise<Evaluation[]> {
    const response = await fetch(
        `${API_BASE_URL}/evaluations?site_id=${siteId}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            
        }
    );

    if (!response.ok) {
        throw new Error("Failed to load evaluations.")
    }

    return response.json();
}

export async function getEvaluationById(
    token: string,
    evaluationId: number
): Promise<Evaluation> {
    const response = await fetch(
        `${API_BASE_URL}/evaluations/${evaluationId}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to load evaluation.");
    }

    return response.json();
}
