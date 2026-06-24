import { useAuth } from "../auth/AuthContext";
import React, { useState, useEffect } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, Text, View } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { ChecklistTemplate, getActiveChecklistTemplate } from "../../api/checklistTemplates";

import { RootStackParamList } from "../../navigation/types"

type CreateEvaluationRouteProp = RouteProp<RootStackParamList, "CreateEvaluation">

type Props = {
    route: CreateEvaluationRouteProp;
};

export function CreateEvaluationScreen({ route }: Props) {
    const { siteId, siteName } = route.params;

    const { token } = useAuth();

    const [template, setTemplate] = useState<ChecklistTemplate | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                        <Text style={{ fontWeight: "700" }}>{item.code}</Text>
                        <Text>{item.description}</Text>
                        <Text>Max Points: {item.max_points}</Text>
                    </View>
                    ))}
            </View>
                ))}
            </ScrollView>    
        </SafeAreaView>
    )
}