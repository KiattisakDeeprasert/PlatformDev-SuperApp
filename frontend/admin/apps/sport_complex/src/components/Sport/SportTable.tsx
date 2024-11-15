import { Sport } from "@/utils/SportTypes";
import { BsTrashFill } from "react-icons/bs";
import { LiaPenFancySolid } from "react-icons/lia";

interface SportTableProps {
  sports: Sport[];
  onEdit: (sport: Sport) => void;
  onDelete: (sportId: string) => void;
}

export default function SportTable({
  sports,
  onEdit,
  onDelete,
}: SportTableProps) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-6 py-3 text-center">EN (English)</th>
            <th className="px-6 py-3 text-center">TH (Thai)</th>
            <th className="px-6 py-3 text-center">Image</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {sports.map((sport, index) => (
            <tr key={sport.id || index} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4 text-center">
                {sport.name.en || "No Data"}
              </td>
              <td className="px-6 py-4 text-center">
                {sport.name.th || "No Data"}
              </td>
              <td className="px-6 py-4 text-center">
                {/* Preview the sport image if it exists */}

                <img
                  src={sport.sportImage}
                  alt={sport.name.en}
                  className="w-20 h-16 object-cover mx-auto rounded"
                />
              </td>
              <td className="px-6 py-4 text-center">
                <div className="flex justify-center space-x-2">
                <button
                  onClick={() => onEdit(sport)}
                  className="bg-white text-black px-2 py-2 rounded-full border border-gray"
                >
                  <LiaPenFancySolid className="size-5" />
                </button>
                <button
                  onClick={() => sport.id && onDelete(sport.id)}
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
