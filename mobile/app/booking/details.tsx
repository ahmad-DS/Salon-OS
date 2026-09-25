import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

import Button from "../../components/ui/Button";
import { colors } from "../../constants/colors";
import { theme } from "../../constants/theme";
import { createAppointment } from "../../services/api";

function formatDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatTime(timeString: string) {
  const [hours, minutes] = timeString.split(":").map(Number);

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function DetailsScreen() {
  const params = useLocalSearchParams<{
    serviceId: string;
    date: string;
    startTime: string;
    serviceName?: string;
    duration?: string;
    price?: string;
  }>();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBooking() {
    setError(null);

    const trimmedName = name.trim();
    const cleanPhone = phone.replace(/\D/g, "");

    if (trimmedName.length < 2) {
      setError("Please enter your name.");
      return;
    }

    if (cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!params.serviceId || !params.date || !params.startTime) {
      setError("Booking information is missing. Please start again.");
      return;
    }

    try {
      setLoading(true);

      const appointment = await createAppointment({
        name: trimmedName,
        phone: cleanPhone,
        service_id: Number(params.serviceId),
        appointment_date: params.date,
        start_time: params.startTime,
      });

      router.replace({
        pathname: "/booking/success",
        params: {
          appointmentId: appointment.id.toString(),
          serviceName: params.serviceName || "Selected service",
          date: params.date,
          startTime: params.startTime,
          duration: params.duration || "",
          price: params.price || "",
          phone: cleanPhone,
        },
      });
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>ALMOST THERE</Text>

          <Text style={styles.title}>Your details</Text>

          <Text style={styles.subtitle}>
            Tell us who we're preparing this appointment for.
          </Text>
        </View>

        {/* Booking Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Text style={styles.iconText}>✦</Text>
          </View>

          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>YOUR APPOINTMENT</Text>

            <Text style={styles.serviceName}>
              {params.serviceName || "Selected service"}
            </Text>

            <Text style={styles.summaryDate}>
              {params.date ? formatDate(params.date) : "Selected date"}
            </Text>

            <Text style={styles.summaryTime}>
              {params.startTime
                ? formatTime(params.startTime)
                : "Selected time"}
              {params.duration
                ? `  •  ${params.duration} min`
                : ""}
            </Text>
          </View>
        </View>

        {/* Customer Form */}
        <View style={styles.form}>
          <Text style={styles.label}>YOUR NAME</Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            autoCapitalize="words"
            returnKeyType="next"
          />

          <Text style={[styles.label, styles.phoneLabel]}>
            PHONE NUMBER
          </Text>

          <View style={styles.phoneRow}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>

            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="10-digit mobile number"
              placeholderTextColor={colors.textMuted}
              style={styles.phoneInput}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          <Text style={styles.helperText}>
            We'll use your number to identify your appointment.
          </Text>
        </View>

        {/* Error */}
        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* CTA */}
        <View style={styles.bottomSection}>
          <Button
            title="Confirm appointment"
            onPress={handleBooking}
            loading={loading}
          />

          <Text style={styles.terms}>
            By confirming, you agree to our appointment terms.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 64,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 28,
  },

  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    color: colors.primary,
    marginBottom: 10,
  },

  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    color: colors.text,
  },

  subtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 23,
    color: colors.textSecondary,
  },

  summaryCard: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: theme.radius.xl,
    padding: 20,
    marginBottom: 32,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 3,
  },

  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#F2E7DC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  iconText: {
    fontSize: 20,
    color: colors.primary,
  },

  summaryContent: {
    flex: 1,
  },

  summaryLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: colors.textMuted,
    marginBottom: 6,
  },

  serviceName: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },

  summaryDate: {
    marginTop: 7,
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },

  summaryTime: {
    marginTop: 3,
    fontSize: 14,
    color: colors.textSecondary,
  },

  form: {
    marginBottom: 24,
  },

  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.4,
    color: colors.textSecondary,
    marginBottom: 9,
  },

  input: {
    height: 56,
    backgroundColor: colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
  },

  phoneLabel: {
    marginTop: 22,
  },

  phoneRow: {
    flexDirection: "row",
    height: 56,
  },

  countryCode: {
    width: 64,
    backgroundColor: "#F1ECE7",
    borderTopLeftRadius: theme.radius.md,
    borderBottomLeftRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },

  countryCodeText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },

  phoneInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopRightRadius: theme.radius.md,
    borderBottomRightRadius: theme.radius.md,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
  },

  helperText: {
    marginTop: 9,
    fontSize: 12,
    color: colors.textMuted,
  },

  errorCard: {
    backgroundColor: "#FCEDEC",
    borderRadius: theme.radius.md,
    padding: 14,
    marginBottom: 20,
  },

  errorText: {
    color: colors.danger,
    fontSize: 14,
    lineHeight: 20,
  },

  bottomSection: {
    marginTop: 8,
  },

  terms: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 11,
    color: colors.textMuted,
  },
});