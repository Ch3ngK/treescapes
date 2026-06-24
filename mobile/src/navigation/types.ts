// List of screens and what parameters each screen expects.
export type RootStackParamList = {
    Login: undefined;
    Sites: undefined;
    SiteDetail: {
        siteId: number;
        siteName: string;
    };
    EvaluationDetail: {
        evaluationId: number; 
    };
    CreateEvaluation: {
        siteId: number;
        siteName: string;
    };
};