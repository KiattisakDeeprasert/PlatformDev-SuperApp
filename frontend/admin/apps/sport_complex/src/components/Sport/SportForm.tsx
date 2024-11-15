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
  onSubmit: (formData: FormData) => Promise<void>; // Change to FormData
  onClose: () => void;
}

const SportForm: React.FC<SportFormProps> = ({ sport, onSubmit, onClose }) => {
  const [formData, setFormData] = useState<Sport>({
    id: "",
    name: {
      en: "",
      th: "",
    },
    sportImage: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null); // Track image file

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
      setImagePreview(sport.sportImage);
    }
  }, [sport]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Log the form data for troubleshooting
    console.log("Submitting form data:", formData);

    // Validate that both English and Thai sport names are provided
    if (!formData.name.en || !formData.name.th) {
      handleAddAlert(
        "ExclamationCircleIcon",
        "Sport Name Missing",
        "Both English and Thai sport names are required.",
        tAlertType.WARNING
      );
      setIsSubmitting(false);
      return;
    }
    // Validate image file is selected
    if (!imageFile) {
      handleAddAlert(
        "ExclamationCircleIcon",
        "Image Missing",
        "Please upload a sport image.",
        tAlertType.WARNING
      );
      setIsSubmitting(false);
      return;
    }
    // Validate image file type (only images allowed)
    if (imageFile && !imageFile.type.startsWith("image/")) {
      handleAddAlert(
        "ExclamationCircleIcon",
        "Invalid Image Type",
        "Please upload a valid image file (e.g., PNG, JPG).",
        tAlertType.WARNING
      );
      setIsSubmitting(false);
      return;
    }

    // Validate image size (optional, e.g., 5MB max)
    if (imageFile && imageFile.size > 5 * 1024 * 1024) {
      handleAddAlert(
        "ExclamationCircleIcon",
        "Image Too Large",
        "Please upload an image smaller than 5MB.",
        tAlertType.WARNING
      );
      setIsSubmitting(false);
      return;
    }

    const data = new FormData();
    data.append("id", sport?.id || ""); // Include the ID if editing, empty for new
    data.append("name[en]", formData.name.en);
    data.append("name[th]", formData.name.th);

    // Append image if selected
    if (imageFile) {
      data.append("sportImage", imageFile); // Add image file to form data
    }

    try {
      // Call the onSubmit function to send the data
      await onSubmit(data);

      // Show success alert
      handleAddAlert(
        "CheckCircleIcon",
        "Success",
        "Sport submitted successfully.",
        tAlertType.SUCCESS
      );

      // Reset form after submission
      setFormData({ id: "", name: { en: "", th: "" }, sportImage: "" });
      setImagePreview(null);
      setImageFile(null); // Clear the selected file
      onClose(); // Close the form/modal
    } catch (error) {
      handleAddAlert(
        "XCircleIcon",
        "Submission Error",
        "Failed to submit sport. Please check the form inputs.",
        tAlertType.ERROR
      );
      console.error("Error creating sport:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name in formData.name) {
      setFormData((prevData) => ({
        ...prevData,
        name: {
          ...prevData.name,
          [name]: value,
        },
      }));
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        sportImage: file.name, // This is for preview purposes, you can remove it if not needed
      }));
      setImageFile(file); // Save the actual file
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string); // Set preview image
      };
      reader.readAsDataURL(file);
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
      <div className="space-y-2 mt-2">
        <label className="block font-medium">Sport Image</label>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 focus:ring focus:ring-blue-200 focus:border-blue-500"
          >
            {imagePreview ? (
              <div className="w-full h-full flex justify-center items-center overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Sport Image Preview"
                  className=" max-w-full max-h-full border border-gray-300 rounded-lg"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  SVG, PNG, JPG, or GIF (MAX. 800x400px)
                </p>
              </div>
            )}
            <input
              id="dropzone-file"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </Modal>
  );
};

export default SportForm;
