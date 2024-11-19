import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import NormalCard from "@/components/sport_complex/Card";
import SpecialCard from "@/components/sport_complex/specialCard";

export default function LandingPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to</Text>
      <Text style={styles.subtitle}>Mfu Sport-Complex</Text>

      <ScrollView contentContainerStyle={styles.cardContainer}>
        <NormalCard
          title="Badminton & Football"
          description="Let's play together"
          imageUrl="https://via.placeholder.com/150"
          route="./normal/"
        />
        <SpecialCard
          title="Fitness & Swimming Pool"
          description="Everybody can join"
          imageUrl="https://via.placeholder.com/150"
          route="./special/"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
  },
  cardContainer: {
    alignItems: "center",
    width: "100%",
  },
});
