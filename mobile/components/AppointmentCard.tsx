import { StyleSheet, Text, View } from "react-native";

import { colors } from "../constants/colors";
import { theme } from "../constants/theme";
import { CustomerAppointment } from "../types/appointment";

type AppointmentCardProps = {
  appointment: CustomerAppointment;
};

function formatDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
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

function getStatusLabel(status: CustomerAppointment["status"]) {
  switch (status) {
    case "pending":
      return "Pending confirmation";

    case "confirmed":
      return "Confirmed";

    case "cancelled":
      return "Cancelled";

    case "completed":
      return "Completed";
  }
}

function getStatusStyle(status: CustomerAppointment["status"]) {
  switch (status) {
    case "confirmed":
      return styles.confirmed;

    case "completed":
      return styles.completed;

    case "cancelled":
      return styles.cancelled;

    default:
      return styles.pending;
  }
}

export default function AppointmentCard({
  appointment,
}: AppointmentCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.icon}>
          <Text style={styles.iconText}>✦</Text>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.serviceName}>
            {appointment.service_name}
          </Text>

          <Text style={styles.appointmentId}>
            Appointment #{appointment.id}
          </Text>
        </View>

        <View style={[styles.status, getStatusStyle(appointment.status)]}>
          <Text style={styles.statusText}>
            {getStatusLabel(appointment.status)}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>DATE</Text>

          <Text style={styles.infoValue}>
            {formatDate(appointment.appointment_date)}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>TIME</Text>

          <Text style={styles.infoValue}>
            {formatTime(appointment.start_time)}
          </Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.duration}>
          {appointment.duration_minutes} min
        </Text>

        <Text style={styles.price}>
          ₹{appointment.price.toLocaleString("en-IN")}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: theme.radius.xl,
    padding: 20,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 7,
    },

    elevation: 3,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "#F2E7DC",
    alignItems: "center",
    justifyContent: "center",
  },

  iconText: {
    fontSize: 18,
    color: colors.primary,
  },

  titleContainer: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },

  serviceName: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.text,
  },

  appointmentId: {
    marginTop: 4,
    fontSize: 11,
    color: colors.textMuted,
  },

  status: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
  },

  pending: {
    backgroundColor: "#FFF3DE",
  },

  confirmed: {
    backgroundColor: "#E8F2EC",
  },

  completed: {
    backgroundColor: "#EFECEA",
  },

  cancelled: {
    backgroundColor: "#FCEDEC",
  },

  statusText: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.textSecondary,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 18,
  },

  infoRow: {
    flexDirection: "row",
  },

  infoItem: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: colors.textMuted,
    marginBottom: 5,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
  },

  duration: {
    fontSize: 13,
    color: colors.textSecondary,
  },

  price: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.primary,
  },
});