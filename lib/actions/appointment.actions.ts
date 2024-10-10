"use server";
import mongoose from "mongoose";
import Appointment from "@/models/Appointment";
import Patient from "@/models/Patient";
import { getDoctorById } from "@/lib/actions/doctor.actions";
mongoose.connect("mongodb://127.0.0.1:27017/doctor_on_go");

export const getDoctorAppointments = async (doctorId: string) => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0); // Start of today in UTC
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(today.getUTCDate() + 1); // Start of tomorrow in UTC

  try {
    // Fetch the doctor's name based on the doctorId
    const doctor = await getDoctorById(doctorId);

    if (!doctor) {
      throw new Error("Doctor not found");
    }

    const doctorName = doctor.name;

    // Find all appointments for the given doctor, scheduled for today
    const appointments = await Appointment.find({
      doctor: doctorName, // Use doctor's name to query the appointments
      status: "scheduled",
      schedule: {
        $gte: today,
        $lt: tomorrow,
      },
    }).lean(); // Ensure we return plain objects

    if (!appointments.length) {
      return [];
    }

    // Fetch patient details for each appointment
    const appointmentDetails = await Promise.all(
      appointments.map(async (appointment) => {
        const patientDetails = await Patient.findById(
          appointment.patient
        ).lean();
        return {
          ...appointment,
          patient: patientDetails ? patientDetails : null,
        };
      })
    );

    // Sort appointments by schedule time (in ascending order)
    appointmentDetails.sort(
      (a, b) => new Date(a.schedule).getTime() - new Date(b.schedule).getTime()
    );

    return appointmentDetails;
  } catch (error) {
    console.error("Error fetching doctor's appointments:", error);
    throw new Error("Failed to fetch appointments");
  }
};

export const markAppointmentAsCompleted = async (appointmentId: string) => {
  try {
    // Find the appointment and update its status to 'completed'
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: "completed" },
      { new: true }
    ).lean(); // Return a plain object

    if (!updatedAppointment) {
      throw new Error("Appointment not found");
    }

    return updatedAppointment;
  } catch (error) {
    console.error("Error marking appointment as completed:", error);
    throw new Error("Failed to mark appointment as completed");
  }
};
