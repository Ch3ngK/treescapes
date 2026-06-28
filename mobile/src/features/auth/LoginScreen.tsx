import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Image,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { loginRequest } from "../../api/auth";
import { useAuth } from "./AuthContext";
import { colors, radii, spacing, typography } from "../../theme/designSystem";
import {
  FormInput,
  PillButton,
  SectionEyebrow,
  StatusBadge,
  SurfaceCard,
} from "../../theme/ui";

export function LoginScreen() {
    const { signIn } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleLogin() {
        try {
            setIsLoading(true); 
            setError(null);

            const result = await loginRequest( { email, password });
            signIn(result.access_token);
        } catch (err) {
            setError("Login failed. Check your email and password.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.keyboardWrapper}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.heroCard}>
                <StatusBadge label="Field operations" tone="dark" />
                <Image
                  source={require("../../../assets/treescapes_pte_ltd_logo.jpg")}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <SectionEyebrow onDark>Treescapes</SectionEyebrow>
                <Text style={styles.heroTitle}>Inspect sites with a clearer, faster workflow.</Text>
                <Text style={styles.heroSubtitle}>
                  Sign in to review your assigned sites, record evaluation scores, and attach field
                  evidence in one place.
                </Text>
              </View>

              <SurfaceCard style={styles.formCard}>
                <SectionEyebrow>Welcome back</SectionEyebrow>
                <Text style={styles.title}>Log in to your dashboard</Text>
                <Text style={styles.subtitle}>
                  Use your Treescapes account to continue your daily site checks.
                </Text>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Email</Text>
                  <FormInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="name@company.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoCorrect={false}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Password</Text>
                  <FormInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter password"
                    secureTextEntry
                  />
                </View>

                {error ? (
                  <View style={styles.errorBanner}>
                    <Text style={styles.error}>{error}</Text>
                  </View>
                ) : null}

                <PillButton
                  title={loading ? "Signing in..." : "Log In"}
                  onPress={handleLogin}
                  disabled={loading}
                />
              </SurfaceCard>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  keyboardWrapper: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: "center",
    gap: spacing.lg,
  },
  heroCard: {
    backgroundColor: colors.brandTealDeep,
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: radii.lg,
    backgroundColor: colors.canvas,
    marginTop: spacing.md,
  },
  heroTitle: {
    ...typography.heroTitle,
    color: colors.onDark,
    marginTop: spacing.xs,
  },
  heroSubtitle: {
    ...typography.body,
    color: colors.onDarkMuted,
  },
  formCard: {
    gap: spacing.md,
  },
  title: {
    ...typography.heading1,
    color: colors.ink,
  },
  subtitle: {
    ...typography.bodySm,
    color: colors.steel,
    marginTop: -spacing.xs,
  },
  fieldGroup: {
    gap: spacing.xs,
  },
  label: {
    ...typography.bodySmStrong,
    color: colors.ink,
  },
  errorBanner: {
    backgroundColor: colors.dangerBg,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  error: {
    ...typography.bodySm,
    color: colors.dangerText,
  },
});
