import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router"; // Ensure you have expo-router installed
import apiClient from "@/utils/api/sport_complex/sportApi/apiClient";

export default function SpecialTable() {
  const [specialTables, setSpecialTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // For navigation

  useEffect(() => {
    fetchSpecialTableData();
  }, []);

  const fetchSpecialTableData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get("/special-table"); // Update with your endpoint
      if (response.data && response.data.data) {
        setSpecialTables(response.data.data);
      } else {
        setError("Invalid data structure received.");
      }
    } catch (err) {
      console.error("Error fetching special table data:", err);
      setError("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const renderSpecialTableRow = ({ item }: { item: any }) => {
    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
        case "free":
          return "#4CAF50"; // Green
        case "full":
          return "#F44336"; // Red
        default:
          return "#888"; // Default
      }
    };

    return (
      <View style={styles.row}>
        {/* Field Name */}
        <Text style={styles.cell}>{item.field.name.en}</Text>
        {/* Timeslot */}
        <Text style={styles.cell}>
          {item.timeSlot.start} - {item.timeSlot.end}
        </Text>
        {/* Status */}
        <View
          style={[
            styles.statusChip,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
        {/* User Count */}
        <Text style={styles.cell}>
          {item.userCurrent} / {item.capacity}
        </Text>
      </View>
    );
  };

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Special Table</Text>
      <FlatList
        data={specialTables}
        keyExtractor={(item) => item.id}
        renderItem={renderSpecialTableRow}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No data available.</Text>
        }
      />

      {/* Navigation Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/complexreservation")} // Update with your route
      >
        <Text style={styles.buttonText}>Go to Reservation</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    color: "#000",
  },
  statusChip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  statusText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 18,
    color: "#888",
  },
  errorText: {
    textAlign: "center",
    fontSize: 18,
    color: "#f44336",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    color: "#888",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#4CAF50", // Green color for the button
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
