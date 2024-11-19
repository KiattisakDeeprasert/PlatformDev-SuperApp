import { Sport } from "@/utils/api/sport_complex/interface/sport";
import React from "react";

import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SportsCardProps {
  sport: Sport;
  onPress: (sport: Sport) => void;
}

export default function sportCard({ sport, onPress }: SportsCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(sport)}>
      <Image source={{ uri: sport.sportImage }} style={styles.bookImage} />
      <Text style={styles.bookName}>{sport.name.en}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 5,
    margin: 10,
    borderRadius: 15,
    height: 350,
    alignItems: "flex-start",
    overflow: "hidden",
  },
  bookImage: {
    width: "100%",
    height: "80%",
    resizeMode: "cover",
    borderRadius: 30,
  },
  bookName: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  bookStatus: { fontSize: 15, fontWeight: "bold" },
});