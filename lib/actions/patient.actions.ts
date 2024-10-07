"use server";
import Patient from "@/models/Patient";
import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing and comparison
import jwt from "jsonwebtoken";

import { connectDB } from "@/db";

mongoose.connect("mongodb://127.0.0.1:27017/doctor_on_go");

const JWT_SECRET = "jsonwebtoken_secret_key";

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
      !patient.registeredDetails ||
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

// Generate JWT Token
const generateJWTToken = (patientId: string) => {
  return jwt.sign({ id: patientId }, JWT_SECRET, { expiresIn: "1h" }); // Token valid for 1 hour
};

// Create a new patient and hash the password
export const createPatient = async (data: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): Promise<{ _id: string }> => {
  await connectDB();
  try {
    // Ensure that the data has name, email, phone, and password fields
    if (!data.name || !data.email || !data.phone || !data.password) {
      throw new Error(
        "Missing required fields: name, email, phone, or password"
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newPatient = new Patient({
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
    });
    await newPatient.save();

    const token = generateJWTToken(newPatient._id);

    // Return the newly created patient's _id
    return { _id: newPatient._id.toString(), token }; // Convert ObjectId to string
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

export const verifyPassword = async (
  email: string,
  enteredPassword: string
) => {
  await connectDB();
  try {
    const patient = await Patient.findOne({ email });
    if (!patient || !patient.password) {
      throw new Error("Patient not found or password not set");
    }

    const isMatch = await bcrypt.compare(enteredPassword, patient.password);
    if (isMatch) {
      const token = generateJWTToken(patient._id); // Generate JWT token upon password verification
      return { isMatch: true, token }; // Return token with the match result
    }
    return { isMatch: false };
  } catch (error) {
    console.error("Error verifying password:", error);
    throw new Error("Failed to verify password");
  }
};
