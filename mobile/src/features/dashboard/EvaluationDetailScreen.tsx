import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import { RootStackParamList } from "../../navigation/types";
import { useAuth } from "../auth/AuthContext";
import { Evaluation, getEvaluationById } from "../../api/evaluations";
import { colors, radii, spacing, typography } from "../../theme/designSystem";
import { EmptyState, LoadingState, SectionEyebrow, StatusBadge, SurfaceCard } from "../../theme/ui";

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
            <SafeAreaView style={styles.safeArea}>
                <LoadingState message="Loading evaluation details..." />
            </SafeAreaView>
        );
    };

    if (error) {
        return(
            <SafeAreaView style={styles.safeArea}>
                <EmptyState
                    title="Unable to load evaluation"
                    message={error}
                />
            </SafeAreaView>
        );
    };

    if (!evaluation) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <EmptyState
                    title="Evaluation not found"
                    message="The selected evaluation could not be found."
                />
            </SafeAreaView>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.heroCard}>
                    <StatusBadge label={evaluation.status} tone="dark" />
                    <SectionEyebrow onDark>Evaluation overview</SectionEyebrow>
                    <Text style={styles.heroTitle}>Evaluation #{evaluation.id}</Text>
                    <Text style={styles.heroSubtitle}>{evaluation.evaluation_date}</Text>

                    <View style={styles.metricRow}>
                        <View style={styles.metricCard}>
                            <Text style={styles.metricValue}>{evaluation.percentage}%</Text>
                            <Text style={styles.metricLabel}>Overall Score</Text>
                        </View>
                        <View style={styles.metricCard}>
                            <Text style={styles.metricValue}>{evaluation.total_score}</Text>
                            <Text style={styles.metricLabel}>Total Points</Text>
                        </View>
                        <View style={styles.metricCard}>
                            <Text style={styles.metricValue}>{evaluation.responses.length}</Text>
                            <Text style={styles.metricLabel}>Responses</Text>
                        </View>
                    </View>
                </View>

                <SurfaceCard>
                    <Text style={styles.sectionTitle}>Assessment notes</Text>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Benchmark</Text>
                        <Text style={styles.detailValue}>{evaluation.benchmark_band ?? "Not assigned"}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Site in charge</Text>
                        <Text style={styles.detailValue}>{evaluation.site_in_charge_name ?? "Not provided"}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Horticulturist</Text>
                        <Text style={styles.detailValue}>
                            {evaluation.horticulturist_in_charge_name ?? "Not provided"}
                        </Text>
                    </View>
                    <View style={styles.commentBlock}>
                        <Text style={styles.detailLabel}>General comments</Text>
                        <Text style={styles.commentText}>
                            {evaluation.general_comments ?? "No general comments were added."}
                        </Text>
                    </View>
                </SurfaceCard>

                <View style={styles.responsesHeader}>
                    <SectionEyebrow>Checklist responses</SectionEyebrow>
                    <Text style={styles.responsesTitle}>Recorded observations</Text>
                </View>

                {evaluation.responses.length === 0 ? (
                    <EmptyState
                        title="No responses recorded"
                        message="This evaluation does not have any checklist responses yet."
                    />
                ) : (
                    evaluation.responses.map((item) => (
                        <SurfaceCard key={item.id} style={styles.responseCard}>
                            <View style={styles.responseTopRow}>
                                <StatusBadge label={item.checklist_item.code} tone="info" />
                                <Text style={styles.scoreValue}>
                                    {item.score} / {item.checklist_item.max_points}
                                </Text>
                            </View>
                            <Text style={styles.responseTitle}>{item.checklist_item.description}</Text>
                            <Text style={styles.responseRemarks}>
                                {item.remarks ?? "No remarks were added for this item."}
                            </Text>
                            {item.image_url ? (
                                <>
                                    <Image
                                        source={{ uri: item.image_url }}
                                        style={styles.responseImage}
                                        resizeMode="cover"
                                    />
                                    <Text style={styles.imageLabel}>Field image attached</Text>
                                </>
                            ) : (
                                <Text style={styles.imagePlaceholder}>No image attached</Text>
                            )}
                        </SurfaceCard>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
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
    metricRow: {
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
    sectionTitle: {
        ...typography.heading3,
        color: colors.ink,
        marginBottom: spacing.md,
    },
    detailRow: {
        marginBottom: spacing.md,
    },
    detailLabel: {
        ...typography.caption,
        color: colors.steel,
        textTransform: "uppercase",
        letterSpacing: 0.8,
    },
    detailValue: {
        ...typography.body,
        color: colors.ink,
        marginTop: spacing.xxs,
    },
    commentBlock: {
        marginTop: spacing.xs,
    },
    commentText: {
        ...typography.body,
        color: colors.slate,
        marginTop: spacing.xs,
    },
    responsesHeader: {
        marginTop: spacing.xs,
    },
    responsesTitle: {
        ...typography.heading2,
        color: colors.ink,
        marginTop: spacing.xs,
    },
    responseCard: {
        gap: spacing.sm,
    },
    responseTopRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: spacing.sm,
    },
    responseTitle: {
        ...typography.heading3,
        color: colors.ink,
    },
    scoreValue: {
        ...typography.bodySmStrong,
        color: colors.brandGreenDark,
    },
    responseRemarks: {
        ...typography.body,
        color: colors.slate,
    },
    responseImage: {
        width: "100%",
        height: 200,
        borderRadius: radii.lg,
        backgroundColor: colors.surfaceSoft,
    },
    imageLabel: {
        ...typography.bodySmStrong,
        color: colors.ink,
    },
    imagePlaceholder: {
        ...typography.bodySm,
        color: colors.steel,
    },
});
