import Modal from "@shared/components/Modal";
import { useGlobalContext } from "@shared/context/GlobalContext";
import React, { useEffect, useState } from "react";
import { GrFormClose } from "react-icons/gr";
import { LiaCheckCircle } from "react-icons/lia";
import * as Icons from "@heroicons/react/24/outline";
import { tAlert, tAlertType } from "@shared/utils/types/Alert";
import { SpecialField } from "@/utils/SpecialFieldTypes";

interface SpecialFieldFormProps {
  specialField: SpecialField | null;
  onSubmit: (formData: FormData) => Promise<void>; // Change to FormData
  onClose: () => void;
}

const SpecialFieldForm: React.FC<SpecialFieldFormProps> = ({ specialField, onSubmit, onClose }) => {
  const [formData, setFormData] = useState<SpecialField>({
    id: "",
    name: {
      en: "",
      th: "",
    },
    specialfieldImage: "",
    price: 0,
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
    if (specialField) {
      setFormData(specialField);
      setImagePreview(specialField.specialfieldImage);
    }
  }, [specialField]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Validate that both English and Thai names are provided
    if (!formData.name.en || !formData.name.th) {
      handleAddAlert(
        "ExclamationCircleIcon",
        "Field Name Missing",
        "Both English and Thai field names are required.",
        tAlertType.WARNING
      );
      setIsSubmitting(false);
      return;
    }

    // Validate price is a positive number
    if (formData.price <= 0) {
      handleAddAlert(
        "ExclamationCircleIcon",
        "Price Invalid",
        "Please enter a valid price greater than 0.",
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
        "Please upload a special field image.",
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
    data.append("id", specialField?.id || ""); // Include the ID if editing, empty for new
    data.append("name[en]", formData.name.en);
    data.append("name[th]", formData.name.th);
    data.append("price", formData.price.toString()); // Add price to form data

    // Append image if selected
    if (imageFile) {
      data.append("specialfieldImage", imageFile); // Add image file to form data
    }

    try {
      // Call the onSubmit function to send the data
      await onSubmit(data);

      // Reset form after submission
      setFormData({ id: "", name: { en: "", th: "" }, specialfieldImage: "", price: 0 });
      setImagePreview(null);
      setImageFile(null); // Clear the selected file
      onClose(); // Close the form/modal
    } catch (error) {
      handleAddAlert(
        "XCircleIcon",
        "Submission Error",
        "Failed to submit special field. Please check the form inputs.",
        tAlertType.ERROR
      );
      console.error("Error creating special field:", error);
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
    } else if (name === "price") {
      setFormData((prevData) => ({
        ...prevData,
        price: parseFloat(value),
      }));
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        specialfieldImage: file.name, // This is for preview purposes, you can remove it if not needed
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
      title={specialField ? "Edit Special Field" : "Create Special Field"}
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
        <label className="block font-medium text-gray-500 dark:text-gray-400">English Field Name</label>
        <input
          type="text"
          name="en"
          value={formData.name.en}
          onChange={handleChange}
          placeholder="Enter English field name"
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block font-medium text-gray-500 dark:text-gray-400">Thai Field Name</label>
        <input
          type="text"
          name="th"
          value={formData.name.th}
          onChange={handleChange}
          placeholder="Enter Thai field name"
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2 mt-2 mb-[-1rem]">
        <label className="block font-medium text-gray-500 dark:text-gray-400">Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Enter price"
          min={1}
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2 mt-6 mb-[-1rem]">
        <label className="block font-medium text-gray-500 dark:text-gray-400">Special Field Image</label>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 focus:ring focus:ring-blue-200 focus:border-blue-500"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="object-cover h-full w-full" />
            ) : (
              <p className="text-center">Drag & Drop or Click to Upload</p>
            )}
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>
    </Modal>
  );
};

export default SpecialFieldForm;
