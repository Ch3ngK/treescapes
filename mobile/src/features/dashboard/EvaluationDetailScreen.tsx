import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, SafeAreaView, Text, View } from "react-native";
import { RouteProp } from "@react-navigation/native";

import { RootStackParamList } from "../../navigation/types";
import { useAuth } from "../auth/AuthContext";
import { Evaluation, getEvaluationById } from "../../api/evaluations";

type EvaluationDetailProp = RouteProp<RootStackParamList, "EvaluationDetail">;

type Props = {
    route: EvaluationDetailProp;
}

export function EvaluationDetailScreen({ route }: Props) {
    const { evaluationId } = route.params;

    const { token }  = useAuth();

    const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadEvaluation() {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true); 
                setError(null);
                
                const result = await getEvaluationById(token, evaluationId);
                setEvaluation(result); 
            } catch (err) {
                setError("Failed to load evaluation.");
            } finally {
                setLoading(false);
            }
        }

        loadEvaluation();
    }, [token, evaluationId]);

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center"}}>
                <ActivityIndicator />
            </SafeAreaView>
        )
    };

    if (error) {
        return(
            <SafeAreaView style={{ flex: 1, padding: 24 }}>
                <Text>{error}</Text>
            </SafeAreaView>
        )
    };

    if (!evaluation) {
        return (
            <SafeAreaView style={{ flex: 1, padding: 24 }}>
                <Text>Evaluation not found.</Text>
            </SafeAreaView>
        )
    };

    return (
        <SafeAreaView style={{ flex: 1, padding: 24 }}>
        <Text style={{ fontSize: 28, fontWeight: "700" }}>
            Evaluation #{evaluation.id}
        </Text>
        <Text>Date: {evaluation.evaluation_date}</Text>
        <Text>Score: {evaluation.percentage}%</Text>
        <Text>Status: {evaluation.status}</Text>
        <Text>Total Score: {evaluation.total_score}</Text>
        <Text>Benchmark: {evaluation.benchmark_band ?? "N/A"}</Text>
        <Text>General Comments: {evaluation.general_comments ?? "No comments"}</Text>
        
        <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 12 }}>
            Responses
        </Text>

        <FlatList
            data={evaluation.responses}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
            <View
                style={{
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#ddd",
                }}
            >
                <Text style={{ fontWeight: "700" }}>
                    {item.checklist_item.code}
                </Text>
                <Text>{item.checklist_item.description}</Text>
                <Text>
                    Score: {item.score} / {item.checklist_item.max_points}
                </Text>
                <Text>Remarks: {item.remarks ?? "No remarks"}</Text>
            </View>
        )}
        ListEmptyComponent={<Text>No responses found for this evaluation.</Text>}
      />
    </SafeAreaView>
    );
}
