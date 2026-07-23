import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "../theme";

export function Screen({ children, scroll = true, style }) {
  const content = scroll ? (
    <ScrollView contentContainerStyle={[styles.scroll, style]}>{children}</ScrollView>
  ) : (
    <View style={[styles.body, style]}>{children}</View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      {content}
    </SafeAreaView>
  );
}

export function ScreenHeader({ eyebrow, title, subtitle }) {
  return (
    <View style={styles.header}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function SectionTitle({ title, actionLabel, onAction }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel ? (
        <Text style={styles.sectionAction} onPress={onAction}>
          {actionLabel}
        </Text>
      ) : null}
    </View>
  );
}

export function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <View style={styles.errorBanner}>
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
}

export function SuccessBanner({ message }) {
  if (!message) return null;
  return (
    <View style={styles.successBanner}>
      <Text style={styles.successText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  body: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.ink,
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 38,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: "700",
  },
  sectionAction: {
    color: colors.accent,
    fontWeight: "600",
  },
  errorBanner: {
    backgroundColor: "rgba(155, 28, 28, 0.1)",
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.error,
  },
  successBanner: {
    backgroundColor: "rgba(31, 107, 69, 0.1)",
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  successText: {
    color: colors.success,
  },
});
