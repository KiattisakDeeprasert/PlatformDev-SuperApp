import { Sport } from "@/utils/api/sport_complex/interface/sport";
import apiClient from "@/utils/api/sport_complex/sportApi/apiClient";
import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router"; // Import the router for expo-router

export default function NormalPage() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Added error state for better handling
  const router = useRouter(); // Use the router from expo-router

  const ipAddress = "http://192.168.129.73"; // Ensure this IP is correctly set for your environment

  // Fetch sports data
  const fetchSports = async () => {
    setLoading(true); // Start loading before making the request
    setError(null); // Reset previous errors
    try {
      const response = await apiClient.get("/sports");
      console.log("Response data:", response.data); // Log the response to see what you get

      // Check if the response has the expected structure
      if (response.data && response.data.data) {
        const updatedSports = response.data.data.map((sport: Sport) => ({
          ...sport,
          sportImage: sport.sportImage
            ? sport.sportImage.replace("http://127.0.0.1", `${ipAddress}`)
            : "", // Ensure there's an image URL
        }));
        setSports(updatedSports);
      } else {
        setError("Invalid data structure received.");
      }
    } catch (error) {
      console.error("Error fetching sports:", error);
      setError("Error fetching sports data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSports();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text style={{ color: "red" }}>{error}</Text>; // Display error if there's an issue
  }

  console.log(sports); // Log sports data to inspect its structure

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sports List</Text>

      <FlatList
        data={sports}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/fieldTimeslot`)}>
            <View style={styles.card}>
              {item.sportImage ? (
                <Image
                  source={{ uri: item.sportImage }}
                  style={styles.cardImage}
                />
              ) : (
                <Text style={styles.noImageText}>No Image Available</Text>
              )}

              <Text style={styles.cardTitle}>{item?.name?.en || "No name available"}</Text>

              {item?.name?.th && (
                <Text style={styles.cardSubtitle}>{item.name.th}</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4", // Background color for the screen
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333", // Title color
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
    elevation: 5, // Adds shadow on Android
  },
  cardImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    resizeMode: "cover", // Make sure the image fits the container well
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
});
