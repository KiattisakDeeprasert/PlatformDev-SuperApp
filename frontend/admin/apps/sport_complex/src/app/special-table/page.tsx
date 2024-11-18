"use client";

import { useState, useEffect } from "react";
import ConfirmDialog from "@/components/Default/Confirmdialog";
import SpecialTableForm from "@/components/SpecialTable/SpecialTableForm";
import { useGlobalContext } from "@shared/context/GlobalContext";
import { tAlertType } from "@shared/utils/types/Alert";
import { SpecialTable } from "@/utils/SpecialTableTypes";
import SpecialTableComponent from "@/components/SpecialTable/SpecialTable";

const apiUrl = "http://localhost:8081/api/special-table";

async function fetchSpecialTables(): Promise<SpecialTable[]> {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Failed to fetch special tables");
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function deleteSpecialTable(id: string): Promise<void> {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete special table");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function saveSpecialTable(
  specialTable: SpecialTable
): Promise<SpecialTable | null> {
  try {
    const method = specialTable.id ? "PATCH" : "POST";
    const url = specialTable.id ? `${apiUrl}/${specialTable.id}` : apiUrl;
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(specialTable),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to ${method === "POST" ? "create" : "update"} special table`
      );
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default function SpecialTablePage() {
  const [specialTables, setSpecialTables] = useState<SpecialTable[]>([]);
  const [selectedTable, setSelectedTable] = useState<SpecialTable | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tableToDelete, setTableToDelete] = useState<string | null>(null);

  const { addAlert } = useGlobalContext();

  useEffect(() => {
    async function loadTables() {
      try {
        const data = await fetchSpecialTables();
        setSpecialTables(data);
      } catch {
        addAlert({
          title: "Error",
          message: "Failed to fetch data",
          buttonText: "X",
          iconName: "ExclamationCircleIcon",
          type: tAlertType.ERROR,
        });
      }
    }
    loadTables();
  }, []);

  const handleAdd = () => {
    setSelectedTable(null);
    setShowForm(true);
  };

  const handleEdit = (table: SpecialTable) => {
    setSelectedTable(table);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!tableToDelete) return;
    try {
      await deleteSpecialTable(tableToDelete);
      setSpecialTables((prev) =>
        prev.filter((table) => table.id !== tableToDelete)
      );
      addAlert({
        title: "Success",
        message: "Table deleted successfully",
        buttonText: "X",
        iconName: "ExclamationCircleIcon",
        type: tAlertType.SUCCESS,
      });
    } catch {
      addAlert({
        title: "Error",
        message: "Failed to delete table",
        buttonText: "X",
        iconName: "ExclamationCircleIcon",
        type: tAlertType.ERROR,
      });
    } finally {
      setShowDeleteConfirm(false);
      setTableToDelete(null);
    }
  };

  const handleSave = async (specialTable: SpecialTable) => {
    try {
      await saveSpecialTable(specialTable);
      const data = await fetchSpecialTables();
      setSpecialTables(data);
      addAlert({
        title: "Success",
        message: "Special Table saved",
        buttonText: "X",
        iconName: "ExclamationCircleIcon",
        type: tAlertType.SUCCESS,
      });
    } catch {
      addAlert({
        title: "Error",
        message: "Failed to save table",
        buttonText: "X",
        iconName: "ExclamationCircleIcon",
        type: tAlertType.ERROR,
      });
    } finally {
      setShowForm(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold mb-6">Special Tables</h1>
          <button
            onClick={handleAdd}
            className="bg-black text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white mb-6"
          >
            Add Special Table
          </button>
        </div>
        <div className="flex flex-wrap justify-start">
          <SpecialTableComponent
            specialTables={specialTables}
            onEdit={handleEdit}
            onDelete={(id) => {
              setTableToDelete(id);
              setShowDeleteConfirm(true);
            }}
          />
        </div>

        {showForm && (
          <SpecialTableForm
            specialTable={selectedTable}
            onSubmit={handleSave}
            onClose={() => setShowForm(false)}
          />
        )}

        {showDeleteConfirm && (
          <ConfirmDialog
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={handleDelete}
            message="Are you sure you want to delete this special table?"
          />
        )}
      </div>
    </div>
  );
}
