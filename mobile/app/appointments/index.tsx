import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { router,  useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";

import AppointmentCard from "../../components/AppointmentCard";
import Button from "../../components/ui/Button";
import { colors } from "../../constants/colors";
import { theme } from "../../constants/theme";
import { getCustomerAppointments } from "../../services/api";
import { CustomerAppointment } from "../../types/appointment";

function isUpcoming(appointment: CustomerAppointment) {
  if (appointment.status === "cancelled") {
    return false;
  }

  const appointmentDateTime = new Date(
    `${appointment.appointment_date}T${appointment.start_time}`
  );

  return appointmentDateTime >= new Date();
}

export default function AppointmentsScreen() {
  const params = useLocalSearchParams<{
    phone?: string;
  }>();
  const [phone, setPhone] = useState("");
  const [appointments, setAppointments] = useState<CustomerAppointment[]>([]);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadAppointments(phoneNumber = phone) {
    const cleanPhone = phoneNumber.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const data = await getCustomerAppointments(cleanPhone);

      setAppointments(data);
      setSearched(true);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to find your appointments."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function handleRefresh() {
    setRefreshing(true);
    loadAppointments();
  }

  const upcomingAppointments = appointments.filter(isUpcoming);

  const pastAppointments = appointments.filter(
    (appointment) => !isUpcoming(appointment)
  );
  useEffect(() => {
    if (params.phone) {
        setPhone(params.phone);
        loadAppointments(params.phone);
    }
  }, [params.phone]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          searched ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          ) : undefined
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <Text style={styles.eyebrow}>YOUR VISITS</Text>

          <Text style={styles.title}>My appointments</Text>

          <Text style={styles.subtitle}>
            Enter your phone number to see your upcoming and past visits.
          </Text>
        </View>

        {/* Phone Search */}
        {!searched && (
          <View style={styles.searchCard}>
            <Text style={styles.label}>PHONE NUMBER</Text>

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

            {error && (
              <Text style={styles.errorText}>
                {error}
              </Text>
            )}

            <View style={styles.searchButton}>
              <Button
                title="View my appointments"
                onPress={() => loadAppointments()}
                loading={loading}
              />
            </View>

            <Text style={styles.helperText}>
              We use your phone number to find your bookings.
            </Text>
          </View>
        )}

        {/* Search again */}
        {searched && (
          <View style={styles.phoneSummary}>
            <View>
              <Text style={styles.phoneSummaryLabel}>
                SHOWING APPOINTMENTS FOR
              </Text>

              <Text style={styles.phoneSummaryValue}>
                +91 {phone}
              </Text>
            </View>

            <Pressable
              onPress={() => {
                setSearched(false);
                setAppointments([]);
                setError(null);
              }}
            >
              <Text style={styles.changeText}>Change</Text>
            </Pressable>
          </View>
        )}

        {/* Loading */}
        {loading && (
          <View style={styles.loading}>
            <ActivityIndicator
              size="large"
              color={colors.primary}
            />

            <Text style={styles.loadingText}>
              Finding your appointments...
            </Text>
          </View>
        )}

        {/* Error after search */}
        {searched && !loading && error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>
              Something went wrong
            </Text>

            <Text style={styles.errorMessage}>
              {error}
            </Text>

            <Pressable onPress={() => loadAppointments()}>
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          </View>
        )}

        {/* Results */}
        {searched && !loading && !error && (
          <>
            {/* Upcoming */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  Upcoming
                </Text>

                <Text style={styles.count}>
                  {upcomingAppointments.length}
                </Text>
              </View>

              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))
              ) : (
                <View style={styles.emptyCard}>
                  <View style={styles.emptyIcon}>
                    <Text style={styles.emptyIconText}>✦</Text>
                  </View>

                  <Text style={styles.emptyTitle}>
                    Nothing booked yet
                  </Text>

                  <Text style={styles.emptyText}>
                    Ready for a little self-care? Book your next
                    appointment with us.
                  </Text>

                  <Pressable
                    style={styles.emptyButton}
                    onPress={() => router.push("/services")}
                  >
                    <Text style={styles.emptyButtonText}>
                      Book an appointment
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>

            {/* Past */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  Past visits
                </Text>

                <Text style={styles.count}>
                  {pastAppointments.length}
                </Text>
              </View>

              {pastAppointments.length > 0 ? (
                pastAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))
              ) : (
                <View style={styles.simpleEmpty}>
                  <Text style={styles.simpleEmptyText}>
                    Your appointment history will appear here.
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
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
    paddingTop: 54,
    paddingBottom: 48,
  },

  header: {
    marginBottom: 28,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },

  backText: {
    fontSize: 32,
    lineHeight: 34,
    color: colors.text,
    marginTop: -3,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    color: colors.primary,
    marginBottom: 9,
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

  searchCard: {
    backgroundColor: colors.surface,
    borderRadius: theme.radius.xl,
    padding: 20,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 7,
    },

    elevation: 3,
  },

  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.3,
    color: colors.textSecondary,
    marginBottom: 9,
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

  searchButton: {
    marginTop: 18,
  },

  helperText: {
    marginTop: 11,
    textAlign: "center",
    fontSize: 11,
    color: colors.textMuted,
  },

  errorText: {
    marginTop: 9,
    fontSize: 12,
    color: colors.danger,
  },

  phoneSummary: {
    backgroundColor: "#F1ECE7",
    borderRadius: theme.radius.md,
    padding: 15,
    marginBottom: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  phoneSummaryLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.1,
    color: colors.textMuted,
  },

  phoneSummaryValue: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },

  changeText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
  },

  loading: {
    alignItems: "center",
    paddingVertical: 48,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: colors.textSecondary,
  },

  errorCard: {
    backgroundColor: "#FCEDEC",
    borderRadius: theme.radius.lg,
    padding: 20,
    marginTop: 24,
  },

  errorTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },

  errorMessage: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
  },

  retryText: {
    marginTop: 14,
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
  },

  section: {
    marginTop: 8,
    marginBottom: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: colors.text,
  },

  count: {
    marginLeft: 8,
    minWidth: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: "#EDE5DE",
    textAlign: "center",
    lineHeight: 23,
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
  },

  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: theme.radius.xl,
    padding: 26,
    alignItems: "center",
  },

  emptyIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#F2E7DC",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyIconText: {
    fontSize: 20,
    color: colors.primary,
  },

  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },

  emptyText: {
    marginTop: 7,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    color: colors.textSecondary,
  },

  emptyButton: {
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: theme.radius.pill,
    backgroundColor: "#F1E5DA",
  },

  emptyButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },

  simpleEmpty: {
    backgroundColor: colors.surface,
    borderRadius: theme.radius.lg,
    padding: 20,
  },

  simpleEmptyText: {
    fontSize: 13,
    color: colors.textMuted,
  },
});