import { Sport } from "@/utils/api/sport_complex/interface/sport";
import apiClient from "@/utils/api/sport_complex/sportApi/apiClient";
import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
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
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Sports List</Text>

      {/* ใช้ FlatList เพื่อแสดงรายการกีฬา */}
      <FlatList
        data={sports}
        keyExtractor={(item) => item.id.toString()} // ใช้ id ของแต่ละรายการเป็น key
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/fieldTimeslot`)}>
            {/* เมื่อคลิกจะไปที่หน้ารายละเอียดของกีฬา */}
            <View
              style={{
                marginBottom: 10,
                padding: 10,
                borderWidth: 1,
                borderRadius: 10,
              }}
            >
              {/* แสดงภาพกีฬา ถ้ามี */}
              {item.sportImage ? (
                <Image
                  source={{ uri: item.sportImage }}
                  style={{ width: 100, height: 100, borderRadius: 10 }}
                />
              ) : (
                <Text>No Image Available</Text> // ถ้าไม่มีภาพแสดงข้อความนี้
              )}

              {/* แสดงชื่อกีฬา ภาษาอังกฤษ */}
              <Text
                style={{ marginTop: 10, textAlign: "center", fontSize: 16 }}
              >
                {item?.name?.en || "No name available"}{" "}
                {/* ใช้ fallback ถ้าชื่อภาษาอังกฤษไม่มี */}
              </Text>

              {/* แสดงชื่อกีฬา ภาษาไทย ถ้ามี */}
              {item?.name?.th && (
                <Text
                  style={{
                    marginTop: 5,
                    textAlign: "center",
                    fontSize: 14,
                    color: "gray",
                  }}
                >
                  {item.name.th} {/* แสดงชื่อภาษาไทย */}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
