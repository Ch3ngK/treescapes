import * as ImagePicker from "expo-image-picker"

import { useAuth } from "../auth/AuthContext";
import React, { useState, useEffect } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChecklistTemplate, getActiveChecklistTemplate } from "../../api/checklistTemplates";
import { createEvaluation, CreateEvaluationPayload } from "../../api/evaluations"

import { RootStackParamList } from "../../navigation/types"
import { colors, radii, spacing, typography } from "../../theme/designSystem";
import {
  EmptyState,
  FormInput,
  FormLabel,
  LoadingState,
  PillButton,
  SectionEyebrow,
  StatusBadge,
  SurfaceCard,
} from "../../theme/ui";

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
    const [responses, setResponses] = useState<Record<number, { score: string; remarks: string; image_url: string | null }>>({});
    const [evaluationDate, setEvaluationDate] = useState("");
    const [generalComments, setGeneralComments] = useState("");
    const [siteInChargeName, setSiteInChargeName] = useState("");
    const [horticulturistInChargeName, setHorticulturistInChargeName] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    const navigation = useNavigation<CreateEvaluationScreenNavigationProp>();

    useEffect(() => {
        async function loadTemplate() {
            
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setLoadError(null);

                const result = await getActiveChecklistTemplate(token);
                setTemplate(result);
            } catch (err) {
                setLoadError("Failed to load checklist template.");
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
                image_url: prev[itemId]?.image_url ?? null,
            },
        }));
    }

    function updateRemarks(itemId: number, value: string) {
        setResponses((prev) => ({
            ...prev,
            [itemId]: {
                score: prev[itemId]?.score ?? "",
                remarks: value,
                image_url: prev[itemId]?.image_url ?? null,
            },
        }));
    }

    function updateImage(itemId: number, value: string | null) {
        setResponses((prev) => ({
            ...prev,
            [itemId]: {
                score: prev[itemId]?.score ?? "",
                remarks: prev[itemId]?.remarks ?? "",
                image_url: value,
            }
        }))
    }
    
    async function pickImage(itemId: number) {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (!permissionResult.granted) {
            setFormError("Permission to access photos is required.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            quality: 0.8,
        });

        if (result.canceled) {
            return;
        }

        const selectedUri = result.assets[0]?.uri ?? null;
        updateImage(itemId, selectedUri);
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
                image_url: response.image_url,
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
            setFormError("Missing token or checklist template.");
            return;
        }

        if (!evaluationDate.trim()) {
            setFormError("Evaluation date is required.");
            return;
        }

        if (Object.keys(responses).length === 0) {
            setFormError("Please enter at least one checklist score.");
            return;
        }

        for (const [itemId, response] of Object.entries(responses)) {
            if (!response.score.trim()) {
                setFormError(`Score is required for checklist ${itemId}.`);
                return;
            }

            const numericScore = Number(response.score);

            // Catches if anything non-numerical is input into the checklist score
            if (Number.isNaN(numericScore)) {
                setFormError(`Score must be a number for checklist item ${itemId}.`);
                return;
            }

            const numericItemId = Number(itemId);

            const checklistItem = template.sections
                .flatMap((section) => section.items)
                .find((item) => item.id === numericItemId);

            if (!checklistItem) {
                setFormError(`Checklist item ${itemId} was not found in the template.`);
                return;
            }

            if (numericScore < 0) {
                setFormError(`Score cannot be negative for checklist item ${checklistItem.code}.`);
                return;
            }

            if (numericScore > checklistItem.max_points) {
                setFormError(
                `Score for ${checklistItem.code} cannot exceed ${checklistItem.max_points}.`
                );
                return;
            }
        }

        try {
            setSubmitting(true);
            setFormError(null);
            
            

            const payload = buildPayload();
            const savedEvaluation = await createEvaluation(token, payload);
            navigation.replace("EvaluationDetail", {
                evaluationId: savedEvaluation.id,
            });

            console.log("Created evaluation:", savedEvaluation.id);

        } catch (err) {
            setFormError("Failed to create evaluation.");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <LoadingState message="Loading checklist template..." />
            </SafeAreaView>
        );
    }

    if (loadError) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <EmptyState
                    title="Unable to load checklist"
                    message={loadError}
                />
            </SafeAreaView>
        );
    }

    if (!template) {
        return (
        <SafeAreaView style={styles.safeArea}>
            <EmptyState
                title="No checklist template found"
                message="Activate a checklist template before creating evaluations."
            />
        </SafeAreaView>
        );
    }

    const totalItems = template.sections.reduce((total, section) => total + section.items.length, 0);
    const completedItems = Object.values(responses).filter((response) => response.score.trim()).length;

    return (
        <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.heroCard}>
                    <StatusBadge label="Checklist workflow" tone="dark" />
                    <SectionEyebrow onDark>Treescapes</SectionEyebrow>
                    <Text style={styles.heroTitle}>Create a new evaluation</Text>
                    <Text style={styles.heroSubtitle}>Site: {siteName}</Text>
                    <Text style={styles.heroSubtitle}>Template: {template.name}</Text>

                    <View style={styles.heroMetrics}>
                        <View style={styles.metricCard}>
                            <Text style={styles.metricValue}>{completedItems}</Text>
                            <Text style={styles.metricLabel}>Items scored</Text>
                        </View>
                        <View style={styles.metricCard}>
                            <Text style={styles.metricValue}>{totalItems}</Text>
                            <Text style={styles.metricLabel}>Checklist items</Text>
                        </View>
                    </View>
                </View>

                {formError ? (
                    <View style={styles.errorBanner}>
                        <Text style={styles.errorText}>{formError}</Text>
                    </View>
                ) : null}

                <SurfaceCard style={styles.sectionCard}>
                    <SectionEyebrow>Evaluation details</SectionEyebrow>
                    <Text style={styles.sectionTitle}>Basic assessment information</Text>

                    <View style={styles.fieldGroup}>
                        <FormLabel>Evaluation Date</FormLabel>
                        <FormInput
                            value={evaluationDate}
                            onChangeText={setEvaluationDate}
                            placeholder="YYYY-MM-DD"
                        />
                    </View>

                    <View style={styles.fieldGroup}>
                        <FormLabel>Site In Charge Name</FormLabel>
                        <FormInput
                            value={siteInChargeName}
                            onChangeText={setSiteInChargeName}
                            placeholder="Enter site in charge name"
                        />
                    </View>

                    <View style={styles.fieldGroup}>
                        <FormLabel>Horticulturist In Charge Name</FormLabel>
                        <FormInput
                            value={horticulturistInChargeName}
                            onChangeText={setHorticulturistInChargeName}
                            placeholder="Enter horticulturist in charge name"
                        />
                    </View>

                    <View style={styles.fieldGroup}>
                        <FormLabel>General Comments</FormLabel>
                        <FormInput
                            value={generalComments}
                            onChangeText={setGeneralComments}
                            placeholder="Add a summary of the site condition, risks, or follow-up notes"
                            multiline
                        />
                    </View>
                </SurfaceCard>

                {template.sections.map((section) => {
                    const sectionCompleted = section.items.filter(
                        (item) => responses[item.id]?.score?.trim()
                    ).length;

                    return (
                        <SurfaceCard key={section.id} style={styles.sectionCard}>
                            <View style={styles.sectionHeaderRow}>
                                <StatusBadge label={section.code} tone="info" />
                                <Text style={styles.sectionMetric}>
                                    {sectionCompleted} / {section.items.length} scored
                                </Text>
                            </View>
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                            <Text style={styles.sectionSubtitle}>
                                Section max points: {section.max_points}
                            </Text>

                            {section.items.map((item) => (
                                <View key={item.id} style={styles.itemCard}>
                                    <View style={styles.itemHeader}>
                                        <View style={styles.itemHeaderText}>
                                            <Text style={styles.itemCode}>{item.code}</Text>
                                            <Text style={styles.itemDescription}>{item.description}</Text>
                                        </View>
                                        <StatusBadge label={`Max ${item.max_points}`} tone="success" />
                                    </View>

                                    <View style={styles.fieldGroup}>
                                        <FormLabel>Score</FormLabel>
                                        <FormInput
                                            value={responses[item.id]?.score ?? ""}
                                            onChangeText={(value) => updateScore(item.id, value )}
                                            keyboardType="numeric"
                                            placeholder={`0 - ${item.max_points}`}
                                        />
                                    </View>

                                    <View style={styles.fieldGroup}>
                                        <FormLabel>Remarks</FormLabel>
                                        <FormInput
                                            value={responses[item.id]?.remarks ?? ""}
                                            onChangeText={(value) => updateRemarks(item.id, value)}
                                            placeholder="Add observations, issues, or recommended follow-up"
                                            multiline
                                        />
                                    </View>

                                    <PillButton
                                        title={responses[item.id]?.image_url ? "Change Image" : "Attach Image"}
                                        variant="secondary"
                                        onPress={() => void pickImage(item.id)}
                                    />

                                    {responses[item.id]?.image_url ? (
                                        <Image
                                            source={{ uri: responses[item.id]!.image_url! }}
                                            style={styles.imagePreview}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <Text style={styles.imagePlaceholder}>No image attached</Text>
                                    )}
                                </View>
                            ))}
                        </SurfaceCard>
                    );
                })}

                <PillButton
                    title={submitting ? "Submitting..." : "Submit Evaluation"}
                    onPress={handleSubmit}
                    disabled={submitting}
                    style={styles.submitButton}
                />
            </ScrollView>    
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    content: {
        padding: spacing.lg,
        paddingBottom: spacing.section,
        gap: spacing.md,
    },
    heroCard: {
        backgroundColor: colors.brandTealDeep,
        borderRadius: radii.xl,
        padding: spacing.xl,
    },
    heroTitle: {
        ...typography.heroTitle,
        color: colors.onDark,
        marginTop: spacing.sm,
    },
    heroSubtitle: {
        ...typography.body,
        color: colors.onDarkMuted,
        marginTop: spacing.xs,
    },
    heroMetrics: {
        flexDirection: "row",
        gap: spacing.sm,
        marginTop: spacing.lg,
    },
    metricCard: {
        flex: 1,
        backgroundColor: colors.brandTealMid,
        borderRadius: radii.lg,
        padding: spacing.md,
    },
    metricValue: {
        ...typography.heading2,
        color: colors.onDark,
    },
    metricLabel: {
        ...typography.bodySm,
        color: colors.onDarkMuted,
        marginTop: spacing.xxs,
    },
    errorBanner: {
        backgroundColor: colors.dangerBg,
        borderRadius: radii.md,
        padding: spacing.md,
    },
    errorText: {
        ...typography.bodySm,
        color: colors.dangerText,
    },
    sectionCard: {
        gap: spacing.md,
    },
    sectionHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: spacing.sm,
    },
    sectionTitle: {
        ...typography.heading2,
        color: colors.ink,
    },
    sectionSubtitle: {
        ...typography.bodySm,
        color: colors.steel,
        marginTop: -spacing.xs,
    },
    sectionMetric: {
        ...typography.caption,
        color: colors.steel,
    },
    fieldGroup: {
        gap: spacing.xs,
    },
    itemCard: {
        backgroundColor: colors.surfaceSoft,
        borderRadius: radii.lg,
        padding: spacing.md,
        gap: spacing.md,
    },
    itemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: spacing.sm,
    },
    itemHeaderText: {
        flex: 1,
        gap: spacing.xs,
    },
    itemCode: {
        ...typography.caption,
        color: colors.brandGreenDark,
        textTransform: "uppercase",
        letterSpacing: 0.9,
    },
    itemDescription: {
        ...typography.bodyStrong,
        color: colors.ink,
    },
    imagePreview: {
        width: "100%",
        height: 200,
        borderRadius: radii.lg,
        backgroundColor: colors.canvas,
    },
    imagePlaceholder: {
        ...typography.bodySm,
        color: colors.steel,
    },
    submitButton: {
        marginTop: spacing.sm,
    },
});
