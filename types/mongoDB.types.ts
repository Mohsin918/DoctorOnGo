import { Document, Types } from 'mongoose';

// Enums for Gender and Status
export type Gender = 'male' | 'female' | 'other';
export type Status = 'pending' | 'scheduled' | 'completed';

// Patient Interface
export interface Patient extends Document {
  _id: Types.ObjectId;
  userId: string;
  name: string;
  email: string;
  phone: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  allergies?: string;
  currentMedication?: string;
  familyMedicalHistory?: string;
  pastMedicalHistory?: string;
  appointments: Types.ObjectId[]; // Array of appointment IDs (referencing Appointment)
}

// Appointment Interface
export interface Appointment extends Document {
  // _id: Types.ObjectId;
  _id: string;
  patient: Types.ObjectId | Patient; // References Patient
  schedule: Date;
  status: Status;
  doctor: string;
  reason: string;
  note?: string;
  userId: string;
  cancellationReason?: string;
}
