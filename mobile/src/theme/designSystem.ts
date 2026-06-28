import { DefaultTheme, Theme } from "@react-navigation/native";

export const colors = {
  brandGreen: "#00ed64",
  brandGreenDark: "#00684a",
  brandGreenSoft: "#c1f4d5",
  brandTealDeep: "#001e2b",
  brandTealMid: "#0f3b49",
  canvas: "#ffffff",
  surface: "#f5f7f7",
  surfaceSoft: "#eef3f1",
  surfaceFeature: "#f3fcf7",
  hairline: "#d7e0dd",
  hairlineStrong: "#aebdb8",
  hairlineDark: "#335260",
  ink: "#0f2a33",
  slate: "#35515a",
  steel: "#647a82",
  muted: "#8ca0a7",
  onDark: "#ffffff",
  onDarkMuted: "#b8c6cb",
  warningBg: "#fff7d6",
  warningText: "#7a5d00",
  dangerBg: "#fde7e6",
  dangerText: "#8f2722",
};

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  section: 40,
  hero: 48,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  eyebrow: {
    fontSize: 11,
    fontWeight: "700" as const,
    letterSpacing: 1.2,
    textTransform: "uppercase" as const,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: "600" as const,
    letterSpacing: -0.8,
    lineHeight: 42,
  },
  heading1: {
    fontSize: 28,
    fontWeight: "600" as const,
    letterSpacing: -0.4,
    lineHeight: 34,
  },
  heading2: {
    fontSize: 22,
    fontWeight: "600" as const,
    lineHeight: 28,
  },
  heading3: {
    fontSize: 18,
    fontWeight: "600" as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 24,
  },
  bodyStrong: {
    fontSize: 16,
    fontWeight: "500" as const,
    lineHeight: 24,
  },
  bodySm: {
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 20,
  },
  bodySmStrong: {
    fontSize: 14,
    fontWeight: "500" as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: "600" as const,
    lineHeight: 16,
  },
};

export const shadows = {
  card: {
    shadowColor: "#001e2b",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
};

export const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.brandGreen,
    background: colors.surface,
    card: colors.canvas,
    text: colors.ink,
    border: colors.hairline,
    notification: colors.brandGreenDark,
  },
};

export type StatusTone = "success" | "warning" | "info" | "neutral" | "dark";

export function getStatusTone(status: string | null | undefined): StatusTone {
  const normalized = status?.toLowerCase() ?? "";

  if (normalized.includes("complete") || normalized.includes("approved")) {
    return "success";
  }

  if (normalized.includes("draft") || normalized.includes("pending")) {
    return "warning";
  }

  if (normalized.includes("rejected") || normalized.includes("failed")) {
    return "neutral";
  }

  return "info";
}
