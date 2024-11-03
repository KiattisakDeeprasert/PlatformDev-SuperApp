'use client'

// const apiUrl = "http://localhost:8081/api/field-timeslots";
// async function fetchFieldTimeslot(): Promise<Fieldtimeslot[]> {
//     try {
//       const response = await fetch(apiUrl);
//       if (!response.ok) {
//         throw new Error("Failed to fetch field-timeslots");
//       }
//       const result = await response.json();
//       return result.data;
//     } catch (error) {
//       console.error(error);
//       return [];
//     }
//   }

export default function FieldTimeSlotPage(){
    return(
        <div className="min-h-screen p-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4 px-4 border-b-2">
            <h1 className="text-3xl font-bold mb-6">Field - Time slot</h1>
            <button
              className="bg-black text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white mb-6"
            >
              New Field Timeslot
            </button>
          </div>
          <div className="flex flex-wrap justify-start">
            
          </div>
  
        </div>
        
      </div>
    )
}