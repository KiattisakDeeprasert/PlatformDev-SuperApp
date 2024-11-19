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
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function ReservationForm() {
  const [userUsername, setUserUsername] = useState<string>(""); // เก็บค่าที่ผู้ใช้กรอก
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
        user: userUsername, // ส่งค่าที่กรอกในช่องนี้
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
      />

      <Text style={styles.label}>Select Filed</Text>
      <View style={styles.pickerContainer}>
        {fields.length === 0 ? (
          <Text>Loading Fileds...</Text>
        ) : (
          <Picker
            selectedValue={fieldId}
            onValueChange={setFieldId}
            style={styles.picker}
          >
            <Picker.Item label="Select a Filed" value="" />
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
          <Text>Loading Time Slots...</Text>
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
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Submitting..." : "Submit Reservation"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  picker: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
