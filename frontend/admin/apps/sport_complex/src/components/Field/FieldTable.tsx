import { Timeslot } from "@/app/utils/TimeSlotTypes";

interface FieldTableProps {
  timeslots: Timeslot[];
  onEdit: (transaction: Timeslot) => void;
  onDelete: (transactionId: string) => void;
}

export default function FieldTable({
  timeslots,
  onEdit,
  onDelete,
}: FieldTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-6 py-3 text-center">Start</th>
            <th className="px-6 py-3 text-center">End</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {timeslots.map((timeslot) => {
           
            return (
              <tr key={timeslot.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-center">{timeslot.start||"-"}</td>
                <td className="px-6 py-4 text-center">{timeslot.end||"-"}</td>
                <td className="px-6 py-4 flex space-x-2 text-center justify-center">
                  <button
                    onClick={() => onEdit(timeslot)}
                    className="bg-white text-black px-2 py-2 rounded-full border border-gray"
                  >
                   
                  </button>
                  <button
                    onClick={() => timeslot.id && onDelete(timeslot.id)}
                    className="bg-black text-white px-2 py-2 rounded-full border border-gray"
                  >
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