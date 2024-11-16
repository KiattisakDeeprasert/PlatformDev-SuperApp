"use client";

import ConfirmDialog from "@/components/Default/Confirmdialog";
import FieldTimeSlotForm from "@/components/FieldTimeSlot/FieldTimeslotForm";
import FieldTimeSlotTable from "@/components/FieldTimeSlot/FieldTimeslotTable";
import { FieldTimeSlot } from "@/utils/FieldTimeSlotTypes";
import { useGlobalContext } from "@shared/context/GlobalContext";
import { tAlertType } from "@shared/utils/types/Alert";
import { useEffect, useState } from "react";

const apiUrl = "http://localhost:8081/api/field-timeslots";

async function fetchFieldTimeslot(): Promise<FieldTimeSlot[]> {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Failed to fetch field-timeslots");
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function saveFieldTimeSlot(
  fieldTimeSlot: FieldTimeSlot
): Promise<FieldTimeSlot | null> {
  try {
    const method = fieldTimeSlot.id ? "PATCH" : "POST";
    const url = fieldTimeSlot.id ? `${apiUrl}/${fieldTimeSlot.id}` : apiUrl;
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fieldTimeSlot),
    });
    if (!response.ok)
      throw new Error(
        `Failed to ${method === "POST" ? "create" : "update"} field-timeslot`
      );
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function deleteFieldTimeSlot(fieldTimeSlotId: string): Promise<boolean> {
  try {
    const response = await fetch(`${apiUrl}/${fieldTimeSlotId}`, {
      method: "DELETE",
    });
    return response.ok;
  } catch (error) {
    console.error("Error deleting field-time slot:", error);
    return false;
  }
}

export default function FieldTimeSlotPage() {
  const [fieldTimeslots, setFieldTimeslots] = useState<FieldTimeSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentFieldTimeSlot, setCurrentFieldTimeSlot] =
    useState<FieldTimeSlot | null>(null);
  const { addAlert } = useGlobalContext(); // Accessing global context for alerts

  // Confirm dialog states
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [fieldTimeSlotIdToDelete, setFieldTimeSlotIdToDelete] = useState<
    string | null
  >(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const fetchedFieldTimeslot = await fetchFieldTimeslot();
      if (fetchedFieldTimeslot.length === 0)
        setError("No field time slots found.");
      setFieldTimeslots(fetchedFieldTimeslot);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleNew = () => {
    setCurrentFieldTimeSlot(null);
    setIsModalOpen(true);
  };

  const handleEdit = (fieldTimeSlot: FieldTimeSlot) => {
    setCurrentFieldTimeSlot(fieldTimeSlot);
    setIsModalOpen(true);
  };

  const confirmDelete = (fieldTimeSlotId: string) => {
    setFieldTimeSlotIdToDelete(fieldTimeSlotId);
    setIsConfirmDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!fieldTimeSlotIdToDelete) return;

    const success = await deleteFieldTimeSlot(fieldTimeSlotIdToDelete);
    if (success) {
      setFieldTimeslots((prevSlots) =>
        prevSlots.filter((item) => item.id !== fieldTimeSlotIdToDelete)
      );
      // Add success alert
      addAlert({
        title: "Success",
        message: "Field time slot deleted successfully",
        buttonText: "X",
        iconName: "ExclamationCircleIcon",
        type: tAlertType.SUCCESS,
      });
    } else {
      console.error("Failed to delete field-time slot");
      // Add error alert
      addAlert({
        title: "Error",
        message: "Failed to delete field time slot",
        buttonText: "X",
        iconName: "ExclamationCircleIcon",
        type: tAlertType.ERROR,
      });
    }
    setIsConfirmDialogOpen(false); // Close the confirm dialog
    setFieldTimeSlotIdToDelete(null); // Reset the ID
  };

  const handleSubmit = async (formData: FieldTimeSlot) => {
    const savedFieldTimeSlot = await saveFieldTimeSlot(formData);
    if (savedFieldTimeSlot) {
      setFieldTimeslots((prevSlots) =>
        formData.id
          ? prevSlots.map((slot) =>
              slot.id === savedFieldTimeSlot.id ? savedFieldTimeSlot : slot
            )
          : [...prevSlots, savedFieldTimeSlot]
      );
      setIsModalOpen(false);
      // Add success alert
      addAlert({
        title: "Success",
        message: "Field time slot saved successfully",
        buttonText: "X",
        iconName: "ExclamationCircleIcon",
        type: tAlertType.SUCCESS,
      });
    } else {
      console.error("Failed to save field-time slot");
      // Add error alert
      addAlert({
        title: "Error",
        message: "Failed to save field time slot",
        buttonText: "X",
        iconName: "ExclamationCircleIcon",
        type: tAlertType.ERROR,
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex justify-between items-center mb-4 px-4 border-b-2">
          <h1 className="text-3xl font-bold mb-6">Field - Time slot</h1>
          <button
            onClick={handleNew}
            className="bg-black text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white mb-6"
          >
            New Field Timeslot
          </button>
        </div>
        <FieldTimeSlotTable
          fieldTimeSlots={fieldTimeslots}
          onEdit={handleEdit}
          onDelete={confirmDelete} // Use confirmDelete for handling delete
        />
        {isModalOpen && (
          <FieldTimeSlotForm
            fieldTimeSlot={currentFieldTimeSlot}
            onSubmit={handleSubmit}
            onClose={() => setIsModalOpen(false)}
          />
        )}
        <ConfirmDialog
          isOpen={isConfirmDialogOpen}
          onConfirm={handleDelete} // Confirm dialog confirms deletion
          onClose={() => setIsConfirmDialogOpen(false)}
          message="Are you sure you want to delete this Field Time Slot?"
        />
      </div>
    </div>
  );
}
