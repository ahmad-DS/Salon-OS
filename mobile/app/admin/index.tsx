import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { router } from "expo-router";
import AdminDateSelector from "../../components/admin/AdminDateSelector";

import { formatDateForApi } from "../../utils/date";

import { colors } from "../../constants/colors";
import { theme } from "../../constants/theme";
import {
  getAdminAppointments,
  updateAdminAppointmentStatus,
} from "../../services/api";
import { AdminAppointment } from "../../types/adminAppointment";
import AdminAppointmentCard from "../../components/admin/AdminAppointmentCard";

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [updatingAppointmentId, setUpdatingAppointmentId] = useState<
    number | null
  >(null);

  const [selectedDate, setSelectedDate] = useState(new Date());

  // const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  function goToPreviousDay() {
    setSelectedDate((current) => {
      const next = new Date(current);
      next.setDate(next.getDate() - 1);
      return next;
    });
  }

  function goToNextDay() {
    setSelectedDate((current) => {
      const next = new Date(current);
      next.setDate(next.getDate() + 1);
      return next;
    });
  }

  function goToToday() {
    setSelectedDate(new Date());
  }

  const loadAppointments = useCallback(async () => {
    try {
      setError(null);

      const apiDate = formatDateForApi(selectedDate);

      const data = await getAdminAppointments(apiDate);

      setAppointments(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } 
  }, [selectedDate]);

  async function handleStatusChange(
    appointmentId: number,
    status: "confirmed" | "cancelled" | "completed",
  ) {
    try {
      setError(null);
      setUpdatingAppointmentId(appointmentId);

      await updateAdminAppointmentStatus(appointmentId, status);

      await loadAppointments();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update appointment",
      );
    } finally {
      setUpdatingAppointmentId(null);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  async function handleRefresh() {
    setRefreshing(true);

    await loadAppointments();

    setRefreshing(false);
  }

  const todayCount = appointments.length;

  const confirmedCount = appointments.filter(
    (appointment) => appointment.status === "confirmed",
  ).length;

  const pendingCount = appointments.filter(
    (appointment) => appointment.status === "pending",
  ).length;

  const completedCount = appointments.filter(
    (appointment) => appointment.status === "completed",
  ).length;

  // if (loading) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color={colors.primary} />

  //       <Text style={styles.loadingText}>Loading dashboard...</Text>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.content}>
          {/* Header */}

          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>SALON MANAGEMENT</Text>

              <Text style={styles.title}>Good morning 👋</Text>

              <Text style={styles.subtitle}>
                Here's what's happening today.
              </Text>
            </View>
          </View>

          <AdminDateSelector
            date={selectedDate}
            onPrevious={goToPreviousDay}
            onNext={goToNextDay}
            onToday={goToToday}
          />

          {/* Error */}

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Summary */}

          <View style={styles.statsGrid}>
            <StatCard label="Appointments" value={todayCount} />

            <StatCard label="Confirmed" value={confirmedCount} />

            <StatCard label="Pending" value={pendingCount} />

            <StatCard label="Completed" value={completedCount} />
          </View>

          {/* Appointments */}

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Today's appointments</Text>

              <Text style={styles.sectionSubtitle}>
                {todayCount} appointment
                {todayCount !== 1 ? "s" : ""}
              </Text>
            </View>
          </View>

          {appointments.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>✦</Text>

              <Text style={styles.emptyTitle}>No appointments today</Text>

              <Text style={styles.emptyText}>
                Your schedule is clear for today.
              </Text>
            </View>
          ) : (
            appointments.map((appointment) => (
              <AdminAppointmentCard
                key={appointment.id}
                appointment={appointment}
                onStatusChange={handleStatusChange}
                updating={updatingAppointmentId === appointment.id}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

type StatCardProps = {
  label: string;
  value: number;
};

function StatCard({ label, value }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>

      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 60,
    paddingBottom: 40,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: theme.spacing.md,
    color: colors.textSecondary,
    fontSize: 14,
  },

  header: {
    marginBottom: theme.spacing.xl,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: colors.primary,
    marginBottom: 8,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.text,
  },

  subtitle: {
    marginTop: 7,
    fontSize: 15,
    color: colors.textSecondary,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },

  statCard: {
    width: "47%",
    backgroundColor: colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,

    elevation: 2,
  },

  statValue: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
  },

  statLabel: {
    marginTop: 5,
    fontSize: 13,
    color: colors.textSecondary,
  },

  sectionHeader: {
    marginBottom: theme.spacing.md,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: colors.text,
  },

  sectionSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textMuted,
  },

  errorBox: {
    backgroundColor: "#FCECEC",
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },

  errorText: {
    color: colors.danger,
    fontSize: 14,
  },

  emptyState: {
    backgroundColor: colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 30,
    color: colors.primary,
  },

  emptyTitle: {
    marginTop: theme.spacing.md,
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },

  emptyText: {
    marginTop: 6,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
