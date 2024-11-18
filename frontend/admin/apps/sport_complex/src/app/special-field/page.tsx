"use client";
import { useState, useEffect } from "react";
import SpecialFieldForm from "@/components/SpecialField/SpecialFieldForm";
import SpecialFieldTable from "@/components/SpecialField/SpecialFieldTable";
import { SpecialField } from "@/utils/SpecialFieldTypes";
import * as Icons from "@heroicons/react/24/outline";
import { useGlobalContext } from "@shared/context/GlobalContext";
import { tAlert, tAlertType } from "@shared/utils/types/Alert";
import ConfirmDialog from "@/components/Default/Confirmdialog";

const apiUrl = "http://localhost:8081/api/special-field";

async function fetchSpecialFields(): Promise<SpecialField[]> {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch special fields");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default function SpecialFieldPage() {
  const { addAlert } = useGlobalContext();
  const [specialFields, setSpecialFields] = useState<SpecialField[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSpecialField, setSelectedSpecialField] = useState<SpecialField | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [specialFieldIdToDelete, setSpecialFieldIdToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedSpecialFields = await fetchSpecialFields();
      setSpecialFields(fetchedSpecialFields);
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
    setSelectedSpecialField(null);
    setIsFormOpen(true);
  };

  const handleEdit = (specialField: SpecialField) => {
    setSelectedSpecialField(specialField);
    setIsFormOpen(true);
  };

  const confirmDelete = (specialFieldId: string) => {
    setSpecialFieldIdToDelete(specialFieldId);
    setIsConfirmDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!specialFieldIdToDelete) return;

    try {
      const response = await fetch(`${apiUrl}/${specialFieldIdToDelete}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete special field");
      }
      setSpecialFields(specialFields.filter((sf) => sf.id !== specialFieldIdToDelete));
      handleAddAlert(
        "ExclamationCircleIcon",
        "Success",
        "Special field deleted successfully",
        tAlertType.SUCCESS
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsConfirmDialogOpen(false);
      setSpecialFieldIdToDelete(null);
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    try {
      // Ensure that ID is not being sent for new records
      if (!formData.get("id")) {
        formData.delete("id");
      }

      const url = formData.get("id")
        ? `${apiUrl}/${formData.get("id")}`
        : apiUrl;
      const method = formData.get("id") ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          formData.get("id")
            ? "Failed to update special field"
            : "Failed to create special field"
        );
      }

      const result = await response.json();
      if (formData.get("id")) {
        // Update the existing special field
        setSpecialFields((prevSpecialFields) =>
          prevSpecialFields.map((sf) => (sf.id === result.data.id ? result.data : sf))
        );

        handleAddAlert(
          "ExclamationCircleIcon",
          "Success",
          "Special field updated successfully",
          tAlertType.SUCCESS
        );
      } else {
        // Add the new special field
        setSpecialFields((prevSpecialFields) => [...prevSpecialFields, result.data]);

        handleAddAlert(
          "ExclamationCircleIcon",
          "Success",
          "Special field created successfully",
          tAlertType.SUCCESS
        );
      }

      setIsFormOpen(false);
      setSelectedSpecialField(null);
    } catch (error) {
      console.error(
        formData.get("id") ? "Error updating special field:" : "Error creating special field:",
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
          <h1 className="text-3xl font-bold mb-6">Special Fields</h1>
          <button
            onClick={handleCreate}
            className="bg-black text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white mb-6"
          >
            New Special Field
          </button>
        </div>
        <div className="flex flex-wrap justify-start">
          <SpecialFieldTable
            specialFields={specialFields}
            onEdit={handleEdit}
            onDelete={confirmDelete}
          />
        </div>

        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
              <SpecialFieldForm
                specialField={selectedSpecialField}
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
        message="Are you sure you want to delete this special field?"
      />
    </div>
  );
}
