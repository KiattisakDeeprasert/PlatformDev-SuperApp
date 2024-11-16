"use client";
import ReservationForm from "@/components/Reservation/ReservationForm";
import ReservationTable from "@/components/Reservation/ReservationTable";
import { Field } from "@/utils/FieldTypes";
import { Reservation } from "@/utils/ReservationTypes";
import { Timeslot } from "@/utils/TimeSlotTypes";
import { User } from "@/utils/UserTypes";
import { useEffect, useState } from "react";

const apiUrl = "http://localhost:8081/api/reservations";

async function fetchReservations(): Promise<Reservation[]> {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch reservations");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// New functions to fetch fields, users, and timeSlots
async function fetchFields(): Promise<Field[]> {
  try {
    const response = await fetch("http://localhost:8081/api/fields/");
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Failed to fetch fields", error);
    return [];
  }
}

async function fetchTimeSlots(): Promise<Timeslot[]> {
  try {
    const response = await fetch("http://localhost:8081/api/time-slots/");
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Failed to fetch time slots", error);
    return [];
  }
}

async function fetchUsers(): Promise<User[]> {
  try {
    const response = await fetch("http://localhost:8081/api/users/");
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    return [];
  }
}

async function saveReservation(reservation: Reservation) {
  try {
    const response = await fetch(apiUrl, {
      method: reservation.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservation),
    });

    if (!response.ok) {
      const errorData = await response.json(); // Get the error response body
      throw new Error(
        `Failed to save reservation: ${
          errorData.message || response.statusText
        }`
      );
    }
  } catch (error) {
    console.error("Failed to save reservation:", error);
  }
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [currentReservation, setCurrentReservation] =
    useState<Reservation | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [timeSlots, setTimeSlots] = useState<Timeslot[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const fetchedReservations = await fetchReservations();
      const fetchedFields = await fetchFields();
      const fetchedTimeSlots = await fetchTimeSlots();
      const fetchedUsers = await fetchUsers();

      setReservations(fetchedReservations);
      setFields(fetchedFields);
      setTimeSlots(fetchedTimeSlots);
      setUsers(fetchedUsers);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleCreate = () => {
    setCurrentReservation(null);
    setIsFormOpen(true);
  };

  const handleEdit = (reservation: Reservation) => {
    setCurrentReservation(reservation);
    setIsFormOpen(true);
  };

  const handleDelete = async (reservationId: string) => {
    try {
      await fetch(`${apiUrl}/${reservationId}`, { method: "DELETE" });
      setReservations(reservations.filter((r) => r.id !== reservationId));
    } catch (error) {
      console.error("Failed to delete reservation:", error);
    }
  };

  const handleFormSubmit = async (reservation: Reservation) => {
    // Save the reservation after form submission
    await saveReservation(reservation);
    const fetchedReservations = await fetchReservations();
    setReservations(fetchedReservations);
    setIsFormOpen(false); // Close the form after submission
  };

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
            onClick={handleCreate}
          >
            New Reservation
          </button>
        </div>
        <div className="flex flex-wrap justify-start">
          <ReservationTable
            reservations={reservations}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
      {isFormOpen && (
        <ReservationForm
          fields={fields}
          timeSlots={timeSlots}
          users={users}
          reservation={currentReservation}
          onSubmit={handleFormSubmit}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
