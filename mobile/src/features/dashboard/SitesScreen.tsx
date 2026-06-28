import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getSites, Site } from  "../../api/sites";
import { useAuth } from "../auth/AuthContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { RootStackParamList } from "../../navigation/types";
import { colors, radii, spacing, typography } from "../../theme/designSystem";
import {
  EmptyState,
  LoadingState,
  PillButton,
  SectionEyebrow,
  StatusBadge,
} from "../../theme/ui";

type SitesScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList, 
    "Sites"
>;

export function SitesScreen() {
    const { token, signOut } = useAuth();

    const [sites, setSites] = useState<Site[]>([]);
    const [loading, setLoading] = useState(true); 
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigation = useNavigation<SitesScreenNavigationProp>();

    async function loadSites(isRefreshing = false) {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            if (isRefreshing) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError(null);

            const result = await getSites(token);
            setSites(result);
        } catch (err) {
            setError("Failed to load sites.");
        } finally {
            if (isRefreshing) {
                setRefreshing(false);
            } else {
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        void loadSites();
    }, [token]);

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <LoadingState message="Loading your assigned sites..." />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
            <FlatList
                data={sites}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.content}
                refreshing={refreshing}
                onRefresh={() => void loadSites(true)}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListHeaderComponent={
                    <View style={styles.headerGroup}>
                        <View style={styles.heroCard}>
                            <View style={styles.heroTopRow}>
                                <StatusBadge label="Field dashboard" tone="dark" />
                                <PillButton title="Sign Out" variant="secondaryDark" onPress={signOut} />
                            </View>
                            <SectionEyebrow onDark>Treescapes</SectionEyebrow>
                            <Text style={styles.heroTitle}>Sites ready for inspection</Text>
                            <Text style={styles.heroSubtitle}>
                                Open a site to review its evaluation history or start a fresh assessment.
                            </Text>
                            <View style={styles.heroMetrics}>
                                <View style={styles.metricChip}>
                                    <Text style={styles.metricValue}>{sites.length}</Text>
                                    <Text style={styles.metricLabel}>
                                        {sites.length === 1 ? "Assigned Site" : "Assigned Sites"}
                                    </Text>
                                </View>
                                <View style={styles.metricChip}>
                                    <Text style={styles.metricValue}>{sites.filter((site) => site.code).length}</Text>
                                    <Text style={styles.metricLabel}>Tagged Codes</Text>
                                </View>
                            </View>
                        </View>

                        {error ? (
                            <View style={styles.errorBanner}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}
                    </View>
                }
                renderItem={({ item, index }) => (
                    <Pressable 
                     onPress={() => 
                        navigation.navigate("SiteDetail", {
                            siteId: item.id,
                            siteName: item.name,
                        })
                     }
                        style={({ pressed }) => [
                            styles.siteCard,
                            pressed && styles.siteCardPressed,
                        ]}
                    >
                        <View style={styles.cardTopRow}>
                            <StatusBadge label={item.code ?? "No code"} tone="info" />
                            <Text style={styles.siteIndex}>Site {index + 1}</Text>
                        </View>
                        <Text style={styles.siteName}>{item.name}</Text>
                        <Text style={styles.siteAddress}>
                            {item.address ?? "Address details have not been added yet."}
                        </Text>
                        <Text style={styles.openLink}>Open site</Text>
                    </Pressable>
                )}
                ListEmptyComponent={
                    <EmptyState
                        title={error ? "Unable to load sites" : "No sites assigned yet"}
                        message={
                            error
                                ? "Pull to refresh or try again after the backend is available."
                                : "Your assigned properties will appear here once they are ready."
                        }
                        action={
                            error ? (
                                <PillButton
                                    title="Try Again"
                                    variant="secondary"
                                    onPress={() => void loadSites()}
                                />
                            ) : undefined
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
    heroTopRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.lg,
        gap: spacing.sm,
    },
    heroTitle: {
        ...typography.heroTitle,
        color: colors.onDark,
        marginTop: spacing.sm,
    },
    heroSubtitle: {
        ...typography.body,
        color: colors.onDarkMuted,
        marginTop: spacing.sm,
    },
    heroMetrics: {
        flexDirection: "row",
        gap: spacing.sm,
        marginTop: spacing.lg,
    },
    metricChip: {
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
    separator: {
        height: spacing.md,
    },
    siteCard: {
        backgroundColor: colors.canvas,
        borderRadius: radii.lg,
        padding: spacing.xl,
        borderWidth: 1,
        borderColor: colors.hairline,
    },
    siteCardPressed: {
        opacity: 0.86,
    },
    cardTopRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: spacing.sm,
    },
    siteIndex: {
        ...typography.caption,
        color: colors.steel,
    },
    siteName: {
        ...typography.heading2,
        color: colors.ink,
        marginTop: spacing.md,
    },
    siteAddress: {
        ...typography.body,
        color: colors.slate,
        marginTop: spacing.sm,
    },
    openLink: {
        ...typography.bodySmStrong,
        color: colors.brandGreenDark,
        marginTop: spacing.lg,
    },
});
