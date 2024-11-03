import { Field } from "@/utils/FieldTypes";
import { BsTrashFill } from "react-icons/bs";
import { LiaPenFancySolid } from "react-icons/lia";

interface FieldTableProps {
  fields: Field[];
  onEdit: (field: Field) => void;
  onDelete: (fieldId: string) => void;
}

export default function FieldTable({
  fields,
  onEdit,
  onDelete,
}: FieldTableProps) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-6 py-3 text-center">Sport</th>
            <th className="px-6 py-3 text-center">Capacity</th>
            <th className="px-6 py-3 text-center">Price</th>
            <th className="px-6 py-3 text-center">Status</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {fields.map((field) => {
            return (
              <tr key={field.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-center">
                  {typeof field.type === "object" ? field.type.name.en : field.type || "-"}
                </td>
                <td className="px-6 py-4 text-center">
                  {typeof field.capacity === "object" ? field.capacity : field.capacity || "-"}
                </td>
                <td className="px-6 py-4 text-center">
                  {typeof field.price === "object" ? field.price : field.price || "-"}
                </td>
                <td className="px-6 py-4 text-center">
                  {field.status === "ready" ? (
                    <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                      Ready
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                      Not Ready
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 flex space-x-2 text-center justify-center">
                  <button
                    onClick={() => onEdit(field)}
                    className="bg-white text-black px-2 py-2 rounded-full border border-gray"
                  >
                    <LiaPenFancySolid className="size-5" />
                  </button>
                  <button
                    onClick={() => field.id && onDelete(field.id)}
                    className="bg-black text-white px-2 py-2 rounded-full border border-gray"
                  >
                      <BsTrashFill className="size-5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
