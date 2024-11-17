"use client";
import PaymentForm from "@/components/Payment/PaymentForm";
import PaymentTable from "@/components/Payment/PaymentTable";
import { Payment } from "@/utils/PaymentTypes";
import * as Icons from "@heroicons/react/24/outline";
import { useGlobalContext } from "@shared/context/GlobalContext";
import { tAlert, tAlertType } from "@shared/utils/types/Alert";
import { useEffect, useState } from "react";

const apiUrl = "http://localhost:8081/api/payments";

async function fetchPayments(): Promise<Payment[]> {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch payments");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    return [];
  }
}

export default function ReservationsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { addAlert } = useGlobalContext();

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = () => {
    setSelectedPayment({
      id: "",
      reservation: { id: "", user: { username: "" }, field: { price: 0 } },
      status: "pending",
      paymentImage: "",
      dateTime: new Date().toISOString(),
    }); // Default values for a new payment
    setIsModalOpen(true);
  };

  const handleEdit = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPayment(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (paymentId: string) => {
    try {
      // Handle deleting a payment (e.g., send a request to delete the payment)
      const url = `${apiUrl}/${paymentId}`;
      const response = await fetch(url, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete payment: ${errorData.message || response.statusText}`);
      }

      setPayments((prevPayments) =>
        prevPayments.filter((payment) => payment.id !== paymentId)
      );
      handleAddAlert("TrashIcon", "Payment Deleted", "The payment has been deleted successfully.", tAlertType.SUCCESS);
    } catch (error) {
      console.error("Failed to delete payment:", error);
      handleAddAlert("ExclamationCircleIcon", "Payment Error", `Error: ${error.message}`, tAlertType.ERROR);
    }
  };

  // Alert handler
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
    const fetchData = async () => {
      setLoading(true);
      const fetchedPayments = await fetchPayments();
      setPayments(fetchedPayments);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleFormSubmit = async (payment: Payment) => {
    await savePayment(payment);
    const fetchedPayments = await fetchPayments();
    setPayments(fetchedPayments);
    setIsModalOpen(false);
  };

  async function savePayment(payment: Payment) {
    try {
      const url = payment.id ? `${apiUrl}/${payment.id}` : apiUrl; // Create if no ID, else Update (PATCH)
      const method = payment.id ? "PATCH" : "POST";
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payment),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to save payment: ${errorData.message || response.statusText}`);
      }

      handleAddAlert(
        "CheckCircleIcon",
        payment.id ? "Payment Updated" : "Payment Created",
        `The payment has been ${payment.id ? "updated" : "created"} successfully.`,
        tAlertType.SUCCESS
      );
    } catch (error) {
      console.error("Failed to save payment:", error);
      handleAddAlert(
        "ExclamationCircleIcon",
        "Payment Error",
        `Error: ${error.message}`,
        tAlertType.ERROR
      );
    }
  }

  if (loading) {
    return <div>Loading payments...</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4 px-4 border-b-2">
          <h1 className="text-3xl font-bold mb-6">Payment</h1>
          <button
            className="bg-black text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white mb-6"
            onClick={handleCreate}
          >
            New Payment
          </button>
        </div>

        <div className="flex flex-wrap justify-start">
          <PaymentTable
            payments={payments}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
        {isModalOpen && selectedPayment && (
          <PaymentForm
            payment={selectedPayment}
            onSubmit={handleFormSubmit}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
}
