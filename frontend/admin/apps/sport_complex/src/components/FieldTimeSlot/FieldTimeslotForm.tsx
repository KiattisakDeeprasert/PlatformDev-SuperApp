

import { FieldTimeSlot } from "@/utils/FieldTimeSlotTypes";
import { Field } from "@/utils/FieldTypes";
import { Timeslot } from "@/utils/TimeSlotTypes";
import * as Icons from "@heroicons/react/24/outline";
import Modal from "@shared/components/Modal";
import { useGlobalContext } from "@shared/context/GlobalContext";
import { tAlert, tAlertType } from "@shared/utils/types/Alert";
import React, { useEffect, useState } from "react";
import { GrFormClose } from "react-icons/gr";
import { LiaCheckCircle } from "react-icons/lia";

interface FieldTimeSlotFormProps {
  fieldTimeSlot: FieldTimeSlot | null; // Pass null if creating a new slot
  onSubmit: (formData: FieldTimeSlot) => Promise<void>;
  onClose: () => void;
}

const FieldTimeSlotForm: React.FC<FieldTimeSlotFormProps> = ({ fieldTimeSlot, onSubmit, onClose }) => {
  const [formData, setFormData] = useState<FieldTimeSlot>({
    id: "",
    field: { id: "", capacity: 0,price: 0,status:"ready", type: { id: "", name: { th: "", en: "" } } },
    timeSlot: { id: "", start: "", end: "" },
    status: "free",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
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
    async function fetchFields() {
      try {
        const response = await fetch("http://localhost:8081/api/fields/");
        const result = await response.json();
        setFields(result.data);
      } catch (error) {
        console.error("Failed to fetch fields", error);
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

    fetchFields();
    fetchTimeSlots();
  }, []);

  useEffect(() => {
    if (fieldTimeSlot) {
      setFormData(fieldTimeSlot);
    }
  }, [fieldTimeSlot]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    console.log("Here", formData);
    
    // ตรวจสอบว่า field และ timeSlot มีค่าอยู่หรือไม่
    if (!formData.field.id || !formData.timeSlot.id) {
      handleAddAlert(
        "ExclamationCircleIcon",
        "Field or Time Slot Missing",
        "Both field and time slot are required.",
        tAlertType.WARNING
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const isEditing = !!formData.id; // ตรวจสอบว่ากำลังแก้ไขอยู่หรือไม่

      // ส่งข้อมูลในรูปแบบที่เหมาะสม
      await onSubmit({
        id: isEditing ? formData.id : undefined,
        field: formData.field.id,
        timeSlot: formData.timeSlot.id,
        status: formData.status,
      });

      setFormData({
        id: "",
        field: { id: "", capacity: 0,price: 0,status:"ready", type: { id: "", name: { th: "", en: "" } } },
        timeSlot: { id: "", start: "", end: "" },
        status: "free",
      });
      onClose(); // ปิด modal หรือ dialog
    } catch (error) {
      setError("Failed to submit. Please check the form inputs.");
      console.log(error);
      
    } finally {
      setIsSubmitting(false);
    }
};


  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (name === "field") {
      const selectedField = fields.find((field) => field.id === value);
      setFormData({
        ...formData,
        field: selectedField || { id: "", capacity: 0,price: 0,status:"ready",  type: { id: "", name: { th: "", en: "" } } },
      });
    } else if (name === "timeSlot") {
      const selectedTimeSlot = timeSlots.find((slot) => slot.id === value);
      setFormData({
        ...formData,
        timeSlot: selectedTimeSlot || { id: "", start: "", end: "" },
      });
    } else if (name === "status") {
      setFormData({ ...formData, status: value as "free" | "reserve" | "in use" });
    }
  };

  return (
    <Modal
      isOpen={true}
      title={fieldTimeSlot ? "Edit Field Time Slot" : "Create Field Time Slot"}
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
        <label className="block text-gray-700 font-medium">Select Field</label>
        <select
          name="field"
          value={formData.field.id || ""}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        >
          <option value="" disabled>
            Select a field
          </option>
          {fields.map((field) => (
            <option key={field.id} value={field.id}>
              {field.type.name.en} - {field.type.name.th}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">Select Time Slot</label>
        <select
          name="timeSlot"
          value={formData.timeSlot.id || ""}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        >
          <option value="" disabled>
            Select a time slot
          </option>
          {timeSlots.map((slot) => (
            <option key={slot.id} value={slot.id}>
              {slot.start} - {slot.end}
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
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        >
          <option value="free">Free</option>
          <option value="reserve">Reserved</option>
          <option value="in use">In Use</option>
        </select>
      </div>
    </Modal>
  );
};

export default FieldTimeSlotForm;
