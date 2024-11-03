"server client";

import { Field } from "@/utils/FieldTypes";
import { Sport } from "@/utils/SportTypes";
import * as Icons from "@heroicons/react/24/outline";
import Modal from "@shared/components/Modal";
import { useGlobalContext } from "@shared/context/GlobalContext";
import { tAlert, tAlertType } from "@shared/utils/types/Alert";
import React, { useEffect, useState } from "react";
import { GrFormClose } from "react-icons/gr";
import { LiaCheckCircle } from "react-icons/lia";

interface FieldFormProps {
  field: Field | null;
  onSubmit: (formData: Field) => Promise<void>;
  onClose: () => void;
  types: Sport[];
}

const FieldForm: React.FC<FieldFormProps> = ({ field, onSubmit, onClose }) => {
  const [formData, setFormData] = useState<Field>({
    id: "",
    capacity: 0,
    status: "ready",
    price: 0,
    type: { id: "", name: { th: "", en: "" } },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [types, setTypes] = useState<Sport[]>([]);

  const { addAlert } = useGlobalContext();
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

  useEffect(() => {
    async function fetchRoomTypes() {
      try {
        const response = await fetch("http://localhost:8081/api/sports");
        const result = await response.json();
        console.log("Fetched sport:", result.data);
        setTypes(result.data);
      } catch (error) {
        console.error("Failed to fetch sport", error);
      }
    }
    fetchRoomTypes();
  }, []);

  useEffect(() => {
    if (field) {
      setFormData(field);
    }
  }, [field]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.capacity) {
      handleAddAlert(
        "ExclamationCircleIcon",
        "Room Missing",
        "Room is required",
        tAlertType.WARNING
      );
      setIsSubmitting(false);
      return;
    }

    if (!formData.price) {
      handleAddAlert(
        "ExclamationCircleIcon",
        "Floor Missing",
        "Floor is required",
        tAlertType.WARNING
      );
      setIsSubmitting(false);
      return;
    }

    if (!formData.status) {
      handleAddAlert(
        "ExclamationCircleIcon",
        "Status Missing",
        "Status is required",
        tAlertType.WARNING
      );
      setIsSubmitting(false);
      return;
    }

    if (!formData.type.id) {
      handleAddAlert(
        "ExclamationCircleIcon",
        "Floor Missing",
        "Floor is required",
        tAlertType.WARNING
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const isEditing = !!field?.id;

      await onSubmit({
        id: isEditing ? field.id : undefined,
        capacity: formData.capacity,
        price: formData.price,
        status: formData.status,
        type: formData.type.id,
      } as any);

      setFormData({
        id: "",
        capacity: 0,
        price: 0,
        status: "ready",
        type: { id: "", name: { th: "", en: "" } },
      });
      onClose();
    } catch (error) {
      setError("Failed to submit room. Please check the form inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    if (name === "type") {
      // Assuming types is an array of Sport objects as per your context
      const selectedType = types.find((type) => type.id === value);
      setFormData({
        ...formData,
        type: selectedType
          ? { id: selectedType.id, name: selectedType.name }
          : { id: "", name: { th: "", en: "" } },
      });
    } else if (name === "capacity") {
      setFormData({
        ...formData,
        capacity: Number(value),
      });
    } else if (name === "price") {
      setFormData({
        ...formData,
        price: Number(value),
      });
    } else if (name === "status") {
      setFormData({
        ...formData,
        status: value as "ready" | "not ready", // Ensures type safety for status
      });
    }
  };

  return (
    <Modal
      isOpen={true}
      title={field ? "Edit Form" : "Create Form"}
      onClose={onClose}
      actions={
        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="bg-black text-white px-2 py-2 rounded-full"
          >
            <LiaCheckCircle className="size-6" />
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-2 py-2 rounded-full ml-6"
          >
            <GrFormClose className="size-6" />
          </button>
        </div>
      }
    >
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">Capacity</label>
        <input
          type="number"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          placeholder="Enter room"
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Enter floor"
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">Select Type</label>
        <select
          name="type"
          value={formData.type.id || ""}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        >
          <option value="" disabled>
            Select a room
          </option>
          {types.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name.en} - {type.name.th}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ri ng focus:ring-blue-200 focus:border-blue-500"
        >
          <option value="">Select status</option>
          <option value="ready">ready</option>
          <option value="not ready">not ready</option>
        </select>
      </div>
    </Modal>
  );
};

export default FieldForm;
