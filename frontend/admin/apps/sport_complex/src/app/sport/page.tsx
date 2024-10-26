"use client";
import ConfirmDialog from "@/components/Sport/Confirmdialog";
import SportForm from "@/components/Sport/SportForm";
import SportTable from "@/components/Sport/SportTable";
import { Sport } from "@/utils/SportTypes";
import * as Icons from "@heroicons/react/24/outline";
import { useGlobalContext } from "@shared/context/GlobalContext";
import { tAlert, tAlertType } from "@shared/utils/types/Alert";
import { useEffect, useState } from "react";

const apiUrl = "http://localhost:8081/api/sports";

async function fetchSport(): Promise<Sport[]> {
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
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSport, setSelectedSport] = useState<Sport | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [sportIdToDelete, setSportIdToDelete] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      const fetchedSports = await fetchSport();
      setSports(fetchedSports);
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
    setSelectedSport(null);
    setIsFormOpen(true);
  };

  const handleEdit = (sport: Sport) => {
      setSelectedSport(sport);
      setIsFormOpen(true);
  };

  const confirmDelete = (sportId: string) => {
    if (sportId) {
      setSportIdToDelete(sportId); 
      setIsConfirmDialogOpen(true);
    }
  };
  

  const handleDelete = async (id: string) => {
    try {
      const url = `${apiUrl}/${id}`; 

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete sport");
      }

      // Remove the deleted timeslot from the state
      setSports((prevSports) =>
        prevSports.filter((t) => t.id !== id)
      );

      handleAddAlert(
        "ExclamationCircleIcon",
        "Success",
        "Sport deleted successfully",
        tAlertType.SUCCESS
      );
    } catch (error) {
      console.error("Error deleting sport:", error);
    }
  };

  const handleFormSubmit = async (sport: Sport) => {
    try {
      const url = sport.id ? `${apiUrl}/${sport.id}` : apiUrl;
      const method = sport.id ? "PATCH" : "POST";
  
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sport),
      });
  
      if (!response.ok) {
        throw new Error(
          sport.id ? "Failed to update sport" : "Failed to create sport"
        );
      }
  
      const result = await response.json();
      if (sport.id) {
        // Update the existing timeslot
        setSports((prevSports) =>
          prevSports.map((t) => (t.id === result.data.id ? result.data : t))
        );
  
        handleAddAlert(
          "ExclamationCircleIcon",
          "Success",
          "Sport updated successfully",
          tAlertType.SUCCESS
        );
      } else {
        // Add the new timeslot
        setSports((prevSports) => [...prevSports, result.data]);
  
        handleAddAlert(
          "ExclamationCircleIcon",
          "Success",
          "Sports created successfully",
          tAlertType.SUCCESS
        );
      }
  
      setIsFormOpen(false); // Close the form
      setSelectedSport(null);
    } catch (error) {
      console.error(
        sport.id ? "Error updating sport:" : "Error creating sport:",
        error
      );
    }
  };
  

  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4 px-4 border-b-2">
          <h1 className="text-3xl font-bold mb-6">Sport</h1>
          <button
            onClick={handleCreate}
            className="bg-black text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white mb-6"
          >
            New Sport
          </button>
        </div>
        <div className="flex flex-wrap justify-start">
          <SportTable
            sports={sports}
            onEdit={handleEdit}
            onDelete={confirmDelete}
          />
        </div>

        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
              <SportForm
                sport={selectedSport}
                onSubmit={handleFormSubmit}
                onClose={() => setIsFormOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onConfirm={handleDelete} 
        onClose={() => setIsConfirmDialogOpen(false)}
        message="Are you sure you want to delete this sport?"
        id={sportIdToDelete!} 
      />
    </div>
  );
}
