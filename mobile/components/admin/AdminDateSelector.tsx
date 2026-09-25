import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../constants/colors";
import { theme } from "../../constants/theme";
import {
  formatDisplayDate,
  isToday,
} from "../../utils/date";

type Props = {
  date: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
};

export default function AdminDateSelector({
  date,
  onPrevious,
  onNext,
  onToday,
}: Props) {
  const today = isToday(date);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPrevious}
        style={styles.arrowButton}
      >
        <Text style={styles.arrow}>‹</Text>
      </Pressable>

      <Pressable
        onPress={onToday}
        style={styles.dateContainer}
      >
        <Text style={styles.date}>
          {formatDisplayDate(date)}
        </Text>

        {!today && (
          <Text style={styles.todayText}>
            Tap to return to today
          </Text>
        )}
      </Pressable>

      <Pressable
        onPress={onNext}
        style={styles.arrowButton}
      >
        <Text style={styles.arrow}>›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: theme.radius.lg,
    padding: 8,
    marginBottom: theme.spacing.xl,
  },

  arrowButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },

  arrow: {
    fontSize: 30,
    lineHeight: 32,
    color: colors.text,
  },

  dateContainer: {
    flex: 1,
    alignItems: "center",
  },

  date: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },

  todayText: {
    marginTop: 3,
    fontSize: 11,
    color: colors.primary,
  },
});