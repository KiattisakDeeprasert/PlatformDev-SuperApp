import { SpecialTable } from "@/utils/SpecialTableTypes";
import { SpecialField } from "@/utils/SpecialFieldTypes";
import { Timeslot } from "@/utils/TimeSlotTypes";
import Modal from "@shared/components/Modal";
import { useGlobalContext } from "@shared/context/GlobalContext";
import { tAlert, tAlertType } from "@shared/utils/types/Alert";
import React, { useEffect, useState } from "react";
import { GrFormClose } from "react-icons/gr";
import { LiaCheckCircle } from "react-icons/lia";
import * as Icons from "@heroicons/react/24/outline";
interface SpecialTableFormProps {
  specialTable: SpecialTable | null;
  onSubmit: (formData: SpecialTable) => Promise<void>;
  onClose: () => void;
}

const SpecialTableForm: React.FC<SpecialTableFormProps> = ({
  specialTable,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState<SpecialTable>({
    id: "",
    field: {
      id: "",
      name: { en: "", th: "" },
      specialfieldImage: "",
      price: 0,
    },
    timeSlot: { id: "", start: "", end: "" },
    capacity: 1,
    userCurrent: 0,
    status: "free",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [specialFields, setSpecialFields] = useState<SpecialField[]>([]);
  const [timeSlots, setTimeSlots] = useState<Timeslot[]>([]);

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
    async function fetchSpecialFields() {
      try {
        const response = await fetch(
          "http://localhost:8081/api/special-field/"
        );
        const result = await response.json();
        setSpecialFields(result.data);
      } catch (error) {
        console.error("Failed to fetch special fields", error);
      }
    }

    async function fetchTimeSlots() {
      try {
        const response = await fetch("http://localhost:8081/api/time-slots/");
        const result = await response.json();
        setTimeSlots(result.data);
      } catch (error) {
        console.error("Failed to fetch time slots", error);
      }
    }

    fetchSpecialFields();
    fetchTimeSlots();
  }, []);

  useEffect(() => {
    if (specialTable) {
      setFormData(specialTable);
    }
  }, [specialTable]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    console.log("Submitting form with data:", formData);

    const dataToSubmit = {
      id: formData.id,
      field: formData.field.id,
      timeSlot: formData.timeSlot.id,
      capacity: formData.capacity,
      userCurrent: formData.userCurrent,
      status: formData.status,
    };

    if (!dataToSubmit.field || !dataToSubmit.timeSlot) {
      handleAddAlert(
        "ExclamationCircleIcon",
        "Special Field and Time Slot are required.",
        "Validate Form",
        tAlertType.WARNING
      );
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(dataToSubmit); // Pass the simplified data to onSubmit
      setFormData({
        id: "",
        field: {
          id: "",
          name: { en: "", th: "" },
          specialfieldImage: "",
          price: 0,
        },
        timeSlot: { id: "", start: "", end: "" },
        capacity: 1,
        userCurrent: 0,
        status: "free",
      });
      onClose();
    } catch (error) {
      setError("Failed to submit. Please check the form inputs.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    if (name === "specialField") {
      const selectedField = specialFields.find((field) => field.id === value);
      setFormData({
        ...formData,
        field: selectedField || {
          id: "",
          name: { en: "", th: "" },
          specialfieldImage: "",
          price: 0,
        },
      });
    } else if (name === "timeSlot") {
      const selectedTimeSlot = timeSlots.find((slot) => slot.id === value);
      setFormData({
        ...formData,
        timeSlot: selectedTimeSlot || { id: "", start: "", end: "" },
      });
    } else if (name === "capacity" || name === "userCurrent") {
      setFormData({ ...formData, [name]: Number(value) });
    } else if (name === "status") {
      setFormData({ ...formData, status: value as "free" | "full" });
    }
  };

  return (
    <Modal
      isOpen={true}
      title={specialTable ? "Edit Special Table" : "Create Special Table"}
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
        <label className="block font-medium text-gray-500">Special Field</label>
        <select
          name="specialField"
          value={formData.field.id || ""}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        >
          <option value="" disabled>
            Select a Special Field
          </option>
          {specialFields.map((field) => (
            <option key={field.id} value={field.id}>
              {field.name.en}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2 mt-2">
        <label className="block font-medium text-gray-500">Time Slot</label>
        <select
          name="timeSlot"
          value={formData.timeSlot.id || ""}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        >
          <option value="" disabled>
            Select a Time Slot
          </option>
          {timeSlots.map((slot) => (
            <option key={slot.id} value={slot.id}>
              {slot.start} - {slot.end}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2 mt-2">
        <label className="block font-medium text-gray-500">Capacity</label>
        <input
          type="number"
          name="capacity"
          value={formData.capacity || ""}
          onChange={handleChange}
          required
          min={1}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2 mt-2 mb-[-1rem]">
        <label className="block font-medium text-gray-500">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        >
          <option value="free">Free</option>
          <option value="full">Full</option>
        </select>
      </div>
    </Modal>
  );
};

export default SpecialTableForm;
