import { useAuth } from "../auth/AuthContext";
import React, { useState, useEffect } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, Text, View, TextInput, Pressable } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ChecklistTemplate, getActiveChecklistTemplate } from "../../api/checklistTemplates";
import { createEvaluation, CreateEvaluationPayload } from "../../api/evaluations"

import { RootStackParamList } from "../../navigation/types"

type CreateEvaluationRouteProp = RouteProp<RootStackParamList, "CreateEvaluation">

type CreateEvaluationScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "CreateEvaluation"
>;

type Props = {
    route: CreateEvaluationRouteProp;
};

export function CreateEvaluationScreen({ route }: Props) {
    const { siteId, siteName } = route.params;

    const { token } = useAuth();

    const [template, setTemplate] = useState<ChecklistTemplate | null>(null);
    // Use Record<number, ...> for an object keyed by checklist item id, each item id stores score and remarks.
    // example: 
    //  {
    //  12: { score: "4", remarks: "Healthy turf" },
    //  13: { score: "2", remarks: "Needs trimming" }
    //  }
    //
    const [responses, setResponses] = useState<Record<number, { score: string; remarks: string }>>({});
    const [evaluationDate, setEvaluationDate] = useState("");
    const [generalComments, setGeneralComments] = useState("");
    const [siteInChargeName, setSiteInChargeName] = useState("");
    const [horticulturistInChargeName, setHorticulturistInChargeName] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigation = useNavigation<CreateEvaluationScreenNavigationProp>();

    useEffect(() => {
        async function loadTemplate() {
            
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const result = await getActiveChecklistTemplate(token);
                setTemplate(result);
            } catch (err) {
                setError("Failed to load checklist template.");
            } finally {
                setLoading(false);
            }
            
        }

        loadTemplate();
    }, [token]);

    function updateScore(itemId: number, value: string) {
        setResponses((prev) => ({
            ...prev,
            [itemId]: {
                score: value,
                remarks: prev[itemId]?.remarks ?? "",
            },
        }));
    }

    function updateRemarks(itemId: number, value: string) {
        setResponses((prev) => ({
            ...prev,
            [itemId]: {
                score: prev[itemId]?.score ?? "",
                remarks: value,
            },
        }));
    }
    
    // Converts the form data in React state into the exact object the backend expects when creating an evaluation.
    function buildPayload(): CreateEvaluationPayload {
        if (!template) {
            throw new Error("Checklist template is missing");
        }
        
        const formattedResponses = Object.entries(responses).map(
            ([itemId, response]) => ({
                checklist_item_id: Number(itemId),
                score: Number(response.score),
                remarks: response.remarks.trim() ? response.remarks : null,
            })
        );

        return {
            site_id: siteId, 
            template_id: template.id,
            evaluation_date: evaluationDate, 
            general_comments: generalComments.trim() ? generalComments : null,
            site_in_charge_name: siteInChargeName.trim() ? siteInChargeName : null,
            horticulturist_in_charge_name: horticulturistInChargeName.trim()
                ? horticulturistInChargeName
                : null,
            responses: formattedResponses,
        };
    }

    async function handleSubmit() {
        if (!token || !template) {
            setError("Missing token or checklist template.");
            return;
        }

        if (!evaluationDate.trim()) {
            setError("Evaluation date is required.");
            return;
        }

        if (Object.keys(responses).length === 0) {
            setError("Please enter at least one checklist score.");
            return;
        }

        for (const [itemId, response] of Object.entries(responses)) {
            if (!response.score.trim()) {
                setError(`Score is required for checklist ${itemId}.`);
                return;
            }

            const numericScore = Number(response.score);

            // Catches if anything non-numerical is input into the checklist score
            if (Number.isNaN(numericScore)) {
                setError(`Score must be a number for checklist item ${itemId}.`);
                return;
            }

            const numericItemId = Number(itemId);

            const checklistItem = template.sections
                .flatMap((section) => section.items)
                .find((item) => item.id === numericItemId);

            if (!checklistItem) {
                setError(`Checklist item ${itemId} was not found in the template.`);
                return;
            }

            if (numericScore < 0) {
                setError(`Score cannot be negative for checklist item ${checklistItem.code}.`);
                return;
            }

            if (numericScore > checklistItem.max_points) {
                setError(
                `Score for ${checklistItem.code} cannot exceed ${checklistItem.max_points}.`
                );
                return;
            }
        }

        try {
            setSubmitting(true);
            setError(null);
            
            

            const payload = buildPayload();
            const savedEvaluation = await createEvaluation(token, payload);
            navigation.replace("EvaluationDetail", {
                evaluationId: savedEvaluation.id,
            });

            console.log("Created evaluation:", savedEvaluation.id);

        } catch (err) {
            setError("Failed to create evaluation.");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator />
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={{ flex: 1, padding: 24 }}>
                <Text>{error}</Text>
            </SafeAreaView>
        );
    }

    if (!template) {
        return (
        <SafeAreaView style={{ flex: 1, padding: 24 }}>
            <Text>No checklist template found.</Text>
        </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ padding: 24 }}>
                <View style={{ marginBottom: 20}}>
                    <Text style={{ fontSize: 28, fontWeight: "700"}}>
                        Create Evaluation
                    </Text>
                    <Text>Site: {siteName}</Text>
                    <Text>Site ID: {siteId}</Text>
                    <Text>Template: {template.name}</Text>
                </View>

                <Text>Evaluation Date</Text>
                <TextInput
                    value={evaluationDate}
                    onChangeText={setEvaluationDate}
                    placeholder="YYYY-MM-DD"
                    style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, marginTop: 6, marginBottom: 12 }}
                />

                <Text>Site In Charge Name</Text>
                <TextInput
                    value={siteInChargeName}
                    onChangeText={setSiteInChargeName}
                    placeholder="Enter site in charge name"
                    style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, marginTop: 6, marginBottom: 12 }}
                />

                <Text>Horticulturist In Charge Name</Text>
                <TextInput
                    value={horticulturistInChargeName}
                    onChangeText={setHorticulturistInChargeName}
                    placeholder="Enter horticulturist in charge name"
                    style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, marginTop: 6, marginBottom: 12 }}
                />

                <Text>General Comments</Text>
                <TextInput
                    value={generalComments}
                    onChangeText={setGeneralComments}
                    placeholder="Enter general comments"
                    multiline
                    style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, marginTop: 6, marginBottom: 20, minHeight: 100 }}
                />

                {template.sections.map((section) => (
                <View key={section.id} style={{ marginBottom: 24 }}>
                    <Text style={{ fontSize: 20, fontWeight: "700" }}>
                    {section.code} - {section.title}
                    </Text>
                    <Text>Section Max Points: {section.max_points}</Text>

                        {section.items.map((item) => (
                            <View
                                key={item.id}
                                style={{
                                marginTop: 12,
                                paddingVertical: 12,
                                borderBottomWidth: 1,
                                borderBottomColor: "#ddd",
                                }}
                            >
                                <TextInput 
                                    value={responses[item.id]?.score ?? ""}
                                    onChangeText={(value) => updateScore(item.id, value )}
                                    keyboardType="numeric"
                                />

                                <TextInput
                                    value={responses[item.id]?.remarks ?? ""}
                                    onChangeText={(value) => updateRemarks(item.id, value)}
                                />
                                
                                <Text style={{ fontWeight: "700" }}>{item.code}</Text>
                                <Text>{item.description}</Text>
                                <Text>Max Points: {item.max_points}</Text>
                            </View>
                            ))}
                </View>
                ))}
                <Pressable
                    onPress={handleSubmit}
                    disabled={submitting}
                    style={{
                        marginTop: 24,
                        paddingVertical: 14,
                        paddingHorizontal: 16,
                        backgroundColor: submitting ? "#999" : "#2f7d32",
                        borderRadius: 8,
                        alignItems: "center",
                    }}
                    >
                    <Text style={{ color: "white", fontWeight: "700" }}>
                        {submitting ? "Submitting..." : "Submit Evaluation"}
                    </Text>
                </Pressable>
            </ScrollView>    
        </SafeAreaView>
    )
}