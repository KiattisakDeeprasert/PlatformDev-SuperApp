import { Reservation } from "@/utils/api/sport_complex/interface/reservation";
import apiClient from "@/utils/api/sport_complex/sportApi/apiClient";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Profile() {
  const [profile, setProfile] = useState<{
    username: string;
    email: string;
  } | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [payments, setPayments] = useState<any[]>([]); // Placeholder for payment data
  const [loading, setLoading] = useState(true);
  const [showRoomReservation, setShowRoomReservation] = useState(false);
  const [showPayments, setShowPayments] = useState(false);

  const fetchProfileAndReservations = async () => {
    try {
      const profileResponse = await apiClient.get("/users/profile");
      setProfile(profileResponse.data);

      const reservationResponse = await apiClient.get("/reservations/");
      const userReservations = reservationResponse.data.data.filter(
        (res: Reservation) =>
          res.user.username === profileResponse.data.username
      );
      setReservations(userReservations);

      // Mocking payments data; replace with actual API request
      const paymentResponse = await apiClient.get("/payments/"); // Add actual API endpoint
      setPayments(paymentResponse.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndReservations();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProfileAndReservations();
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <ImageBackground
      imageStyle={{ backgroundColor: "#FFFFFF" }}
      style={styles.background}
    >
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.profileHeader}>
            <Text style={styles.profileText}>Student ID: {profile?.username}</Text>
            <Text style={styles.profileText}>Email: {profile?.email}</Text>
          </View>

          {/* Room Reservation Section */}
          <View style={styles.section}>
            <TouchableOpacity
              onPress={() => setShowRoomReservation(!showRoomReservation)}
              style={styles.toggleButton}
            >
              <Text style={styles.toggleText}>Your Reservations</Text>
              <FontAwesome
                name={showRoomReservation ? "caret-up" : "caret-down"}
                size={20}
                color="#000000"
                style={styles.toggleIcon}
              />
            </TouchableOpacity>

            {showRoomReservation && (
              <View style={styles.table}>
                {reservations.length === 0 ? (
                  <Text>No Reservations</Text>
                ) : (
                  reservations.map((reservation, index) => (
                    <View key={index} style={styles.tableRow}>
                      <Text>{reservation.field.type.name.en}</Text>
                      <Text>{reservation.field.price}</Text>
                    </View>
                  ))
                )}
              </View>
            )}
          </View>

          {/* Payments Section */}
          <View style={styles.section}>
            <TouchableOpacity
              onPress={() => setShowPayments(!showPayments)}
              style={styles.toggleButton}
            >
              <Text style={styles.toggleText}>Your Payments</Text>
              <FontAwesome
                name={showPayments ? "caret-up" : "caret-down"}
                size={20}
                color="#000000"
                style={styles.toggleIcon}
              />
            </TouchableOpacity>

            {showPayments && (
              <View style={styles.table}>
                {payments.length === 0 ? (
                  <Text>No Payments</Text>
                ) : (
                  payments.map((payment, index) => (
                    <View key={index} style={styles.tableRow}>
                      <Text>{payment.paymentImage}</Text>
                      <Text>{payment.amount}</Text>
                    </View>
                  ))
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "gray",
  },
  profileText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 20,
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  toggleText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  toggleIcon: {
    marginLeft: 10,
  },
  table: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "gray",
    borderWidth: 1,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
});
