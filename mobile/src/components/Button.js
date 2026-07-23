import { Pressable, StyleSheet, Text } from "react-native";
import { colors, radius, spacing } from "../theme";

export default function Button({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  style,
}) {
  return (
    <Pressable
      style={[
        styles.base,
        variant === "secondary" ? styles.secondary : styles.primary,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.label,
          variant === "secondary" ? styles.secondaryLabel : styles.primaryLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
  },
  primary: {
    backgroundColor: colors.accent,
  },
  secondary: {
    backgroundColor: colors.soft,
    borderWidth: 1,
    borderColor: colors.line,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryLabel: {
    color: colors.white,
  },
  secondaryLabel: {
    color: colors.ink,
  },
});
