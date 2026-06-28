import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";


import { RootStackParamList } from "../../navigation/types";
import { useAuth } from "../auth/AuthContext";
import { Evaluation, getEvaluationsForSite } from "../../api/evaluations";
import { colors, radii, spacing, typography } from "../../theme/designSystem";
import {
  EmptyState,
  LoadingState,
  PillButton,
  SectionEyebrow,
  StatusBadge,
} from "../../theme/ui";

// For Route object: describes what screen this is, and what params were passed into it.
// route.params.siteId
// route.params.siteName
// "What came into this screen"
type SiteDetailScreenRouteProp = RouteProp<
  RootStackParamList, 
  "SiteDetail"
>;
type Props = {
    route: SiteDetailScreenRouteProp;
};

// For Navigation object: describes what navigation methods exist, what screens this screen can navigate to, and what params those destination screens require.
// route: incoming data, navigation: outgoing movement. 
type SiteDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SiteDetail"
>;

export function SiteDetailScreen({ route }: Props) {
  const { siteId, siteName } = route.params; // Takes the siteId and siteName out of route.params

  const { token } = useAuth();
  
  const navigation = useNavigation<SiteDetailScreenNavigationProp>();

  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  async function loadEvaluations() {
    if (!token) {
      setLoading(false); 
      return; 
    }

    try {
      setLoading(true);
      setError(null);

      const result = await getEvaluationsForSite(token, siteId);
      setEvaluations(result);
    } catch (err) {
      setError("Failed to load evaluations.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadEvaluations();
  }, [token, siteId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LoadingState message="Loading site evaluations..." />
      </SafeAreaView>
    );
  }

  const averageScore = evaluations.length
    ? Math.round(evaluations.reduce((total, item) => total + item.percentage, 0) / evaluations.length)
    : null;

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <FlatList
        data={evaluations}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <View style={styles.headerGroup}>
            <View style={styles.heroCard}>
              <StatusBadge label="Site overview" tone="dark" />
              <SectionEyebrow onDark>Treescapes</SectionEyebrow>
              <Text style={styles.heroTitle}>{siteName}</Text>
              <Text style={styles.heroSubtitle}>Site ID: {siteId}</Text>

              <View style={styles.metricsRow}>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{evaluations.length}</Text>
                  <Text style={styles.metricLabel}>Evaluations</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>
                    {averageScore !== null ? `${averageScore}%` : "--"}
                  </Text>
                  <Text style={styles.metricLabel}>Average Score</Text>
                </View>
              </View>
            </View>

            <PillButton
              title="Create Evaluation"
              onPress={() =>
                navigation.navigate("CreateEvaluation", {
                  siteId,
                  siteName,
                })
              }
            />

            {error ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
                <View style={styles.errorAction}>
                  <PillButton title="Try Again" variant="secondary" onPress={() => void loadEvaluations()} />
                </View>
              </View>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              navigation.navigate("EvaluationDetail", {
                evaluationId: item.id,
              })
            }
            style={({ pressed }) => [styles.evaluationCard, pressed && styles.evaluationCardPressed]}
          >
            <View style={styles.evaluationTopRow}>
              <Text style={styles.evaluationTitle}>Evaluation #{item.id}</Text>
              <StatusBadge label={item.status} />
            </View>
            <Text style={styles.evaluationMeta}>Date: {item.evaluation_date}</Text>
            <Text style={styles.evaluationMeta}>Total Score: {item.total_score}</Text>
            <Text style={styles.evaluationScore}>{item.percentage}% overall</Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <EmptyState
            title="No evaluations yet"
            message="Start the first site assessment to begin tracking scores and field notes."
            action={
              <PillButton
                title="Create Evaluation"
                onPress={() =>
                  navigation.navigate("CreateEvaluation", {
                    siteId,
                    siteName,
                  })
                }
              />
            }
          />
        }
      />
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
  },
  headerGroup: {
    marginBottom: spacing.lg,
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
  metricsRow: {
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
  errorAction: {
    marginTop: spacing.md,
  },
  separator: {
    height: spacing.md,
  },
  evaluationCard: {
    backgroundColor: colors.canvas,
    borderRadius: radii.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  evaluationCardPressed: {
    opacity: 0.88,
  },
  evaluationTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
  },
  evaluationTitle: {
    ...typography.heading3,
    color: colors.ink,
    flex: 1,
  },
  evaluationMeta: {
    ...typography.bodySm,
    color: colors.steel,
    marginTop: spacing.sm,
  },
  evaluationScore: {
    ...typography.heading2,
    color: colors.brandGreenDark,
    marginTop: spacing.lg,
  },
});
