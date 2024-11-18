import { SpecialField } from "@/utils/SpecialFieldTypes"; // Assuming you have this type file
import { BsTrashFill } from "react-icons/bs";
import { LiaPenFancySolid } from "react-icons/lia";

interface SpecialFieldTableProps {
  specialFields: SpecialField[];
  onEdit: (specialField: SpecialField) => void;
  onDelete: (specialFieldId: string) => void;
}

export default function SpecialFieldTable({
  specialFields,
  onEdit,
  onDelete,
}: SpecialFieldTableProps) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-6 py-3 text-center">EN (English)</th>
            <th className="px-6 py-3 text-center">TH (Thai)</th>
            <th className="px-6 py-3 text-center">Image</th>
            <th className="px-6 py-3 text-center">Price</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {specialFields.map((specialField, index) => (
            <tr
              key={specialField.id || index}
              className="border-b hover:bg-gray-50"
            >
              <td className="px-6 py-4 text-center">
                {specialField.name.en || "No Data"}
              </td>
              <td className="px-6 py-4 text-center">
                {specialField.name.th || "No Data"}
              </td>
              <td className="px-6 py-4 text-center">
                {/* Preview the special field image if it exists */}
                {specialField.specialfieldImage ? (
                  <img
                    src={specialField.specialfieldImage}
                    alt={specialField.name.en}
                    className="w-20 h-16 object-cover mx-auto rounded"
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td className="px-6 py-4 text-center">
                {specialField.price || "No Data"}
              </td>
              <td className="px-6 py-4 text-center">
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => onEdit(specialField)}
                    className="bg-white text-black px-2 py-2 rounded-full border border-gray"
                  >
                    <LiaPenFancySolid className="size-5" />
                  </button>
                  <button
                    onClick={() => specialField.id && onDelete(specialField.id)}
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
