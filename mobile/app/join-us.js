import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { api } from "../../src/api/client";
import Button from "../../src/components/Button";
import Input from "../../src/components/Input";
import {
  ErrorBanner,
  Screen,
  ScreenHeader,
  SuccessBanner,
} from "../../src/components/Screen";
import { colors, radius, spacing } from "../../src/theme";
import { translateApiError, translateInterestArea } from "../../src/utils/format";

const interestAreas = ["Education", "Workshop", "Technology", "Culture", "Volunteer"];

const initialForm = {
  full_name: "",
  email: "",
  phone: "",
  interest_area: "Education",
  message: "",
  portfolio_url: "",
};

export default function JoinUsScreen() {
  const { t } = useTranslation();
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit() {
    setError("");
    try {
      await api.submitJoinApplication(form);
      setSubmitted(true);
      setForm(initialForm);
    } catch (err) {
      setError(translateApiError(t, err));
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: t("joinUs.title") }} />
      <Screen>
        <ScreenHeader title={t("joinUs.title")} subtitle={t("joinUs.copy")} />
        {submitted ? (
          <SuccessBanner message={t("joinUs.success")} />
        ) : (
          <>
            <Input
              label={t("forms.fullName")}
              value={form.full_name}
              onChangeText={(value) => updateField("full_name", value)}
            />
            <Input
              label={t("auth.email")}
              value={form.email}
              onChangeText={(value) => updateField("email", value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input
              label={t("forms.phone")}
              value={form.phone}
              onChangeText={(value) => updateField("phone", value)}
              keyboardType="phone-pad"
            />
            <Text style={styles.label}>{t("forms.interestArea")}</Text>
            <View style={styles.chips}>
              {interestAreas.map((area) => {
                const active = form.interest_area === area;
                return (
                  <Pressable
                    key={area}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => updateField("interest_area", area)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {translateInterestArea(t, area)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Input
              label={t("forms.portfolioUrl")}
              value={form.portfolio_url}
              onChangeText={(value) => updateField("portfolio_url", value)}
              autoCapitalize="none"
            />
            <Input
              label={t("forms.aboutYou")}
              value={form.message}
              onChangeText={(value) => updateField("message", value)}
              multiline
            />
            <ErrorBanner message={error} />
            <Button label={t("joinUs.submit")} onPress={handleSubmit} />
          </>
        )}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: spacing.sm,
    color: colors.ink,
    fontWeight: "600",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  chipActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  chipText: {
    color: colors.ink,
    fontWeight: "600",
  },
  chipTextActive: {
    color: colors.accent,
  },
});
