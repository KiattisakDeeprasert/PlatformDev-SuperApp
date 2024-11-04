"use client";
import { useEffect, useState } from "react";
import { Field } from "@/utils/FieldTypes";
import FieldTable from "@/components/Field/FieldTable";
import FieldForm from "@/components/Field/FieldForm";
import * as Icons from "@heroicons/react/24/outline";
import { useGlobalContext } from "@shared/context/GlobalContext";
import { tAlert, tAlertType } from "@shared/utils/types/Alert";
import ConfirmDialog from "@/components/Default/Confirmdialog";

const apiUrl = "http://localhost:8081/api/fields";

async function fetchFields(): Promise<Field[]> {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch fields");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default function FieldPage() {
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { addAlert } = useGlobalContext();
  
  // Confirm dialog states
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [fieldIdToDelete, setFieldIdToDelete] = useState<string | null>(null);

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

  // Fetch fields on page load
  useEffect(() => {
    const loadFields = async () => {
      const fetchedFields = await fetchFields();
      setFields(fetchedFields);
    };
    loadFields();
  }, []);

  const handleEdit = (field: Field) => {
    setSelectedField(field); // Set the selected field for editing
    setIsFormOpen(true); // Open the form modal
  };

  const confirmDelete = (fieldId: string) => {
    setFieldIdToDelete(fieldId); // Set the field ID to delete
    setIsConfirmDialogOpen(true); // Open the confirm dialog
  };

  const handleDelete = async () => {
    if (!fieldIdToDelete) return;

    try {
      const response = await fetch(`${apiUrl}/${fieldIdToDelete}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setFields(fields.filter((field) => field.id !== fieldIdToDelete));
        handleAddAlert(
          "ExclamationCircleIcon",
          "Success",
          "Field deleted successfully",
          tAlertType.SUCCESS
        );
      } else {
        console.error("Failed to delete field");
      }
    } catch (error) {
      console.error("Error deleting field:", error);
    } finally {
      setIsConfirmDialogOpen(false); 
      setFieldIdToDelete(null);
    }
  };

  // Handle form submission for creating or updating fields
  const handleFormSubmit = async (formData: Field) => {
    try {
      const method = formData.id ? "PATCH" : "POST";
      const url = apiUrl + (formData.id ? `/${formData.id}` : "");

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${method === "POST" ? "create" : "update"} field`
        );
      }

      const result = await response.json();
      if (method === "POST") {
        setFields([...fields, result.data]);
      } else {
        setFields(
          fields.map((t) => (t.id === result.data.id ? result.data : t))
        );
      }
      setIsFormOpen(false);
      handleAddAlert(
        "ExclamationCircleIcon",
        "Success",
        "Field updated successfully",
        tAlertType.SUCCESS
      );
      setSelectedField(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4 px-4 border-b-2">
          <h1 className="text-3xl font-bold mb-6">Field</h1>
          <button
            onClick={() => {
              setSelectedField(null);
              setIsFormOpen(true);
            }}
            className="bg-black text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white mb-6"
          >
            New Field
          </button>
        </div>

        <div className="flex flex-wrap justify-start">
          <FieldTable
            fields={fields}
            onEdit={handleEdit}
            onDelete={confirmDelete} // Use confirmDelete instead of handleDelete directly
          />
        </div>

        {isFormOpen && (
          <FieldForm
            field={selectedField}
            onSubmit={handleFormSubmit}
            onClose={() => setIsFormOpen(false)}
          />
        )}
      </div>
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onConfirm={handleDelete} // Confirm dialog confirms deletion
        onClose={() => setIsConfirmDialogOpen(false)}
        message="Are you sure you want to delete this Field?"
      />
    </div>
  );
}
