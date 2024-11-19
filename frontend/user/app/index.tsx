import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import NormalCard from "@/components/sport_complex/Card";
import SpecialCard from "@/components/sport_complex/specialCard";
import ProfileCard from "@/components/sport_complex/profileCard";
import PaymentCard from "@/components/sport_complex/paymentCard";

export default function LandingPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to</Text>
      <Text style={styles.subtitle}>MFU Sport-Complex</Text>

      <ScrollView contentContainerStyle={styles.cardContainer}>
        <NormalCard
          title="Badminton & Football"
          description="Let's play together"
          imageUrl="https://plus.unsplash.com/premium_photo-1685366454253-cb705836c5a8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          route="./normal/"
        />
        <SpecialCard
          title="Fitness & Swimming Pool"
          description="Everybody can join"
          imageUrl="https://media.istockphoto.com/id/1679800838/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%A3%E0%B8%B0%E0%B8%A2%E0%B8%B0%E0%B9%83%E0%B8%81%E0%B8%A5%E0%B9%89%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%97%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B8%A7%E0%B8%B4%E0%B9%88%E0%B8%87%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B8%81%E0%B8%B5%E0%B8%AC%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B9%88%E0%B8%87%E0%B8%9A%E0%B8%99%E0%B8%A5%E0%B8%B9%E0%B9%88%E0%B8%A7%E0%B8%B4%E0%B9%88%E0%B8%87%E0%B9%83%E0%B8%99%E0%B8%9F%E0%B8%B4%E0%B8%95%E0%B9%80%E0%B8%99%E0%B8%AA%E0%B8%84%E0%B8%A5%E0%B8%B1%E0%B8%9A-%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%AD%E0%B8%AD%E0%B8%81%E0%B8%81%E0%B9%8D%E0%B8%B2%E0%B8%A5%E0%B8%B1%E0%B8%87%E0%B8%81%E0%B8%B2%E0%B8%A2%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B8%84%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%94%E0%B8%B4%E0%B9%82%E0%B8%AD-%E0%B8%A7%E0%B8%B4%E0%B8%96%E0%B8%B5.jpg?s=612x612&w=0&k=20&c=ZoxCgluwbmXhHZfXJSpX7OlwqDdU4lEMzYQ4qZ7ZhLw="
          route="./special/"
        />
        <PaymentCard
          title="Payment"
          description="Pay field reservation fees"
          imageUrl="https://media.istockphoto.com/id/1397445982/th/%E0%B9%80%E0%B8%A7%E0%B8%84%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C/3d-%E0%B8%88%E0%B9%88%E0%B8%B2%E0%B8%A2%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B8%94%E0%B9%89%E0%B8%A7%E0%B8%A2%E0%B9%81%E0%B8%99%E0%B8%A7%E0%B8%84%E0%B8%B4%E0%B8%94%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%8A%E0%B9%8D%E0%B8%B2%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B8%AD%E0%B8%AD%E0%B8%99%E0%B9%84%E0%B8%A5%E0%B8%99%E0%B9%8C%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%98%E0%B8%99%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%A3%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%96%E0%B8%B7%E0%B8%AD-%E0%B8%97%E0%B9%8D%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%8A%E0%B9%8D%E0%B8%B2%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%B4%E0%B8%A5%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%87%E0%B9%88%E0%B8%B2%E0%B8%A2%E0%B8%9A%E0%B8%99%E0%B8%AA%E0%B8%A1%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%97.jpg?s=612x612&w=0&k=20&c=mSfstzfD6yGcl2a0Uegfg3eO6BMqQECCXUALbvp-hKo="
          route="./payment/"
        />
        <ProfileCard
          title="Profile"
          description="View your profile"
          imageUrl="https://media.istockphoto.com/id/1407452535/th/%E0%B9%80%E0%B8%A7%E0%B8%84%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C/%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B9%83%E0%B8%8A%E0%B9%89-3-%E0%B8%A1%E0%B8%B4%E0%B8%95%E0%B8%B4%E0%B8%AB%E0%B8%99%E0%B9%89%E0%B8%B2%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B8%9F%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%A1%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%AA%E0%B8%B9%E0%B9%88%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A.jpg?s=612x612&w=0&k=20&c=xh4e6ZIeCleRSMI27SwREtoSAVvIqlbAcadoKC10GPQ="
          route="./profile/"
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
