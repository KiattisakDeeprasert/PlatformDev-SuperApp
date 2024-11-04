import { FieldTimeSlot } from "@/utils/FieldTimeSlotTypes";
import { BsTrashFill } from "react-icons/bs";
import { LiaPenFancySolid } from "react-icons/lia";

interface FieldTimeSlotTableProps {
  fieldTimeSlots: FieldTimeSlot[];
  onEdit: (fieldTimeSlot: FieldTimeSlot) => void;
  onDelete: (fieldTimeSlotId: string) => void;
}

export default function FieldTimeSlotTable({
  fieldTimeSlots,
  onEdit,
  onDelete,
}: FieldTimeSlotTableProps) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-6 py-3 text-center">Sport Name (EN)</th>
            <th className="px-6 py-3 text-center">Sport Name (TH)</th>
            <th className="px-6 py-3 text-center">Capacity</th>
            <th className="px-6 py-3 text-center">Time Slot</th>
            <th className="px-6 py-3 text-center">Status</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {fieldTimeSlots.map((slot, index) => (
            <tr key={slot.id || index} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4 text-center">
                {slot.field && slot.field.type && slot.field.type.name ? (
                  <>{slot.field.type.name.en || "No Data"}</>
                ) : (
                  "No Data"
                )}
              </td>
              <td className="px-6 py-4 text-center">
                {slot.field && slot.field.type && slot.field.type.name ? (
                  <>{slot.field.type.name.th || "No Data"}</>
                ) : (
                  "No Data"
                )}
              </td>
              <td className="px-6 py-4 text-center">
                {" "}
                {slot.field?.capacity || "No Data"}
              </td>
              <td className="px-6 py-4 text-center">
                {slot.timeSlot?.start} - {slot.timeSlot?.end || "No Data"}
              </td>
              <td className="px-6 py-4 text-center">
                {slot.status ? (
                  <span
                    className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded 
                      ${
                        slot.status === "free"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : slot.status === "reserve"
                          ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                          : slot.status === "in use"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {slot.status}
                  </span>
                ) : (
                  "No Data"
                )}
              </td>
              <td className="px-6 py-4 flex space-x-2 text-center justify-center">
                <button
                  onClick={() => onEdit(slot)}
                  className="bg-white text-black px-2 py-2 rounded-full border border-gray"
                >
                  <LiaPenFancySolid className="size-5" />
                </button>
                <button
                  onClick={() => slot.id && onDelete(slot.id)}
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
