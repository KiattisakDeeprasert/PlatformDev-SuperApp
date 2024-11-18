"use client";
import ConfirmDialog from "@/components/Default/Confirmdialog";
import SpecialReservationForm from "@/components/SpecialReservation/SpecialReservationForm";
import SpecialReservationTable from "@/components/SpecialReservation/SpecialReservationTable";
import { Field } from "@/utils/FieldTypes";
import { SpecialReservation } from "@/utils/SpecialReservationTypes";
import { Timeslot } from "@/utils/TimeSlotTypes";
import * as Icons from "@heroicons/react/24/outline";
import { User } from "@/utils/UserTypes";
import { useGlobalContext } from "@shared/context/GlobalContext";
import { tAlert, tAlertType } from "@shared/utils/types/Alert";
import { useEffect, useState } from "react";

const apiUrl = "http://localhost:8081/api/complex-reservations";

async function fetchSpecialReservations(): Promise<SpecialReservation[]> {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch special reservations");
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
    const response = await fetch("http://localhost:8081/api/special-field/");
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

async function saveSpecialReservation(reservation: SpecialReservation) {
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

export default function SpecialReservationPage() {
  const [specialReservations, setSpecialReservations] = useState<
    SpecialReservation[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [currentSpecialReservation, setCurrentSpecialReservation] =
    useState<SpecialReservation | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [timeSlots, setTimeSlots] = useState<Timeslot[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] =
    useState<boolean>(false);
  const [reservationIdToDelete, setReservationIdToDelete] = useState<
    string | null
  >(null);

  const handleAddAlert = (
    iconName: keyof typeof Icons,
    title: string,
    message: string,
    type: tAlertType
  ) => {
    const newAlert: tAlert = {
      title: title,
      message: message,
      buttonText: "X",
      iconName: iconName,
      type: type,
      id: Math.random().toString(36).substring(2, 9),
    };
    addAlert(newAlert);
  };

  const { addAlert } = useGlobalContext();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const fetchedSpecialReservations = await fetchSpecialReservations();
      const fetchedFields = await fetchFields();
      const fetchedTimeSlots = await fetchTimeSlots();
      const fetchedUsers = await fetchUsers();

      setSpecialReservations(fetchedSpecialReservations);
      setFields(fetchedFields);
      setTimeSlots(fetchedTimeSlots);
      setUsers(fetchedUsers);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleCreate = () => {
    setCurrentSpecialReservation(null);
    setIsFormOpen(true);
  };

  const handleEdit = (reservation: SpecialReservation) => {
    setCurrentSpecialReservation(reservation);
    setIsFormOpen(true);
  };

  const confirmDelete = (reservationId: string) => {
    setReservationIdToDelete(reservationId);
    setIsConfirmDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!reservationIdToDelete) return;

    try {
      const response = await fetch(`${apiUrl}/${reservationIdToDelete}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete special field");
      }
      setSpecialReservations(specialReservations.filter((sr) => sr.id !== reservationIdToDelete));
      handleAddAlert(
        "ExclamationCircleIcon",
        "Success",
        "Reservation deleted successfully",
        tAlertType.SUCCESS
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsConfirmDialogOpen(false);
      setReservationIdToDelete(null);
    }
  };

  const handleFormSubmit = async (reservation: SpecialReservation) => {
    // Save the reservation after form submission
    await saveSpecialReservation(reservation);
    const fetchedSpecialReservations = await fetchSpecialReservations();
    setSpecialReservations(fetchedSpecialReservations);
    setIsFormOpen(false); // Close the form after submission
    handleAddAlert(
      "TrashIcon",
      "Success",
      "Special Reservation saved successfully!",
      tAlertType.SUCCESS
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4 px-4 border-b-2">
          <h1 className="text-3xl font-bold mb-6">Special Reservations</h1>
          <button
            className="bg-black text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white mb-6"
            onClick={handleCreate}
          >
            New Special Reservation
          </button>
        </div>
        <div className="flex flex-wrap justify-start">
          <SpecialReservationTable
            specialReservations={specialReservations}
            onEdit={handleEdit}
            onDelete={confirmDelete}
          />
        </div>
      </div>
      {isFormOpen && (
        <SpecialReservationForm
          fields={fields}
          timeSlots={timeSlots}
          user={users}
          reservation={currentSpecialReservation}
          onSubmit={handleFormSubmit}
          onClose={() => setIsFormOpen(false)}
        />
      )}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onConfirm={handleDelete}
        onClose={() => setIsConfirmDialogOpen(false)}
        message="Are you sure you want to delete this special reservation?"
      />
    </div>
  );
}
