import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import { colors } from "../../constants/colors";
import { theme } from "../../constants/theme";
import { getAvailability } from "../../services/api";
import { AvailabilitySlot } from "../../types/availability";

export default function DateTimeScreen() {
  const { serviceId } = useLocalSearchParams<{
    serviceId: string;
  }>();

  const [selectedDate, setSelectedDate] =
    useState<Date>(new Date());

  const [slots, setSlots] = useState<AvailabilitySlot[]>(
    []
  );

  const [selectedSlot, setSelectedSlot] =
    useState<string | null>(null);

  const [serviceName, setServiceName] =
    useState("");

  const [duration, setDuration] =
    useState<number>(0);

  const [loading, setLoading] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!serviceId) {
      return;
    }

    loadAvailability();
  }, [selectedDate, serviceId]);

  async function loadAvailability() {
    try {
      setLoading(true);
      setError(null);
      setSelectedSlot(null);

      const formattedDate =
        formatDateForApi(selectedDate);

      const data = await getAvailability(
        Number(serviceId),
        formattedDate
      );

      setSlots(data.slots);
      setServiceName(data.service_name);
      setDuration(data.duration_minutes);
    } catch (error) {
      console.error(error);

      setError(
        "We couldn't load available times. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleContinue() {
    if (!selectedSlot) {
      return;
    }

    router.push({
      pathname: "/booking/details",
      params: {
        serviceId,
        date: formatDateForApi(selectedDate),
        startTime: selectedSlot,
      },
    });
  }

  const dates = getNextDates(7);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>
              BOOKING
            </Text>

            <Text style={styles.title}>
              Choose your time
            </Text>
          </View>
        </View>

        {/* Selected service */}
        <View style={styles.serviceSummary}>
          <View style={styles.serviceSummaryIcon}>
            <Text>✦</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.serviceName}>
              {serviceName || "Selected service"}
            </Text>

            {duration > 0 && (
              <Text style={styles.serviceDuration}>
                {duration} minutes
              </Text>
            )}
          </View>
        </View>

        {/* Date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Select a date
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateList}
          >
            {dates.map((date) => {
              const selected =
                isSameDate(date, selectedDate);

              return (
                <Pressable
                  key={date.toISOString()}
                  onPress={() => setSelectedDate(date)}
                  style={[
                    styles.dateCard,
                    selected && styles.dateCardSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayName,
                      selected &&
                        styles.dateSelectedText,
                    ]}
                  >
                    {formatDay(date)}
                  </Text>

                  <Text
                    style={[
                      styles.dayNumber,
                      selected &&
                        styles.dateSelectedText,
                    ]}
                  >
                    {date.getDate()}
                  </Text>

                  <Text
                    style={[
                      styles.month,
                      selected &&
                        styles.dateSelectedText,
                    ]}
                  >
                    {formatMonth(date)}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Time */}
        <View style={styles.section}>
          <View style={styles.timeHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                Available times
              </Text>

              <Text style={styles.helperText}>
                Appointments start every 30 minutes
              </Text>
            </View>

            {loading && (
              <ActivityIndicator
                color={colors.primary}
              />
            )}
          </View>

          {error && (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>
                {error}
              </Text>

              <Pressable
                onPress={loadAvailability}
              >
                <Text style={styles.retry}>
                  Try again
                </Text>
              </Pressable>
            </View>
          )}

          {!loading && !error && (
            <View style={styles.slotGrid}>
              {slots.map((slot) => {
                const selected =
                  selectedSlot === slot.start_time;

                return (
                  <Pressable
                    key={slot.start_time}
                    disabled={!slot.available}
                    onPress={() =>
                      setSelectedSlot(
                        slot.start_time
                      )
                    }
                    style={[
                      styles.slot,
                      !slot.available &&
                        styles.slotUnavailable,
                      selected &&
                        styles.slotSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.slotTime,
                        !slot.available &&
                          styles.unavailableText,
                        selected &&
                          styles.selectedText,
                      ]}
                    >
                      {formatTime(slot.start_time)}
                    </Text>

                    <Text
                      style={[
                        styles.slotStatus,
                        !slot.available &&
                          styles.unavailableText,
                        selected &&
                          styles.selectedText,
                      ]}
                    >
                      {!slot.available
                        ? "Booked"
                        : selected
                          ? "Selected"
                          : "Available"}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>
            Your appointment
          </Text>

          <Text style={styles.bottomValue}>
            {selectedSlot
              ? formatTime(selectedSlot)
              : "Choose a time"}
          </Text>
        </View>

        <Pressable
          disabled={!selectedSlot}
          onPress={handleContinue}
          style={[
            styles.continueButton,
            !selectedSlot &&
              styles.continueDisabled,
          ]}
        >
          <Text style={styles.continueText}>
            Continue
          </Text>

          <Text style={styles.continueArrow}>
            →
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

/* ---------------- Helpers ---------------- */

function formatDateForApi(date: Date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDay(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
  });
}

function formatMonth(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
  });
}

function formatTime(time: string) {
  const [hourString, minute] =
    time.split(":");

  let hour = Number(hourString);

  const period = hour >= 12 ? "PM" : "AM";

  hour = hour % 12 || 12;

  return `${hour}:${minute} ${period}`;
}

function getNextDates(count: number) {
  const dates: Date[] = [];

  const today = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(today);

    date.setDate(today.getDate() + i);

    dates.push(date);
  }

  return dates;
}

function isSameDate(
  first: Date,
  second: Date
) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: theme.spacing.lg,
    paddingBottom: 140,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingTop: 8,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },

  backText: {
    fontSize: 34,
    lineHeight: 36,
    color: colors.text,
  },

  headerText: {
    marginLeft: 14,
  },

  eyebrow: {
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "800",
    color: colors.primary,
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
    color: colors.text,
    marginTop: 3,
  },

  serviceSummary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
  },

  serviceSummaryIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  serviceName: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
    marginLeft: 14,
  },

  serviceDuration: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 14,
    marginTop: 3,
  },

  section: {
    marginTop: 30,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },

  dateList: {
    gap: 10,
    paddingTop: 14,
  },

  dateCard: {
    width: 72,
    height: 92,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },

  dateCardSelected: {
    backgroundColor: colors.primary,
  },

  dayName: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "700",
  },

  dayNumber: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
    marginVertical: 2,
  },

  month: {
    fontSize: 11,
    color: colors.textMuted,
  },

  dateSelectedText: {
    color: colors.white,
  },

  timeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  helperText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 5,
  },

  slotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
  },

  slot: {
    width: "31%",
    minHeight: 72,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },

  slotSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  slotUnavailable: {
    backgroundColor: "#EFEAE5",
    borderColor: "#E4DDD6",
    opacity: 0.7,
  },

  slotTime: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
  },

  slotStatus: {
    fontSize: 10,
    marginTop: 4,
    color: colors.success,
    fontWeight: "700",
  },

  unavailableText: {
    color: colors.textMuted,
  },

  selectedText: {
    color: colors.white,
  },

  errorCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 20,
    marginTop: 16,
    alignItems: "center",
  },

  errorText: {
    color: colors.textSecondary,
    textAlign: "center",
  },

  retry: {
    color: colors.primary,
    fontWeight: "800",
    marginTop: 10,
  },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: colors.surface,

    borderTopWidth: 1,
    borderTopColor: colors.border,

    paddingHorizontal: 20,
    paddingVertical: 16,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  bottomLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "700",
  },

  bottomValue: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
    marginTop: 3,
  },

  continueButton: {
    height: 52,
    paddingHorizontal: 20,
    borderRadius: 18,
    backgroundColor: colors.text,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  continueDisabled: {
    opacity: 0.35,
  },

  continueText: {
    color: colors.white,
    fontWeight: "800",
  },

  continueArrow: {
    color: colors.white,
    fontSize: 18,
  },
});