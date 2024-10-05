"use server";
import Patient from "@/models/Patient";
import mongoose from "mongoose";
import { connectDB } from "@/db";
mongoose.connect("mongodb://127.0.0.1:27017/doctor_on_go");
const bcrypt = require("bcryptjs");

// export const isPatientRegistered = async (email: string) => {
//   const patient = await Patient.findOne({ email });
//   console.log(patient)

//   if (!patient) {
//     return { isRegistered: false, isPartiallyRegistered: false, _id: null };
//   }

//   // Check if the patient is partially registered (e.g., missing some required fields)
//   const isPartiallyRegistered = !patient.birthDate || !patient.address || !patient.occupation;

//   return {
//     isRegistered: !isPartiallyRegistered, // Fully registered if all required fields are filled
//     isPartiallyRegistered,
//     _id: patient._id,
//   };
// };

export const updatePatientPassword = async (
  patientId: string,
  newPassword: string
) => {
  await connectDB(); // Ensure the database connection is established

  try {
    // Find the patient by their ID
    const patient = await Patient.findById(patientId);

    if (!patient) {
      throw new Error("Patient not found");
    }

    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the patient's password field
    patient.password = hashedPassword;

    // Save the updated patient record
    await patient.save();

    return { success: true, message: "Password updated successfully" };
  } catch (error) {
    console.error("Error updating patient password:", error);
    throw new Error("Failed to update patient password");
  }
};

export const verifyPatientPassword = async (
  patientId: string,
  enteredPassword: string
): Promise<boolean> => {
  await connectDB(); // Ensure database connection

  try {
    // Find the patient by their ID
    const patient = await Patient.findById(patientId);

    if (!patient) {
      throw new Error("Patient not found");
    }

    // Check if the patient has a password set
    if (!patient.password) {
      throw new Error("No password set for this patient");
    }

    // Compare the entered password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(
      enteredPassword,
      patient.password
    );

    return isPasswordValid; // Return true if password matches, false otherwise
  } catch (error) {
    console.error("Error verifying patient password:", error);
    throw new Error("Failed to verify password");
  }
};

export const isPatientRegistered = async (email: string) => {
  try {
    // Find the patient in the database by email
    const patient = await Patient.findOne({ email }); // Using lean() for plain JS object
    console.log("This is a patient:", patient);

    if (!patient) {
      return { isRegistered: false, isPartiallyRegistered: false, _id: null };
    }

    // Log the patient data to verify what is returned
    console.log("Patient found:", patient);

    // Check if the patient is partially registered (e.g., missing required fields)
    const isPartiallyRegistered =
      !patient.registeredDetails.birthDate ||
      !patient.registeredDetails.address ||
      !patient.registeredDetails.occupation;

    //console.log("Is partially registered:", isPartiallyRegistered);

    // If all required fields are filled, consider the patient fully registered
    return {
      isRegistered: !isPartiallyRegistered, // Fully registered if all required fields are present
      isPartiallyRegistered,
      _id: patient._id, // Return the patient ID for routing
    };
  } catch (error) {
    console.error("Error checking patient registration:", error);
    throw new Error("Failed to check registration status");
  }
};

export const createPatient = async (data: {
  name: string;
  email: string;
  phone: string;
}): Promise<{ _id: string }> => {
  await connectDB();
  try {
    // Log the data received from the frontend
    console.log("Received data:", data); // For debugging

    // Ensure that the data has `name`, `email`, and `phone` fields
    if (!data.name || !data.email || !data.phone) {
      throw new Error("Missing required fields: name, email, or phone");
    }

    // Create and save a new patient in the database
    const newPatient = new Patient(data);
    await newPatient.save();

    // Return the newly created patient's _id
    return { _id: newPatient._id.toString() }; // Convert ObjectId to string
  } catch (error) {
    console.error("Error creating patient:", error);
    throw new Error("Error creating patient");
  }
};

export const getPatientById = async (userId: string) => {
  await connectDB(); // Ensure the DB connection

  try {
    const patient = await Patient.findById(userId);
    if (!patient) {
      throw new Error("Patient not found");
    }
    return patient; // Return patient details
  } catch (error) {
    console.error("Error fetching patient:", error);
    throw new Error("Error fetching patient");
  }
};

export const registerPatient = async (
  userId: string,
  registrationData: any
) => {
  await connectDB();

  try {
    // Find the patient by userId
    const patient = await Patient.findById(userId);
    if (!patient) {
      throw new Error("Patient not found");
    }

    // Update the embedded registeredDetails field
    patient.registeredDetails = registrationData;

    // Save the updated patient document
    await patient.save();

    // Convert the Mongoose document to a plain JavaScript object
    const plainPatient = patient.toObject();

    return plainPatient; // Return the plain object to be passed to the client
  } catch (error) {
    console.error("Error registering patient:", error);
    throw new Error("Error registering patient");
  }
};
