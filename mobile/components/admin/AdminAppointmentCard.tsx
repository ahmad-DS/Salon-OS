import { StyleSheet, Text, View, Pressable } from "react-native";
import { AdminAppointment } from "../../types/adminAppointment";
import { colors } from "../../constants/colors";
import { theme } from "../../constants/theme";

type Props = {
  appointment: AdminAppointment;
  onStatusChange: (
    appointmentId: number,
    status: "confirmed" | "cancelled" | "completed",
  ) => void;
  updating: boolean;
};

function formatTime(time: string) {
  const [hourString, minute] = time.split(":");

  const hour = Number(hourString);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minute} ${suffix}`;
}

function getStatusLabel(status: AdminAppointment["status"]) {
  switch (status) {
    case "pending":
      return "Pending";

    case "confirmed":
      return "Confirmed";

    case "cancelled":
      return "Cancelled";

    case "completed":
      return "Completed";
  }
}

function getAvailableActions(status: AdminAppointment["status"]) {
  if (status === "pending") {
    return [
      { label: "Confirm", status: "confirmed" as const },
      { label: "Cancel", status: "cancelled" as const },
    ];
  }

  if (status === "confirmed") {
    return [
      { label: "Complete", status: "completed" as const },
      { label: "Cancel", status: "cancelled" as const },
    ];
  }

  return [];
}

export default function AdminAppointmentCard({ appointment, onStatusChange, updating }: Props) {
  const actions = getAvailableActions(appointment.status);
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.time}>{formatTime(appointment.start_time)}</Text>

          <Text style={styles.duration}>
            {appointment.duration_minutes} min
          </Text>
        </View>

        <View style={styles.status}>
          <Text style={styles.statusText}>
            {getStatusLabel(appointment.status)}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.service}>{appointment.service_name}</Text>

      <Text style={styles.customer}>{appointment.customer_name}</Text>

      <Text style={styles.phone}>{appointment.phone}</Text>

      <View style={styles.bottomRow}>
        <Text style={styles.price}>₹{appointment.price}</Text>

        <Text style={styles.appointmentId}>#{appointment.id}</Text>
      </View>
      {actions.length > 0 && (
        <View style={styles.actions}>
          {actions.map((action) => (
            <Pressable
              key={action.status}
              disabled={updating}
              onPress={() => onStatusChange(appointment.id, action.status)}
              style={({ pressed }) => [
                styles.actionButton,
                pressed && styles.actionPressed,
                updating && styles.actionDisabled,
              ]}
            >
              <Text style={styles.actionText}>
                {updating ? "Updating..." : action.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,

    elevation: 2,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  time: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },

  duration: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textMuted,
  },

  status: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: theme.radius.pill,
    backgroundColor: "#F5EFE9",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: theme.spacing.md,
  },

  service: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },

  customer: {
    marginTop: 6,
    fontSize: 15,
    color: colors.textSecondary,
  },

  phone: {
    marginTop: 3,
    fontSize: 13,
    color: colors.textMuted,
  },

  bottomRow: {
    marginTop: theme.spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  price: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
  },

  appointmentId: {
    fontSize: 12,
    color: colors.textMuted,
  },
  actions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },

  actionButton: {
    flex: 1,
    height: 46,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  actionText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },

  actionPressed: {
    backgroundColor: colors.background,
  },

  actionDisabled: {
    opacity: 0.5,
  },
});
