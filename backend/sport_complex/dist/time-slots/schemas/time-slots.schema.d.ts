import { HydratedDocument } from 'mongoose';
export type TimeslotDocument = HydratedDocument<Timeslot>;
export declare class Timeslot {
    start: string;
    end: string;
}
export declare const TimeslotSchema: import("mongoose").Schema<Timeslot, import("mongoose").Model<Timeslot, any, any, any, import("mongoose").Document<unknown, any, Timeslot> & Timeslot & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Timeslot, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Timeslot>> & import("mongoose").FlatRecord<Timeslot> & {
    _id: import("mongoose").Types.ObjectId;
}>;
