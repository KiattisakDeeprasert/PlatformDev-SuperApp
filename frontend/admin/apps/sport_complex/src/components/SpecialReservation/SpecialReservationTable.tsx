import { BsTrashFill } from "react-icons/bs";
import { GrView } from "react-icons/gr";
import { SpecialReservation } from "@/utils/SpecialReservationTypes";

interface SpecialReservationTableProps {
  specialReservations: SpecialReservation[];
  onEdit: (specialReservation: SpecialReservation) => void;
  onDelete: (specialReservationId: string) => void;
}

const getStatusClass = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "confirmed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

export default function SpecialReservationTable({
  specialReservations,
  onEdit,
  onDelete,
}: SpecialReservationTableProps) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-6 py-3 text-center">Username</th>
            <th className="px-6 py-3 text-center">Field Name (EN)</th>
            <th className="px-6 py-3 text-center">Field Name (TH)</th>
            <th className="px-6 py-3 text-center">Time Slot</th>
            <th className="px-6 py-3 text-center">Status</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {specialReservations.map((reservation) => (
            <tr key={reservation.id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4 text-center">
                {reservation?.user?.username}
              </td>
              <td className="px-6 py-4 text-center">
                {reservation.field.name.en}
              </td>
              <td className="px-6 py-4 text-center">
                {reservation.field.name.th}
              </td>
              <td className="px-6 py-4 text-center">
                {reservation.timeSlot.start} - {reservation.timeSlot.end}
              </td>
              <td className="px-6 py-4 text-center">
                <span
                  className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusClass(
                    reservation.status
                  )}`}
                >
                  {reservation.status.charAt(0).toUpperCase() +
                    reservation.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 flex space-x-2 text-center justify-center">
                <button
                  onClick={() => onEdit(reservation)}
                  className="bg-white text-black px-2 py-2 rounded-full border border-gray"
                >
                  <GrView className="size-5" />
                </button>
                <button
                  onClick={() => onDelete(reservation.id || "")}
                  className="bg-black text-white px-2 py-2 rounded-full border border-gray"
                >
                  <BsTrashFill className="size-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
