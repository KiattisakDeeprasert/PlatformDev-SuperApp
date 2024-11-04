"use client";
import { Reservation } from "@/utils/ReservationTypes";
import { useEffect, useState } from "react";

const apiUrl = "http://localhost:8081/api/reservations";

async function fetchReservations(): Promise<Reservation[]> {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch timeslot");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default function ReservationsPage() {
 
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedReservations = await fetchReservations();
      setReservations(fetchedReservations);
      setLoading(false);
    };

    fetchData();
  }, []);


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4 px-4 border-b-2">
          <h1 className="text-3xl font-bold mb-6">Reservation</h1>
          <button
            className="bg-black text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white mb-6"
          >
            New Reservation
          </button>
        </div>
        <div className="flex flex-wrap justify-start">
          {/* <SportTable
            sports={sports}
            onEdit={handleEdit}
            onDelete={confirmDelete}
          /> */}
        </div>

      </div>
    </div>
  );
}
