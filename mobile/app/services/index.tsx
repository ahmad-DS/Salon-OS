import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useEffect, useState } from "react";
import { router } from "expo-router";

import ServiceCard from "../../components/ServiceCard";
import { colors } from "../../constants/colors";
import { theme } from "../../constants/theme";
import { getServices } from "../../services/api";
import { Service } from "../../types/service";

export default function ServicesScreen() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadServices() {
    try {
      setError(null);

      const data = await getServices();

      setServices(data);
    } catch (error) {
      console.error(error);

      setError(
        "We couldn't load our services. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  function handleRefresh() {
    setRefreshing(true);
    loadServices();
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>
            OUR MENU
          </Text>

          <Text style={styles.title}>
            Choose your experience
          </Text>

          <Text style={styles.subtitle}>
            Take a moment for yourself.
            Choose a service and we'll
            take care of the rest.
          </Text>
        </View>

        {/* Loading */}
        {loading && (
          <View style={styles.center}>
            <ActivityIndicator
              size="large"
              color={colors.primary}
            />

            <Text style={styles.loadingText}>
              Loading services...
            </Text>
          </View>
        )}

        {/* Error */}
        {!loading && error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorIcon}>
              !
            </Text>

            <Text style={styles.errorTitle}>
              Something went wrong
            </Text>

            <Text style={styles.errorText}>
              {error}
            </Text>
          </View>
        )}

        {/* Services */}
        {!loading &&
          !error &&
          services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onPress={() =>
                router.push({
                  pathname: "/booking/date-time",
                  params: {
                    serviceId: service.id,
                  },
                })
              }
            />
          ))}

        {/* Empty state */}
        {!loading &&
          !error &&
          services.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>
                No services available
              </Text>

              <Text style={styles.emptyText}>
                Please check back shortly.
              </Text>
            </View>
          )}
      </ScrollView>
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
    paddingBottom: 48,
  },

  header: {
    marginBottom: 28,
    paddingTop: 12,
  },

  eyebrow: {
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 8,
  },

  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800",
    color: colors.text,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    marginTop: 10,
    maxWidth: 340,
  },

  center: {
    paddingVertical: 80,
    alignItems: "center",
  },

  loadingText: {
    marginTop: 14,
    color: colors.textSecondary,
    fontSize: 14,
  },

  errorCard: {
    backgroundColor: colors.surface,
    borderRadius: theme.radius.xl,
    padding: 24,
    alignItems: "center",
  },

  errorIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F7E4E3",
    textAlign: "center",
    lineHeight: 44,
    fontSize: 20,
    fontWeight: "800",
    color: colors.danger,
  },

  errorTitle: {
    marginTop: 14,
    fontSize: 17,
    fontWeight: "800",
    color: colors.text,
  },

  errorText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: "center",
  },

  empty: {
    paddingVertical: 80,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },

  emptyText: {
    marginTop: 6,
    color: colors.textSecondary,
  },
});