import { SpecialField } from "@/utils/SpecialFieldTypes";
import { SpecialReservation } from "@/utils/SpecialReservationTypes";
import { Timeslot } from "@/utils/TimeSlotTypes";
import { User } from "@/utils/UserTypes";
import * as Icons from "@heroicons/react/24/outline";
import Modal from "@shared/components/Modal";
import { useGlobalContext } from "@shared/context/GlobalContext";
import { tAlert, tAlertType } from "@shared/utils/types/Alert";
import React, { useEffect, useState } from "react";
import { GrFormClose } from "react-icons/gr";
import { LiaCheckCircle } from "react-icons/lia";

interface SpecialReservationFormProps {
  reservation: SpecialReservation | null;
  onSubmit: (formData: SpecialReservation) => Promise<void>;
  onClose: () => void;
  fields: SpecialField[];
  user: User[];
  timeSlots: Timeslot[];
}

const SpecialReservationForm: React.FC<SpecialReservationFormProps> = ({
  reservation,
  onSubmit,
  onClose,
  fields,
  user,
  timeSlots,
}) => {
  const [formData, setFormData] = useState<SpecialReservation>({
    id: "",
    field: {
      id: "",
      name: { th: "", en: "" },
      specialfieldImage: "",
      price: 0,
    },
    timeSlot: { id: "", start: "", end: "" },
    user: { _id: "", username: "", email: "", password: "" },
    status: "pending",
    dateTime: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    if (reservation) {
      setFormData(reservation);
    }
  }, [reservation]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.user.username) {
      handleAddAlert(
        "ExclamationCircleIcon",
        "Username Missing",
        "Username is required",
        tAlertType.WARNING
      );
      setIsSubmitting(false);
      return;
    }

    if (!formData.field.id) {
      handleAddAlert(
        "ExclamationCircleIcon",
        "Field Missing",
        "Field is required",
        tAlertType.WARNING
      );
      setIsSubmitting(false);
      return;
    }

    if (!formData.timeSlot.id) {
      handleAddAlert(
        "ExclamationCircleIcon",
        "Time Slot Missing",
        "Time slot is required",
        tAlertType.WARNING
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const isEditing = !!reservation?.id;

      await onSubmit({
        id: isEditing ? reservation.id : undefined,
        user: formData.user.username,
        field: formData.field.id,
        status: formData.status,
        timeSlot: formData.timeSlot.id,
      });

      setFormData({
        id: "",
        user: { _id: "", username: "", email: "", password: "" },
        field: {
          id: "",
          name: { th: "", en: "" },
          specialfieldImage: "",
          price: 0,
        },
        timeSlot: { id: "", start: "", end: "" },
        status: "pending",
        dateTime: "",
      });
      onClose();
    } catch (error) {
      setError("Failed to submit reservation. Please check the form inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    if (name === "username") {
      setFormData({
        ...formData,
        user: { ...formData.user, username: value },
      });
    } else if (name === "field") {
      const selectedField = fields.find((field) => field.id === value);
      if (selectedField) {
        setFormData({
          ...formData,
          field: selectedField,
        });
      }
    } else if (name === "timeSlot") {
      const selectedTimeSlot = timeSlots.find((slot) => slot.id === value);
      if (selectedTimeSlot) {
        setFormData({
          ...formData,
          timeSlot: selectedTimeSlot,
        });
      }
    } else if (name === "status") {
      setFormData({
        ...formData,
        status: value as "pending" | "confirmed" | "cancelled",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <Modal
      isOpen={true}
      title={
        reservation ? "View Special Reservation" : "Create Special Reservation"
      }
      onClose={onClose}
      actions={
        <div className="flex justify-between mt-[-1rem]">
          {/* Hide the submit button for edit mode */}
          {!reservation && (
            <button
              onClick={handleSubmit}
              className="bg-black text-white px-2 py-2 rounded-full"
            >
              <LiaCheckCircle className="size-6" />
            </button>
          )}
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
        <label className="block text-gray-500 dark:text-gray-400 font-medium">
          Username
        </label>
        <input
          type="text"
          name="username"
          value={formData.user.username}
          onChange={handleChange}
          placeholder="Enter username"
          required
          disabled={!!reservation} // Disable input when editing
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2 mt-2">
        <label className="block text-gray-500 dark:text-gray-400 font-medium">
          Select Field
        </label>
        <select
          name="field"
          value={formData.field.id || ""}
          onChange={handleChange}
          required
          disabled={!!reservation} // Disable select when editing
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        >
          <option value="" disabled>
            Select a field
          </option>
          {(fields ?? []).map(
            (
              field // Ensure fields is always an array
            ) => (
              <option key={field.id} value={field.id}>
                {field.name?.en || "No name available"} - {field.price} THB
              </option>
            )
          )}
        </select>
      </div>

      <div className="space-y-2 mt-2">
        <label className="block text-gray-500 dark:text-gray-400 font-medium">
          Select Time
        </label>
        <select
          name="timeSlot"
          value={formData.timeSlot.id || ""}
          onChange={handleChange}
          required
          disabled={!!reservation} // Disable select when editing
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        >
          <option value="" disabled>
            Select a time
          </option>
          {timeSlots.map((time) => (
            <option key={time.id} value={time.id}>
              {time.start} - {time.end}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2 mt-2">
        {reservation ? (
          <>
            <label className="block text-gray-500 dark:text-gray-400 font-medium">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              disabled={!!reservation} // Disable select when editing
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
            >
              <option value="pending">pending</option>
              <option value="confirmed">confirmed</option>
              <option value="cancelled">cancelled</option>
            </select>
          </>
        ) : null}
      </div>
    </Modal>
  );
};

export default SpecialReservationForm;
