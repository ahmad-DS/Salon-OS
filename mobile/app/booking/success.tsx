import { StyleSheet, Text, View, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import Button from "../../components/ui/Button";
import { colors } from "../../constants/colors";
import { theme } from "../../constants/theme";

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

export default function SuccessScreen() {
  const params = useLocalSearchParams<{
    appointmentId: string;
    serviceName: string;
    date: string;
    startTime: string;
    duration?: string;
    phone?: string;
  }>();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.successCircle}>
          <Text style={styles.checkmark}>✓</Text>
        </View>

        <Text style={styles.eyebrow}>APPOINTMENT CONFIRMED</Text>

        <Text style={styles.title}>You're all booked.</Text>

        <Text style={styles.subtitle}>
          We look forward to seeing you. Your appointment has been successfully
          created.
        </Text>

        {/* Appointment Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>YOUR APPOINTMENT</Text>

            <Text style={styles.appointmentId}>
              #{params.appointmentId}
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.serviceName}>
            {params.serviceName || "Your selected service"}
          </Text>

          <Text style={styles.date}>
            {params.date ? formatDate(params.date) : ""}
          </Text>

          <Text style={styles.time}>
            {params.startTime ? formatTime(params.startTime) : ""}
            {params.duration ? `  •  ${params.duration} min` : ""}
          </Text>
        </View>

        <View style={styles.note}>
          <Text style={styles.noteIcon}>✦</Text>

          <Text style={styles.noteText}>
            Please arrive a few minutes before your appointment.
          </Text>
        </View>
      </View>

      <View style={styles.bottom}>
        <Button
          title="View my appointments"
          onPress={() =>
            router.replace({
              pathname: "/appointments",
              params: {
                phone: params.phone || "",
              },
            })
          }
        />

        <Pressable
          style={styles.homeButton}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.homeButtonText}>
            Back to home
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 80,
    paddingBottom: 28,
  },

  content: {
    flex: 1,
    alignItems: "center",
  },

  successCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#E8F2EC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },

  checkmark: {
    fontSize: 40,
    fontWeight: "700",
    color: colors.success,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    color: colors.success,
    marginBottom: 10,
  },

  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
  },

  subtitle: {
    marginTop: 12,
    maxWidth: 330,
    fontSize: 15,
    lineHeight: 23,
    color: colors.textSecondary,
    textAlign: "center",
  },

  card: {
    width: "100%",
    marginTop: 32,
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: theme.radius.xl,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 3,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: colors.textMuted,
  },

  appointmentId: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },

  serviceName: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },

  date: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "600",
    color: colors.textSecondary,
  },

  time: {
    marginTop: 4,
    fontSize: 15,
    color: colors.textSecondary,
  },

  note: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 22,
    paddingHorizontal: 8,
  },

  noteIcon: {
    fontSize: 15,
    color: colors.primary,
    marginRight: 8,
  },

  noteText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textMuted,
  },

  bottom: {
    marginTop: 20,
  },
  homeButton: {
  alignItems: "center",
  paddingVertical: 16,
},

homeButtonText: {
  fontSize: 14,
  fontWeight: "700",
  color: colors.textSecondary,
},
});