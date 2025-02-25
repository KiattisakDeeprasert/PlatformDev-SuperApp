"use client";
import { useEffect, useState } from "react";
import { Payment } from "@/utils/PaymentTypes";
import * as Icons from "@heroicons/react/24/outline";
import { useGlobalContext } from "@shared/context/GlobalContext";
import { tAlert, tAlertType } from "@shared/utils/types/Alert";
import PaymentTable from "@/components/Payment/PaymentTable";
import PaymentForm from "@/components/Payment/PaymentForm";

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

export default function PaymentPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { addAlert } = useGlobalContext();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCloseModal = () => {
    setSelectedPayment(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (paymentId: string) => {
    try {
      const url = `${apiUrl}/${paymentId}`;
      const response = await fetch(url, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to delete payment: ${
            errorData.message || response.statusText
          }`
        );
      }

      setPayments((prevPayments) =>
        prevPayments.filter((payment) => payment.id !== paymentId)
      );
      handleAddAlert(
        "TrashIcon",
        "Payment Deleted",
        "The payment has been deleted successfully.",
        tAlertType.SUCCESS
      );
    } catch (error) {
      console.error("Failed to delete payment:", error);
      handleAddAlert(
        "ExclamationCircleIcon",
        "Payment Error",
        `Error deleting payment.`,
        tAlertType.ERROR
      );
    }
  };

  // Add Alert
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
  const handleFormSubmit = async (data: FormData) => {
    try {
      const url = selectedPayment ? `${apiUrl}/${selectedPayment.id}` : apiUrl;
      const response = await fetch(url, {
        method: "PATCH",
        body: data,
      });

      if (!response.ok) {
        throw new Error("Failed to save payment");
      }

      const updatedPayment = await response.json();
      setPayments((prevPayments) =>
        selectedPayment
          ? prevPayments.map((payment) =>
              payment.id === updatedPayment.id ? updatedPayment : payment
            )
          : [...prevPayments, updatedPayment]
      );

      handleAddAlert(
        "CheckCircleIcon",
        selectedPayment ? "Payment Updated" : "Payment Created",
        `The payment has been ${
          selectedPayment ? "updated" : "created"
        } successfully.`,
        tAlertType.SUCCESS
      );
    } catch (error) {
      console.error("Error submitting payment:", error);
      handleAddAlert(
        "ExclamationCircleIcon",
        "Payment Error",
        `Error`,
        tAlertType.ERROR
      );
    }
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

  const handleEdit = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };
  const filteredPayments = payments.filter((payment) => {
    return (
      payment.reservation?.user?.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.reservation?.field?.price.toString().includes(searchTerm)
    );
  });
  // Loading state
  if (loading) {
    return <div>Loading payments...</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4 px-4 border-b-2">
          <h1 className="text-3xl font-bold mb-6">Payment Management</h1>
          <input
            type="text"
            placeholder="Search "
            className="px-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table to display payments */}
        <PaymentTable
          payments={payments}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Payment Form Modal */}
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
