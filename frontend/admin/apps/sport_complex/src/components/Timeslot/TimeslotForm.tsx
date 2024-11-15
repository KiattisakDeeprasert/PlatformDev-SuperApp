"server client";
import Modal from "@shared/components/Modal";
import { useGlobalContext } from "@shared/context/GlobalContext";
import React, { useEffect, useState } from "react";
import { GrFormClose } from "react-icons/gr";
import { LiaCheckCircle } from "react-icons/lia";
import * as Icons from "@heroicons/react/24/outline";
import { tAlert, tAlertType } from "@shared/utils/types/Alert";
import { Timeslot } from "@/utils/TimeSlotTypes";

interface TimeslotFormProps {
  timeslot: Timeslot | null;
  onSubmit: (formData: Timeslot) => Promise<void>;
  onClose: () => void;
}

const TransactionForm: React.FC<TimeslotFormProps> = ({
  timeslot,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState<Timeslot>({
    id: "",
    start: "",
    end: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (timeslot) {
      setFormData(timeslot);
    }
  }, [timeslot]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
     
     if (formData.start.includes(".")) {
      handleAddAlert(
        "ExclamationCircleIcon",
        "Invalid Start Time",
        "Please do not use '.' in the time format. Use ':' instead. For example: '07:00'.",
        tAlertType.WARNING
      );
      setIsSubmitting(false);
      return;
    }

    if (formData.end.includes(".")) {
      handleAddAlert(
        "ExclamationCircleIcon",
        "Invalid End Time",
        "Please do not use '.' in the time format. Use ':' instead. For example: '07:00'.",
        tAlertType.WARNING
      );
      setIsSubmitting(false);
      return;
    }
    if (!formData.start) {
      handleAddAlert(
        "ExclamationCircleIcon",
        "Start Time Missing",
        "Start time is required",
        tAlertType.WARNING
      );
      setIsSubmitting(false);
      return;
    }

    if (!formData.end) {
      handleAddAlert(
        "ExclamationCircleIcon",
        "End Time Missing",
        "End time is required",
        tAlertType.WARNING
      );
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit({
        id: timeslot?.id || "",
        start: formData.start,
        end: formData.end,
      });

      setFormData({
        id: "",
        start: "",
        end: "",
      });
      onClose();
    } catch (error) {
      handleAddAlert(
        "XCircleIcon",
        "Submission Error",
        "Failed to submit timeslot. Please check the form inputs.",
        tAlertType.ERROR
      );
      console.log(error);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Modal
      isOpen={true}
      title={timeslot ? "Edit Form" : "Create Form"}
      onClose={onClose}
      actions={
        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="bg-black text-white px-2 py-2 rounded-full"
            disabled={isSubmitting}
          >
            <LiaCheckCircle className="size-6" />
            {isSubmitting && <span>Submitting...</span>}
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
      <div className="space-y-2">
        <label className="block font-medium">Start</label>
        <input
          type="text"
          name="start"
          value={formData.start}
          onChange={handleChange}
          placeholder="Enter start time"
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2 mt-2">
        <label className="block font-medium">End</label>
        <input
          type="text"
          name="end"
          value={formData.end}
          onChange={handleChange}
          placeholder="Enter end time"
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        />
      </div>
      <div className="space-y-2 mt-2 mb-[-2rem]">
      <label className="block font-thin text-gray-500 dark:text-gray-400">** Please enter the time using the symbol &quot; : &quot; . Do not enter &quot; . &quot; For example: &quot; 07:00 &quot; **</label>
      </div>
    </Modal>
  );
};

export default TransactionForm;
