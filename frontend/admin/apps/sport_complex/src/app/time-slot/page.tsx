"use client";
import ConfirmDialog from "@/components/Timeslot/Confirmdialog";
import TimeslotForm from "@/components/Timeslot/TimeslotForm";
import TimeslotTable from "@/components/Timeslot/TimeslotTable";
import { Timeslot } from "@/utils/TimeSlotTypes";
import * as Icons from "@heroicons/react/24/outline";
import { useGlobalContext } from "@shared/context/GlobalContext";
import { tAlert, tAlertType } from "@shared/utils/types/Alert";
import { useEffect, useState } from "react";

const apiUrl = "http://localhost:8081/time-slots";

async function fetchTimeslot(): Promise<Timeslot[]> {
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

export default function TimeSlotPage() {
  const { addAlert } = useGlobalContext();
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTimeslot, setSelectedTimeslot] = useState<Timeslot | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [timeslotIdToDelete, setTimeslotIdToDelete] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      const fetchedTimeslots = await fetchTimeslot();
      setTimeslots(fetchedTimeslots);
      setLoading(false);
    };

    fetchData();
  }, []);

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

  const handleCreate = () => {
    setSelectedTimeslot(null);
    setIsFormOpen(true);
  };

  const handleEdit = (timeslot: Timeslot) => {
      console.log("Editing timeslot:", timeslot);
      setSelectedTimeslot(timeslot);
      setIsFormOpen(true);
      console.error("Invalid timeslot ID:", timeslot._id);
    
  };

  const confirmDelete = (timeslotId: string) => {
    if (timeslotId) {
      console.log("Confirming delete for timeslot ID:", timeslotId);
      setTimeslotIdToDelete(timeslotId); // Set the ID to delete
      setIsConfirmDialogOpen(true); // Open the dialog
    } else {
      console.error("Invalid timeslot ID for deletion:", timeslotId);
    }
  };
  

  const handleDelete = async (id: string) => {
    // Ensure the ID is valid before proceeding
    if (!id) {
      console.error("Invalid timeslot ID for deletion");
      return; // Exit if ID is not valid
    }

    try {
      const url = `${apiUrl}/${id}`; // Construct the URL for the DELETE request

      const response = await fetch(url, {
        method: "DELETE", // Use DELETE method
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete timeslot");
      }

      // Remove the deleted timeslot from the state
      setTimeslots((prevTimeslots) =>
        prevTimeslots.filter((t) => t.id !== id)
      );

      handleAddAlert(
        "ExclamationCircleIcon",
        "Success",
        "Timeslot deleted successfully",
        tAlertType.SUCCESS
      );
    } catch (error) {
      console.error("Error deleting timeslot:", error);
    }
  };

  const handleFormSubmit = async (timeslot: Timeslot) => {
    try {
        const url = `${apiUrl}/${timeslot.id}`; // Use timeslot.id

        const response = await fetch(url, {
            method: "PATCH", // Use PATCH method
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(timeslot), // Send the entire form data
        });

        if (!response.ok) {
            throw new Error("Failed to update timeslot"); // Log if response is not ok
        }

        const result = await response.json();
        // Update the state with the newly updated timeslot
        setTimeslots((prevTimeslots) =>
          prevTimeslots.map((t) => (t.id === result.data._id ? result.data : t)) // Use id for comparison
        );

        setIsFormOpen(false); // Close the form
        handleAddAlert(
            "ExclamationCircleIcon",
            "Success",
            "Timeslot updated successfully",
            tAlertType.SUCCESS
        );
        setSelectedTimeslot(null); // Clear the selected timeslot
    } catch (error) {
        console.error("Error updating timeslot:", error); // Log any errors encountered
    }
};

  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4 px-4 border-b-2">
          <h1 className="text-3xl font-bold mb-6">Timeslot</h1>
          <button
            onClick={handleCreate}
            className="bg-black text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white mb-6"
          >
            New Timeslot
          </button>
        </div>
        <div className="flex flex-wrap justify-start">
          <TimeslotTable
            timeslots={timeslots}
            onEdit={handleEdit}
            onDelete={confirmDelete}
          />
        </div>

        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
              <TimeslotForm
                timeslot={selectedTimeslot}
                onSubmit={handleFormSubmit}
                onClose={() => setIsFormOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onConfirm={handleDelete} // Pass the handleDelete function
        onClose={() => setIsConfirmDialogOpen(false)}
        message="Are you sure you want to delete this time slot?"
        id={timeslotIdToDelete!} // Pass the ID, ensuring it's defined
      />
    </div>
  );
}
