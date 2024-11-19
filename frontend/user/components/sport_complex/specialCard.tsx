import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

interface specialCardProps {
  title: string;
  description: string;
  imageUrl: string;
  route: string; // Route to navigate
}

export default function SpecialCard({ title, description, imageUrl }: specialCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.push("/special")} style={styles.card}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 300,
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 5,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
  },
  textContainer: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
});
