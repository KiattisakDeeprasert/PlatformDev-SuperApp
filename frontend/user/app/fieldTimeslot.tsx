import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router"; // If you're using expo-router for navigation
import apiClient from "@/utils/api/sport_complex/sportApi/apiClient";
import { FieldTimeSlot } from "@/utils/api/sport_complex/interface/fieldtimeslot";

export default function FieldTimeslotPage() {
  const [timeSlots, setTimeSlots] = useState<FieldTimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Error handling
  const ipAddress = "http://192.168.129.73"; // Make sure this is your local IP address

  const router = useRouter(); // Hook for navigation

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  // Fetch the timeslot data from your API
  const fetchTimeSlots = async () => {
    setLoading(true); // Start loading before making the request
    setError(null); // Reset previous errors
    try {
      const response = await apiClient.get("/field-timeslots");
      console.log("Response data:", response.data); // Log the response to see what you get

      // Check if the response has the expected structure
      if (response.data && response.data.data) {
        const updatedfieldTimeSlot = response.data.data.map(
          (fieldTimeSlot: FieldTimeSlot) => ({
            ...fieldTimeSlot,
          })
        );
        setTimeSlots(updatedfieldTimeSlot);
      } else {
        setError("Invalid data structure received.");
      }
    } catch (error) {
      console.error("Error fetching fieldTimeSlot:", error);
      setError("Error fetching fieldTimeSlot data.");
    } finally {
      setLoading(false);
    }
  };

  // Render each row in the table
  const renderItem = ({ item }: { item: any }) => {
    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
        case "free":
          return "#4CAF50"; // Green
        case "reserved":
          return "#cd853f";
        case "in use":
          return "#F44336"; // Red
        default:
          return "#888"; // Default color for unknown status
      }
    };

    return (
      <View style={styles.row}>
        <Text style={[styles.cell, styles.fieldCell]}>
          {item.field.type.name.en}
        </Text>
        <Text style={[styles.cell, styles.timeCell]}>
          {`${item.timeSlot.start} - ${item.timeSlot.end}`}
        </Text>
        <View
          style={[
            styles.statusChip,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    );
  };

  // Handle navigation to the next page
  const navigateToNextPage = () => {
    router.push("/Reservation"); // Replace '/next-page' with your actual route
  };

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Field Time Slots</Text>
      <FlatList
        data={timeSlots}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No time slots available.</Text>
        }
      />

      {/* Navigation Button */}
      <TouchableOpacity style={styles.button} onPress={navigateToNextPage}>
        <Text style={styles.buttonText}>Go to Reservation</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles for the table and layout
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5", // Lighter background
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333", // Darker title text color
  },
  row: {
    flexDirection: "row",
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#fff", // White background for rows
    borderRadius: 8, // Rounded corners
    shadowColor: "#000", // Shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2, // For Android shadow
    justifyContent: "space-between",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    paddingVertical: 5,
    color: "#000", // Black text color
  },
  fieldCell: {
    fontWeight: "bold",
  },
  timeCell: {
    color: "#2196F3", // Blue for time slots
  },
  statusChip: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginLeft: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    color: "#fff", // White text for status
    fontSize: 14,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 18,
    color: "#888",
  },
  errorText: {
    textAlign: "center",
    fontSize: 18,
    color: "#f44336", // Red for errors
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
