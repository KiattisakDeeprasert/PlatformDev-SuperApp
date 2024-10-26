"server client";
import Modal from "@shared/components/Modal";
import { useGlobalContext } from "@shared/context/GlobalContext";
import React, { useEffect, useState } from "react";
import { GrFormClose } from "react-icons/gr";
import { LiaCheckCircle } from "react-icons/lia";
import * as Icons from "@heroicons/react/24/outline";
import { tAlert, tAlertType } from "@shared/utils/types/Alert";
import { Sport } from "@/utils/SportTypes";

interface SportFormProps {
  sport: Sport | null;
  onSubmit: (formData: Sport) => Promise<void>;
  onClose: () => void;
}

const SportForm: React.FC<SportFormProps> = ({ sport, onSubmit, onClose }) => {
  const [formData, setFormData] = useState<Sport>({
    id: "",
    name: {
      en: "",
      th: "",
    },
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
    if (sport) {
      setFormData(sport);
    }
  }, [sport]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!formData.name.en) {
      handleAddAlert(
        "ExclamationCircleIcon",
        "English sport Missing",
        "English sport is required",
        tAlertType.WARNING
      );
      setIsSubmitting(false);
      return;
    }

    if (!formData.name.th) {
      handleAddAlert(
        "ExclamationCircleIcon",
        "Thai sport Missing",
        "Thai sport is required",
        tAlertType.WARNING
      );
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit({
        id: sport?.id || "",
        name: {
          en: formData.name.en,
          th: formData.name.th,
        },
      });

      setFormData({
        id: "",
        name: {
          en: "",
          th: "",
        },
      });
      onClose();
    } catch (error) {
      handleAddAlert(
        "XCircleIcon",
        "Submission Error",
        "Failed to submit sport. Please check the form inputs.",
        tAlertType.ERROR
      );
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    // Check if the name corresponds to the expected format
    if (name in formData.name) {
      setFormData(prevData => ({
        ...prevData,
        name: {
          ...prevData.name,
          [name]: value, // Directly set the value for the corresponding language key
        },
      }));
    }
  };

  return (
    <Modal
      isOpen={true}
      title={sport ? "Edit Form" : "Create Form"}
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
      <div className="space-y-2 mb-2">
        <label className="block font-medium">English Sport</label>
        <input
          type="text"
          name="en"
          value={formData.name.en}
          onChange={handleChange}
          placeholder="Enter english sport"
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Thai Sport</label>
        <input
          type="text"
          name="th"
          value={formData.name.th}
          onChange={handleChange}
          placeholder="Enter thai sport"
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        />
      </div>
    </Modal>
  );
};

export default SportForm;
