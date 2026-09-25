import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { router } from "expo-router";

import { colors } from "../constants/colors";
import { theme } from "../constants/theme";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>WELCOME TO</Text>

          <Text style={styles.logo}>Aura</Text>
        </View>

        <Pressable style={styles.iconButton}>
          <Text style={styles.icon}>♡</Text>
        </Pressable>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Look good.</Text>

        <Text style={styles.heroTitle}>Feel confident.</Text>

        <Text style={styles.heroSubtitle}>
          Premium beauty & grooming experiences made for you.
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => router.push("/services")}
      >
        <Text style={styles.buttonText}>Book an appointment</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.appointmentsLink,
          pressed && styles.linkPressed,
        ]}
        onPress={() => router.push("/appointments")}
      >
        <Text style={styles.appointmentsLinkText}>View my appointments →</Text>
      </Pressable>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our services</Text>

        <ServicePreview
          title="Classic Haircut"
          duration="30 min"
          price="₹300"
        />

        <ServicePreview
          title="Haircut + Beard"
          duration="45 min"
          price="₹500"
        />

        <ServicePreview title="Hair Spa" duration="60 min" price="₹800" />
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Visit us</Text>

        <Text style={styles.infoText}>📍 Main Road, Your City</Text>

        <Text style={styles.infoText}>🕐 Open daily · 10 AM – 8 PM</Text>

        <Text style={styles.infoText}>📞 +91 98765 43210</Text>
      </View>

      {/* Staff access */}
      <Pressable
        style={({ pressed }) => [
          styles.staffLogin,
          pressed && styles.staffLoginPressed,
        ]}
        onPress={() => router.push("/admin")}
      >
        <View style={styles.staffIconContainer}>
          <Text style={styles.staffIcon}>♙</Text>
        </View>

        <View style={styles.staffLoginContent}>
          <Text style={styles.staffLoginTitle}>Staff login</Text>

          <Text style={styles.staffLoginSubtitle}>Salon owner & staff</Text>
        </View>

        <Text style={styles.staffArrow}>›</Text>
      </Pressable>

      <Text style={styles.footerText}>Aura Beauty & Grooming</Text>
    </ScrollView>
  );
}

function ServicePreview({
  title,
  duration,
  price,
}: {
  title: string;
  duration: string;
  price: string;
}) {
  return (
    <View style={styles.serviceCard}>
      <View style={styles.serviceIcon}>
        <Text>✦</Text>
      </View>

      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{title}</Text>

        <Text style={styles.serviceMeta}>{duration}</Text>
      </View>

      <Text style={styles.servicePrice}>{price}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: theme.spacing.lg,
    paddingBottom: 32,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  eyebrow: {
    fontSize: 11,
    letterSpacing: 2,
    color: colors.textMuted,
    fontWeight: "700",
  },

  logo: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.text,
  },

  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: 25,
    color: colors.text,
  },

  hero: {
    minHeight: 300,
    borderRadius: 28,
    backgroundColor: colors.primary,
    padding: 28,
    justifyContent: "flex-end",
    marginBottom: 20,
  },

  heroTitle: {
    color: colors.white,
    fontSize: 36,
    fontWeight: "800",
    lineHeight: 40,
  },

  heroSubtitle: {
    color: colors.white,
    opacity: 0.85,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 14,
  },

  button: {
    height: 56,
    borderRadius: 20,
    backgroundColor: colors.text,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonPressed: {
    opacity: 0.85,
  },

  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },

  appointmentsLink: {
    alignItems: "center",
    marginTop: 16,
    paddingVertical: 6,
  },

  linkPressed: {
    opacity: 0.6,
  },

  appointmentsLinkText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },

  section: {
    marginTop: 36,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 16,
  },

  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 10,
  },

  serviceIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  serviceInfo: {
    flex: 1,
    marginLeft: 14,
  },

  serviceName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },

  serviceMeta: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },

  servicePrice: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },

  infoCard: {
    marginTop: 36,
    backgroundColor: colors.text,
    borderRadius: 24,
    padding: 24,
  },

  infoTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 16,
  },

  infoText: {
    color: colors.white,
    opacity: 0.75,
    fontSize: 14,
    marginBottom: 10,
  },

  /*
   * Staff login
   *
   * Intentionally subtle so it doesn't compete
   * with the customer booking experience.
   */
  staffLogin: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 28,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },

  staffLoginPressed: {
    opacity: 0.6,
  },

  staffIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },

  staffIcon: {
    fontSize: 18,
    color: colors.textSecondary,
  },

  staffLoginContent: {
    flex: 1,
    marginLeft: 12,
  },

  staffLoginTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textSecondary,
  },

  staffLoginSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },

  staffArrow: {
    fontSize: 24,
    color: colors.textMuted,
    marginRight: 4,
  },

  footerText: {
    textAlign: "center",
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 20,
  },
});
