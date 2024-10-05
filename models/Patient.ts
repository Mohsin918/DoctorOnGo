"use server";
import mongoose from "mongoose";

// Define the embedded RegisteredPatient schema
const registeredPatientSchema = new mongoose.Schema({
  birthDate: Date,
  gender: String,
  address: String,
  occupation: String,
  emergencyContactName: String,
  emergencyContactNumber: String,
  allergies: String,
  currentMedication: String,
  familyMedicalHistory: String,
  pastMedicalHistory: String,
});

// Define the Patient schema with embedded registered details
const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: false },
    registeredDetails: registeredPatientSchema, // Embedding registration details
  },
  { timestamps: true }
);

// Creating the Patient model
const Patient =
  mongoose.models.Patient || mongoose.model("Patient", patientSchema);

export default Patient;
