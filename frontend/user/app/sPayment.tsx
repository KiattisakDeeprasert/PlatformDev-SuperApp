import { useState, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import apiClient from "@/utils/api/sport_complex/sportApi/apiClient";

export default function SpecialPaymentForm() {
  const [reservationId, setReservationId] = useState<string>(""); // Store reservation ID
  const [paymentImage, setPaymentImage] = useState<string>(""); // Store image URL
  const [loading, setLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false); // State to track fetching status

  // useEffect to fetch existing payment data based on reservationId
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!reservationId) return;

      setIsFetching(true); // Start loading indicator for fetching data

      try {
        const response = await apiClient.get(`/payment-special//${reservationId}`);
        const paymentDetails = response.data.data;

        // Pre-fill the form with existing payment details
        setPaymentImage(paymentDetails.paymentImage);
      } catch (error) {
        console.error("Failed to fetch payment details", error);
        Alert.alert("Error", "Failed to load payment details.");
      } finally {
        setIsFetching(false); // Stop loading indicator after fetching
      }
    };

    fetchPaymentDetails();
  }, [reservationId]); // Only run when reservationId changes

  const handleSubmit = async () => {
    if (!reservationId || !paymentImage) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.patch("/payment-special/", {
        reservation: reservationId,
        paymentImage: paymentImage,
      });

      Alert.alert(
        "Payment Updated!",
        "Your payment details have been successfully updated."
      );
      setLoading(false);
    } catch (error) {
      console.error("Payment update failed:", error);
      Alert.alert(
        "Payment Update Failed",
        "There was an error processing your payment update."
      );
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment-Special Information</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Enter Reservation ID</Text>
        <TextInput
          value={reservationId}
          onChangeText={setReservationId}
          style={styles.input}
          placeholder="Enter Reservation ID"
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Payment Image URL</Text>
        <TextInput
          value={paymentImage}
          onChangeText={setPaymentImage}
          style={styles.input}
          placeholder="Enter Payment Image URL"
          placeholderTextColor="#888"
        />
      </View>

      {isFetching && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007BFF" />
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonLoading]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit Payment</Text>
          )}
        </TouchableOpacity>
      </View>
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
  formGroup: {
    marginBottom: 20,
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
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonLoading: {
    backgroundColor: "#0056b3",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});
