import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import apiClient from "@/utils/api/sport_complex/sportApi/apiClient";
import { SpecialReservation } from "@/utils/api/sport_complex/interface/complexreservation";
import { SpecialField } from "@/utils/api/sport_complex/interface/specialfield";
import { TimeSlots } from "@/utils/api/sport_complex/interface/timeslot";

export default function ComplexReservation() {
  const [userUsername, setUserUsername] = useState<string>("");
  const [reservations, setReservations] = useState<SpecialReservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [userId, setUserId] = useState<string>("");
  const [fieldId, setFieldId] = useState<SpecialField[]>([]);
  const [timeSlotId, setTimeSlotId] = useState<TimeSlots[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);

  // Fetch reservations and related data
  useEffect(() => {
    fetchReservations();
    fetchFields();
    fetchTimeSlots();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/complex-reservations");
      setReservations(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch reservations", err);
      setError("Failed to fetch reservations");
    } finally {
      setLoading(false);
    }
  };

  const fetchFields = async () => {
    try {
      const response = await apiClient.get("/special-field/");
      setFields(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch fields", err);
    }
  };

  const fetchTimeSlots = async () => {
    try {
      const response = await apiClient.get("/time-slots/");
      setTimeSlots(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch time slots", err);
    }
  };

  const handleReservationSubmit = async () => {
    if (!userUsername || !fieldId || !timeSlotId) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post("/complex-reservations", {
        user: userUsername,
        field: fieldId,
        timeSlot: timeSlotId,
      });
      Alert.alert("Success", "Reservation created successfully!");
      fetchReservations(); // Refresh reservations after creating
    } catch (err) {
      console.error("Failed to create reservation", err);
      Alert.alert("Error", "Failed to create reservation.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007BFF" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complex Reservations</Text>
      {/* Form */}
      <Text style={styles.subtitle}>Make a Reservation</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter User ID"
        value={userUsername}
        onChangeText={setUserUsername}
        placeholderTextColor="#888"
      />
      <Picker
        selectedValue={fieldId}
        onValueChange={setFieldId}
        style={styles.picker}
      >
        <Picker.Item label="Select a Field" value={null} />
        {fields.map((field) => (
          <Picker.Item key={field.id} label={field.name.en} value={field.id} />
        ))}
      </Picker>
      <Picker
        selectedValue={timeSlotId}
        onValueChange={setTimeSlotId}
        style={styles.picker}
      >
        <Picker.Item label="Select a Time Slot" value={null} />
        {timeSlots.map((slot) => (
          <Picker.Item
            key={slot.id}
            label={`${slot.start} - ${slot.end}`}
            value={slot.id}
          />
        ))}
      </Picker>

      <TouchableOpacity
        style={styles.button}
        onPress={handleReservationSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit Reservation</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 30,
    marginBottom: 10,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
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
    color: "#333",
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  picker: {
    height: 45,
    borderColor: "#ccc",
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    color: "#f44336",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },
});
