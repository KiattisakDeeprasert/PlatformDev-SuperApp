import { Field } from "@/utils/api/sport_complex/interface/field";
import { TimeSlots } from "@/utils/api/sport_complex/interface/timeslot";
import apiClient from "@/utils/api/sport_complex/sportApi/apiClient";
import React, { useState, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function ReservationForm() {
  const [userUsername, setUserUsername] = useState<string>(""); // Store the user input
  const [fieldId, setFieldId] = useState<string | null>(null);
  const [timeSlotId, setTimeSlotId] = useState<string | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlots[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch fields and time slots when the component mounts
    const fetchFields = async () => {
      try {
        const response = await apiClient.get("/fields/");
        setFields(response.data.data);
      } catch (error) {
        console.error("Failed to fetch rooms", error);
      }
    };

    const fetchTimeSlots = async () => {
      try {
        const response = await apiClient.get("/time-slots/");
        setTimeSlots(response.data.data);
      } catch (error) {
        console.error("Failed to fetch time slots", error);
      }
    };

    fetchFields();
    fetchTimeSlots();
  }, []);

  const handleSubmit = async () => {
    if (!userUsername || !fieldId || !timeSlotId) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post("/reservations/", {
        user: userUsername,
        field: fieldId,
        timeSlot: timeSlotId,
      });
      Alert.alert("Reservation successful!");
      setLoading(false);
    } catch (error) {
      console.error("Reservation failed:", error);
      Alert.alert(
        "Reservation failed",
        "There was an error processing your reservation."
      );
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Make a Reservation</Text>

      <Text style={styles.label}>Enter Username</Text>
      <TextInput
        value={userUsername}
        onChangeText={setUserUsername}
        style={styles.input}
        placeholder="Enter Username"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Select Field</Text>
      <View style={styles.pickerContainer}>
        {fields.length === 0 ? (
          <ActivityIndicator size="small" color="#007BFF" />
        ) : (
          <Picker
            selectedValue={fieldId}
            onValueChange={setFieldId}
            style={styles.picker}
          >
            <Picker.Item label="Select a Field" value="" />
            {fields.map((field) => (
              <Picker.Item
                key={field.id}
                label={field.type.name.en}
                value={field.id}
              />
            ))}
          </Picker>
        )}
      </View>

      <Text style={styles.label}>Select Time Slot</Text>
      <View style={styles.pickerContainer}>
        {timeSlots.length === 0 ? (
          <ActivityIndicator size="small" color="#007BFF" />
        ) : (
          <Picker
            selectedValue={timeSlotId}
            onValueChange={setTimeSlotId}
            style={styles.picker}
          >
            <Picker.Item label="Select a Time Slot" value="" />
            {timeSlots.map((slot) => (
              <Picker.Item
                key={slot.id}
                label={`${slot.start} - ${slot.end}`} // Combine start and end times
                value={slot.id}
              />
            ))}
          </Picker>
        )}
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonLoading]}
        onPress={handleSubmit}
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
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#555",
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  pickerContainer: {
    marginBottom: 20,
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    backgroundColor: "#fff",
    paddingLeft: 15,
  },
  picker: {
    height: 45,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonLoading: {
    backgroundColor: "#0056b3",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
