import { useState, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
} from "react-native";
import apiClient from "@/utils/api/sport_complex/sportApi/apiClient";
import { launchImageLibrary } from "react-native-image-picker";

export default function PaymentForm() {
  const [reservationId, setReservationId] = useState<string>("");
  const [paymentImage, setPaymentImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch payment details based on reservationId
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!reservationId) return;

      setIsFetching(true);

      try {
        const response = await apiClient.get(`/payments/${reservationId}`);
        const paymentDetails = response.data.data;
        setPaymentImage(paymentDetails.paymentImage);
      } catch (error) {
        console.error("Failed to fetch payment details", error);
        setErrorMessage("Failed to load payment details.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchPaymentDetails();
  }, [reservationId]);

  // Handle payment form submission
  const handleSubmit = async () => {
    if (!reservationId || !paymentImage) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    setErrorMessage(null); // Clear any previous error messages

    try {
      const response = await apiClient.patch("/payments", {
        reservation: reservationId,
        paymentImage: paymentImage,
      });

      Alert.alert(
        "Payment Updated!",
        "Your payment details have been successfully updated."
      );
    } catch (error) {
      console.error("Payment update failed:", error);
      setErrorMessage("There was an error processing your payment update.");
    } finally {
      setLoading(false);
    }
  };

  // Handle image selection
  const handleImagePick = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        includeBase64: false,
      },
      (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.errorCode) {
          console.error("Image picker error:", response.errorMessage);
        } else {
          if (response.assets && response.assets.length > 0) {
            const selectedImageUri = response.assets[0].uri;
            setPaymentImage(selectedImageUri);
          }
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Information</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Enter Reservation ID</Text>
        <TextInput
          value={reservationId}
          onChangeText={setReservationId}
          style={styles.input}
          placeholder="Enter Reservation ID"
          placeholderTextColor="#888"
          accessible={true}
          accessibilityLabel="Reservation ID"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Payment Image</Text>
        <TouchableOpacity
          onPress={handleImagePick}
          style={styles.imagePickerButton}
          accessible={true}
          accessibilityLabel="Select Payment Image"
        >
          <Text style={styles.imagePickerText}>
            {paymentImage ? "Change Payment Image" : "Select Payment Image"}
          </Text>
        </TouchableOpacity>

        {/* Display the selected image */}
        {paymentImage && (
          <Image source={{ uri: paymentImage }} style={styles.selectedImage} />
        )}
      </View>

      {isFetching && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007BFF" />
        </View>
      )}

      {/* Display error message */}
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

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
  imagePickerButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  imagePickerText: {
    color: "#fff",
    fontSize: 16,
  },
  selectedImage: {
    marginTop: 20,
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderRadius: 10,
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
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
});
