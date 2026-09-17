import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors } from "../constants/colors";
import { theme } from "../constants/theme";
import { Service } from "../types/service";

type Props = {
  service: Service;
  onPress: () => void;
};

export default function ServiceCard({
  service,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>✦</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>
          {service.name}
        </Text>

        {service.description && (
          <Text
            style={styles.description}
            numberOfLines={2}
          >
            {service.description}
          </Text>
        )}

        <View style={styles.meta}>
          <Text style={styles.duration}>
            {service.duration_minutes} min
          </Text>

          <View style={styles.dot} />

          <Text style={styles.price}>
            ₹{service.price}
          </Text>
        </View>
      </View>

      <View style={styles.arrow}>
        <Text style={styles.arrowText}>→</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: colors.surface,

    borderRadius: theme.radius.xl,

    padding: 18,

    marginBottom: 12,

    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 2,
  },

  pressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.9,
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,

    backgroundColor: colors.background,

    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: 20,
    color: colors.primary,
  },

  content: {
    flex: 1,
    marginLeft: 16,
  },

  name: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.text,
  },

  description: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
    marginTop: 4,
  },

  meta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 9,
  },

  duration: {
    fontSize: 13,
    color: colors.textSecondary,
  },

  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
    marginHorizontal: 8,
  },

  price: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.primary,
  },

  arrow: {
    width: 36,
    height: 36,
    borderRadius: 18,

    backgroundColor: colors.background,

    alignItems: "center",
    justifyContent: "center",
  },

  arrowText: {
    fontSize: 18,
    color: colors.text,
  },
});