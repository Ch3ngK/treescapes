import React from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import {
  colors,
  getStatusTone,
  radii,
  shadows,
  spacing,
  StatusTone,
  typography,
} from "./designSystem";

type ButtonVariant = "primary" | "secondary" | "secondaryDark";

type PillButtonProps = PressableProps & {
  title: string;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function PillButton({
  title,
  variant = "primary",
  disabled,
  style,
  textStyle,
  ...props
}: PillButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.buttonBase,
        variant === "primary" && styles.buttonPrimary,
        variant === "secondary" && styles.buttonSecondary,
        variant === "secondaryDark" && styles.buttonSecondaryDark,
        pressed && !disabled && variant === "primary" && styles.buttonPrimaryPressed,
        pressed && !disabled && variant !== "primary" && styles.buttonSecondaryPressed,
        disabled && styles.buttonDisabled,
        style,
      ]}
      {...props}
    >
      <Text
        style={[
          styles.buttonText,
          variant === "primary" && styles.buttonTextPrimary,
          variant === "secondary" && styles.buttonTextSecondary,
          variant === "secondaryDark" && styles.buttonTextSecondaryDark,
          disabled && styles.buttonTextDisabled,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

export function SurfaceCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionEyebrow({
  children,
  onDark = false,
}: {
  children: React.ReactNode;
  onDark?: boolean;
}) {
  return <Text style={[styles.eyebrow, onDark && styles.eyebrowDark]}>{children}</Text>;
}

export function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone?: StatusTone;
}) {
  const resolvedTone = tone ?? getStatusTone(label);

  return (
    <View
      style={[
        styles.badge,
        resolvedTone === "success" && styles.badgeSuccess,
        resolvedTone === "warning" && styles.badgeWarning,
        resolvedTone === "info" && styles.badgeInfo,
        resolvedTone === "neutral" && styles.badgeNeutral,
        resolvedTone === "dark" && styles.badgeDark,
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          resolvedTone === "warning" && styles.badgeTextWarning,
          resolvedTone === "neutral" && styles.badgeTextNeutral,
          resolvedTone === "dark" && styles.badgeTextDark,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export function LoadingState({ message }: { message?: string }) {
  return (
    <View style={styles.stateContainer}>
      <ActivityIndicator color={colors.brandGreenDark} size="large" />
      {message ? <Text style={styles.stateText}>{message}</Text> : null}
    </View>
  );
}

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <SurfaceCard style={styles.emptyCard}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
      {action ? <View style={styles.emptyAction}>{action}</View> : null}
    </SurfaceCard>
  );
}

export function FormLabel({ children }: { children: React.ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}

export function FormInput({
  style,
  multiline,
  placeholderTextColor = colors.muted,
  ...props
}: TextInputProps) {
  return (
    <TextInput
      multiline={multiline}
      placeholderTextColor={placeholderTextColor}
      textAlignVertical={multiline ? "top" : props.textAlignVertical}
      style={[styles.input, multiline && styles.inputMultiline, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    minHeight: 44,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: radii.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  buttonPrimary: {
    backgroundColor: colors.brandGreen,
    borderColor: colors.brandGreen,
  },
  buttonPrimaryPressed: {
    backgroundColor: "#00cf59",
    borderColor: "#00cf59",
  },
  buttonSecondary: {
    backgroundColor: colors.canvas,
    borderColor: colors.hairlineStrong,
  },
  buttonSecondaryDark: {
    backgroundColor: "transparent",
    borderColor: colors.hairlineDark,
  },
  buttonSecondaryPressed: {
    opacity: 0.82,
  },
  buttonDisabled: {
    backgroundColor: colors.hairline,
    borderColor: colors.hairline,
  },
  buttonText: {
    ...typography.bodySmStrong,
  },
  buttonTextPrimary: {
    color: colors.ink,
  },
  buttonTextSecondary: {
    color: colors.ink,
  },
  buttonTextSecondaryDark: {
    color: colors.onDark,
  },
  buttonTextDisabled: {
    color: colors.muted,
  },
  card: {
    backgroundColor: colors.canvas,
    borderRadius: radii.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.hairline,
    ...shadows.card,
  },
  eyebrow: {
    ...typography.eyebrow,
    color: colors.brandGreenDark,
  },
  eyebrowDark: {
    color: colors.brandGreen,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  badgeSuccess: {
    backgroundColor: colors.brandGreenSoft,
  },
  badgeWarning: {
    backgroundColor: colors.warningBg,
  },
  badgeInfo: {
    backgroundColor: colors.surfaceSoft,
  },
  badgeNeutral: {
    backgroundColor: colors.dangerBg,
  },
  badgeDark: {
    backgroundColor: colors.brandTealMid,
  },
  badgeText: {
    ...typography.caption,
    color: colors.brandGreenDark,
  },
  badgeTextWarning: {
    color: colors.warningText,
  },
  badgeTextNeutral: {
    color: colors.dangerText,
  },
  badgeTextDark: {
    color: colors.onDark,
  },
  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    backgroundColor: colors.surface,
  },
  stateText: {
    ...typography.bodySm,
    color: colors.steel,
    marginTop: spacing.md,
    textAlign: "center",
  },
  emptyCard: {
    alignItems: "center",
    marginTop: spacing.md,
  },
  emptyTitle: {
    ...typography.heading3,
    color: colors.ink,
    textAlign: "center",
  },
  emptyMessage: {
    ...typography.bodySm,
    color: colors.steel,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  emptyAction: {
    marginTop: spacing.lg,
    alignSelf: "stretch",
  },
  label: {
    ...typography.bodySmStrong,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  input: {
    minHeight: 44,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.hairlineStrong,
    backgroundColor: colors.canvas,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.ink,
    ...typography.body,
  },
  inputMultiline: {
    minHeight: 112,
  },
});
