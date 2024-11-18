import { SpecialTable } from "@/utils/SpecialTableTypes";
import { BsTrashFill } from "react-icons/bs";
import { LiaPenFancySolid } from "react-icons/lia";

interface SpecialTableProps {
  specialTables: SpecialTable[];
  onEdit: (specialTable: SpecialTable) => void;
  onDelete: (specialTableId: string) => void;
}

export default function SpecialTableComponent({
  specialTables,
  onEdit,
  onDelete,
}: SpecialTableProps) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-6 py-3 text-center">Special Field (EN)</th>
            <th className="px-6 py-3 text-center">Special Field (TH)</th>
            <th className="px-6 py-3 text-center">Time Slot</th>
            <th className="px-6 py-3 text-center">Capacity</th>
            <th className="px-6 py-3 text-center">Current Users</th>
            <th className="px-6 py-3 text-center">Status</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {specialTables.map((slot, index) => (
            <tr key={slot.id || index} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4 text-center">
                {slot.field?.name?.en || "No Data"}
              </td>
              <td className="px-6 py-4 text-center">
                {slot.field?.name?.th || "No Data"}
              </td>
              <td className="px-6 py-4 text-center">
                {slot.timeSlot
                  ? `${slot.timeSlot.start} - ${slot.timeSlot.end}`
                  : "No Data"}
              </td>
              <td className="px-6 py-4 text-center">
                {slot.capacity || "No Data"}
              </td>
              <td className="px-6 py-4 text-center">
                {slot.userCurrent || 0}
              </td>
              <td className="px-6 py-4 text-center">
                {slot.status ? (
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded 
                      ${
                        slot.status === "free"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                  >
                    {slot.status}
                  </span>
                ) : (
                  "No Data"
                )}
              </td>
              <td className="px-6 py-4 text-center">
              <div className="flex justify-center space-x-2">
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
              </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
