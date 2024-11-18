import React, { useEffect, useState } from "react";
import Modal from "@shared/components/Modal";
import { useGlobalContext } from "@shared/context/GlobalContext";
import { tAlert, tAlertType } from "@shared/utils/types/Alert";
import { GrFormClose } from "react-icons/gr";
import * as Icons from "@heroicons/react/24/outline";
import { LiaCheckCircle } from "react-icons/lia";
import { PaymentSpecial } from "@/utils/PaymentSpecialTypes";

interface PaymentSpecialFormProps {
  payment: PaymentSpecial;
  onSubmit: (payment: PaymentSpecial) => Promise<void>;
  onClose: () => void;
}

const PaymentSpecialForm: React.FC<PaymentSpecialFormProps> = ({
  payment,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState<PaymentSpecial>({
    id: "",
    reservation: {
      id: "",
      user: { username: "", email: "", password: "" },
      field: { price: 0, name: { en: "", th: "" }, specialfieldImage: "" },
    },
    status: "pending",
    paymentImage: "",
    dateTime: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentImage, setPaymentImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
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
    if (payment) {
      setFormData(payment);
      setImagePreview(payment.paymentImage || null);
    }
  }, [payment]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        paymentImage: file.name,
      }));
      setPaymentImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.id) {
        throw new Error("Payment ID is missing for editing.");
      }

      if (!paymentImage) {
        throw new Error("Payment image is required.");
      }

      const data = new FormData();
      data.append("id", formData.id);
      data.append("paymentImage", paymentImage);
      data.append("reservationId", formData.reservation.id);
      data.append("status", formData.status);

      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error(error);
      handleAddAlert(
        "XCircleIcon",
        "Error",
        "Failed to update payment. Please try again.",
        tAlertType.ERROR
      );
      setError("Unable to update payment information. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Modal
      isOpen={true}
      title="Payment Details"
      onClose={onClose}
      actions={
        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="bg-black text-white px-2 py-2 rounded-full"
            disabled={isSubmitting}
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

      {/* Reservation ID */}
      <div className="space-y-2">
        <label className="block text-gray-500 font-medium">
          Reservation ID
        </label>
        <p className="p-2 border border-gray-300 rounded-lg">
          {formData?.reservation?.id || "N/A"}
        </p>
      </div>

      {/* Username */}
      <div className="space-y-2 mt-4">
        <label className="block text-gray-500 font-medium">Username</label>
        <p className="p-2 border border-gray-300 rounded-lg">
          {formData?.reservation?.user?.username || "N/A"}
        </p>
      </div>

      {/* Field Price */}
      <div className="space-y-2 mt-4">
        <label className="block text-gray-500 font-medium">Field Price</label>
        <p className="p-2 border border-gray-300 rounded-lg">
          {formData?.reservation?.field?.price || "N/A"}
        </p>
      </div>

      <div className="space-y-2 mt-4">
        <label className="block text-gray-500 font-medium">DateTime</label>
        <p className="p-2 border border-gray-300 rounded-lg">
          {new Date(formData.dateTime).toLocaleString()}
        </p>
      </div>

      <div className="space-y-2 mt-4">
        <label className="block text-gray-500 font-medium">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Payment Image */}
      <div className="space-y-2 mt-2 mb-[-1rem]">
        <label className="block font-medium text-gray-500">Payment Image</label>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Payment Preview"
                className="max-w-full max-h-full border rounded-lg"
              />
            ) : (
              <div className="text-center">
                <p className="text-sm">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG (Max: 5MB)</p>
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

export default PaymentSpecialForm;
