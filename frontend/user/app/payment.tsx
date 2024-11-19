import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import NoCard from "@/components/sport_complex/noCard";
import SpCard from "@/components/sport_complex/spCard"; // เปลี่ยนชื่อเป็น spCard

export default function PaymentPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment</Text>
      <Text style={styles.subtitle}>MFU Sport-Complex</Text>

      <ScrollView contentContainerStyle={styles.cardContainer}>
        <NoCard
          title="Payment"
          description="Payment for services"
          imageUrl="https://media.istockphoto.com/id/1397445982/th/%E0%B9%80%E0%B8%A7%E0%B8%84%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C/3d-%E0%B8%88%E0%B9%88%E0%B8%B2%E0%B8%A2%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B8%94%E0%B9%89%E0%B8%A7%E0%B8%A2%E0%B9%81%E0%B8%99%E0%B8%A7%E0%B8%84%E0%B8%B4%E0%B8%94%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%8A%E0%B9%8D%E0%B8%B2%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B8%AD%E0%B8%AD%E0%B8%99%E0%B9%84%E0%B8%A5%E0%B8%99%E0%B9%8C%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%98%E0%B8%99%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%A3%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%96%E0%B8%B7%E0%B8%AD-%E0%B8%97%E0%B9%8D%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%8A%E0%B9%8D%E0%B8%B2%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%B4%E0%B8%A5%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%87%E0%B9%88%E0%B8%B2%E0%B8%A2%E0%B8%9A%E0%B8%99%E0%B8%AA%E0%B8%A1%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%97.jpg?s=612x612&w=0&k=20&c=mSfstzfD6yGcl2a0Uegfg3eO6BMqQECCXUALbvp-hKo="
          route="/pPayment"
        />
        <SpCard
          title="Payment-Special"
          description="Payment for services"
          imageUrl="https://media.istockphoto.com/id/1397445982/th/%E0%B9%80%E0%B8%A7%E0%B8%84%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C/3d-%E0%B8%88%E0%B9%88%E0%B8%B2%E0%B8%A2%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B8%94%E0%B9%89%E0%B8%A7%E0%B8%A2%E0%B9%81%E0%B8%99%E0%B8%A7%E0%B8%84%E0%B8%B4%E0%B8%94%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%8A%E0%B9%8D%E0%B8%B2%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B8%AD%E0%B8%AD%E0%B8%99%E0%B9%84%E0%B8%A5%E0%B8%99%E0%B9%8C%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%98%E0%B8%99%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%A3%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%96%E0%B8%B7%E0%B8%AD-%E0%B8%97%E0%B9%8D%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%8A%E0%B9%8D%E0%B8%B2%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%B4%E0%B8%A5%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%87%E0%B9%88%E0%B8%B2%E0%B8%A2%E0%B8%9A%E0%B8%99%E0%B8%AA%E0%B8%A1%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%97.jpg?s=612x612&w=0&k=20&c=mSfstzfD6yGcl2a0Uegfg3eO6BMqQECCXUALbvp-hKo="
          route="/pPayment"
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
