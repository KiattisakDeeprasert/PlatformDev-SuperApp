import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import apiClient from "@/utils/api/sport_complex/sportApi/apiClient";
import { SpecialField } from "@/utils/api/sport_complex/interface/specialfield";

export default function SpecialPage() {
  const [specialfields, setSpecialfields] = useState<SpecialField[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const ipAddress = "http://192.168.129.73"; // Ensure this IP is correctly configured for your environment

  const fetchSpecialfields = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get("/special-field");
      console.log("Response data:", response.data);

      if (response.data?.data) {
        const updatedSpecialfields = response.data.data.map((specialfield: SpecialField) => ({
          ...specialfield,
          specialfieldImage: specialfield.specialfieldImage
            ? specialfield.specialfieldImage.replace("http://127.0.0.1", ipAddress)
            : "", // Replace localhost with actual IP
        }));
        setSpecialfields(updatedSpecialfields);
      } else {
        setError("Unexpected data structure received from API.");
      }
    } catch (error) {
      console.error("Error fetching special fields:", error);
      setError("Unable to fetch special fields. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialfields();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BD1616" />
        <Text style={styles.loadingText}>Loading special fields...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Special Fields</Text>

      <FlatList
        data={specialfields}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()} // Ensure unique keys
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/specialtable`)}>
            <View style={styles.card}>
              {item.specialfieldImage ? (
                <Image
                  source={{ uri: item.specialfieldImage }}
                  style={styles.cardImage}
                />
              ) : (
                <Text style={styles.noImageText}>No Image Available</Text>
              )}
              <Text style={styles.cardTitle}>{item.name.en || "No name available"}</Text>
              {item.name.th && <Text style={styles.cardSubtitle}>{item.name.th}</Text>}
              <Text style={styles.cardPrice}>Price: ${item.price.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    padding: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  cardImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    resizeMode: "cover",
  },
  noImageText: {
    textAlign: "center",
    color: "#888",
    fontStyle: "italic",
    marginTop: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
    color: "#333",
  },
  cardSubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
    color: "#777",
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    color: "#BD1616",
  },
  listContent: {
    paddingBottom: 20,
  },
});
