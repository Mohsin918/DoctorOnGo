"use server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // You may use this later for JWT token-based authentication
mongoose.connect("mongodb://127.0.0.1:27017/doctor_on_go");

const JWT_SECRET = "jsonwebtoken_secret_key";

// Define the DoctorData interface
export interface DoctorData {
  name: string;
  specialization: string;
  email: string;
  password: string;
  gender: string;
}

// Check if the Doctor model is already defined to avoid overwriting
const Doctor =
  mongoose.models.Doctor ||
  mongoose.model(
    "Doctor",
    new mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      specialization: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      gender: {
        type: String,
        enum: ["male", "female", "other"], // Define allowed values
        required: true,
      },
    })
  );

// Function to create a doctor
export const createDoctor = async (
  doctorData: DoctorData
): Promise<DoctorData> => {
  try {
    // Check if the email is already registered
    const existingDoctor = await Doctor.findOne({ email: doctorData.email });
    if (existingDoctor) {
      throw new Error("Email is already registered");
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(doctorData.password, 10);

    // Create a new doctor instance with the hashed password
    const newDoctor = new Doctor({ ...doctorData, password: hashedPassword });

    // Save the doctor to the database
    const savedDoctor = await newDoctor.save();

    // Convert the saved Mongoose document into a plain object and simplify fields
    const plainDoctor = savedDoctor.toObject();

    // Manually convert the `_id` to a string
    plainDoctor._id = plainDoctor._id.toString();

    // Return the plain object
    return plainDoctor;
  } catch (error: any) {
    console.error("Error creating doctor:", error);
    throw new Error(error.message); // Pass the error message back
  }
};

// Function to get all doctors
export const getDoctors = async (): Promise<DoctorData[]> => {
  try {
    // Retrieve all doctors from the database
    const doctors = await Doctor.find();

    // Convert each doctor document to a plain object
    const plainDoctors = doctors.map((doctor) => {
      const plainDoctor = doctor.toObject();
      plainDoctor._id = plainDoctor._id.toString(); // Convert _id to a string
      return plainDoctor;
    });

    return plainDoctors;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw new Error("Failed to fetch doctors");
  }
};

// Function to verify doctor login credentials
export const verifyDoctor = async (email: string, password: string) => {
  try {
    // Find doctor by email
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      throw new Error("Doctor not found");
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    // If successful, create a JWT token containing the doctorId
    const token = jwt.sign({ id: doctor._id }, JWT_SECRET, { expiresIn: "1h" });

    // Return the doctor's information
    return {
      success: true, // Indicate success
      token,
      doctorId: doctor._id.toString(), // Convert _id to string
      name: doctor.name,
      specialization: doctor.specialization,
    };
  } catch (error) {
    console.error("Error verifying doctor:", error);
    return { success: false, message: error.message }; // Return error message
  }
};

export const getDoctorById = async (doctorId: string) => {
  try {
    const doctor = await Doctor.findById(doctorId).lean(); // Return a plain object
    if (!doctor) {
      throw new Error("Doctor not found");
    }

    return doctor;
  } catch (error) {
    console.error("Error fetching doctor by ID:", error);
    throw new Error("Failed to fetch doctor");
  }
};
