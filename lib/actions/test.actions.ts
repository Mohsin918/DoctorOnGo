"use server";
import Appointment from "@/models/Appointment";
import Patient from "@/models/Patient";
import { connectDB } from "@/db";
import { formatDateTime, parseStringify } from "@/lib/utils";
import { ID, Query } from "node-appwrite";
import { revalidatePath } from "next/cache";
import { sendSMSNotification } from "@/sendSMS";

// interface AppointmentData {
//   userId: string;
//   patient: string;
//   schedule: Date;
//   reason: string;
//   doctor: string;
//   status: 'pending' | 'scheduled' | 'cancelled';
//   note?: string;
//   cancellationReason?: string;
// }

// // Function to create a new appointment and associate it with a patient
// export const createAppointment = async (appointmentData: AppointmentData) => {
//   await connectDB(); // Ensure the DB is connected

//   try {
//     // Find the patient by ID
//     // const patient = await Patient.findById(appointmentData.patient);
//     const patient = await Patient.findById(appointmentData.patient).lean();
//     console.log("Test from test.actions",patient)
//     if (!patient) {
//       throw new Error('Patient not found');
//     }

//     // Create a new appointment instance with the provided data
//     const newAppointment = new Appointment({
//       patient: appointmentData.patient,
//       userId: appointmentData.userId,
//       schedule: appointmentData.schedule,
//       reason: appointmentData.reason,
//       doctor: appointmentData.doctor,
//       status: appointmentData.status,
//       note: appointmentData.note,
//       cancellationReason: appointmentData.cancellationReason,
//     });

//     const savedAppointment = await newAppointment.save()

//     return savedAppointment.toObject();
//   } catch (error) {
//     console.error('Error creating appointment:', error);
//     throw new Error('Failed to create appointment');
//   }
// };

// export const getAppointment = async (appointmentId: string) => {
//     await connectDB();  // Ensure DB connection

//     try {
//       // Find the appointment by its ID and populate the patient details
//       const appointment = await Appointment.findById(appointmentId).populate('patient')
//       // Return the appointment if found, otherwise return null
//       return appointment || null;
//     } catch (error) {
//       console.error('Error retrieving appointment:', error);
//       throw new Error('Failed to retrieve appointment');
//     }
//   };

//   export const getRecentAppointmentList = async () => {
//       await connectDB();
//     try {
//       // Fetch appointments as plain objects with lean()
//       const appointments = await Appointment.find()
//         .populate('patient', 'name')
//         .sort({ createdAt: -1 })
//         .lean() // Use lean() to return plain JavaScript objects
//         .exec();

//       // Initialize counts
//       const initialCounts = {
//         scheduledCount: 0,
//         pendingCount: 0,
//         cancelledCount: 0,
//       };

//       // Reduce to count the statuses
//       const counts = appointments.reduce((acc, appointment) => {
//         switch (appointment.status) {
//           case "scheduled":
//             acc.scheduledCount++;
//             break;
//           case "pending":
//             acc.pendingCount++;
//             break;
//           case "cancelled":
//             acc.cancelledCount++;
//             break;
//         }
//         return acc;
//       }, initialCounts);

//       const data = {
//         totalCount: appointments.length,
//         ...counts,
//         documents: appointments,
//       };
//       return data;
//     } catch (error) {
//       console.error(
//         "An error occurred while retrieving the recent appointments:",
//         error
//       );
//       throw new Error("Failed to fetch recent appointments");
//     }
//   };
interface AppointmentData {
  userId: string;
  patient: string;
  schedule: Date;
  reason: string;
  doctor: string;
  status: "pending" | "scheduled" | "cancelled";
  note?: string;
  cancellationReason?: string;
}

// Function to create a new appointment and associate it with a patient
export const createAppointment = async (appointmentData: AppointmentData) => {
  await connectDB(); // Ensure the DB is connected

  try {
    // Find the patient by ID and ensure it is a plain object
    const patient = await Patient.findById(appointmentData.patient).lean();
    if (!patient) {
      throw new Error("Patient not found");
    }

    // Create a new appointment instance with the provided data
    const newAppointment = new Appointment({
      patient: appointmentData.patient,
      userId: appointmentData.userId,
      schedule: appointmentData.schedule,
      reason: appointmentData.reason,
      doctor: appointmentData.doctor,
      status: appointmentData.status,
      note: appointmentData.note,
      cancellationReason: appointmentData.cancellationReason,
    });

    // Save the new appointment and convert it to a plain object using toObject()
    const savedAppointment = await newAppointment.save();
    return savedAppointment.toObject(); // Convert the Mongoose document into a plain JS object
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw new Error("Failed to create appointment");
  }
};

export const getAppointment = async (appointmentId: string) => {
  await connectDB(); // Ensure DB connection

  try {
    // Find the appointment by its ID, populate the patient, and return as plain object
    const appointment = await Appointment.findById(appointmentId)
      .populate("patient")
      .lean(); // Use lean to return plain JS object
    return appointment || null;
  } catch (error) {
    console.error("Error retrieving appointment:", error);
    throw new Error("Failed to retrieve appointment");
  }
};

export const getRecentAppointmentList = async () => {
  await connectDB();

  try {
    // Fetch appointments as plain objects with lean()
    const appointments = await Appointment.find()
      .populate("patient", "name")
      .sort({ createdAt: -1 })
      .lean(); // Use lean() to return plain JavaScript objects

    // Initialize counts
    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    // Reduce to count the statuses
    const counts = appointments.reduce((acc, appointment) => {
      switch (appointment.status) {
        case "scheduled":
          acc.scheduledCount++;
          break;
        case "pending":
          acc.pendingCount++;
          break;
        case "cancelled":
          acc.cancelledCount++;
          break;
      }
      return acc;
    }, initialCounts);

    const data = {
      totalCount: appointments.length,
      ...counts,
      documents: appointments,
    };
    return data;
  } catch (error) {
    console.error(
      "An error occurred while retrieving the recent appointments:",
      error
    );
    throw new Error("Failed to fetch recent appointments");
  }
};

interface UpdateAppointmentParams {
  appointmentId: string;
  userId: string;
  appointment: {
    doctor?: string;
    schedule?: Date;
    reason?: string;
    status?: "pending" | "scheduled" | "cancelled";
    cancellationReason?: string;
  };
  type: "schedule" | "cancel";
}

// export const updateAppointment = async ({
//   appointmentId,
//   userId,
//   appointment,
//   type,
// }: UpdateAppointmentParams) => {
//   await connectDB();
//   try {
//     // Find and update the appointment document in MongoDB
//     const updatedAppointment = await Appointment.findByIdAndUpdate(
//       appointmentId,
//       {
//         $set: appointment,
//       },
//       { new: true } // Return the updated document
//     );

//     if (!updatedAppointment) throw new Error('Appointment not found');

//     const smsMessage = `Greetings from Doctor on Go, ${
//       type === 'schedule'
//         ? `Your appointment is confirmed for ${formatDateTime(
//             updatedAppointment.schedule!
//           ).dateTime} with Dr. ${updatedAppointment.doctor}`
//         : `We regret to inform you that your appointment for ${formatDateTime(
//             updatedAppointment.schedule!
//           ).dateTime} is cancelled. Reason: ${
//             updatedAppointment.cancellationReason
//           }`
//     }.`;

//     // Send SMS notification to the user
//     await sendSMSNotification(userId, smsMessage);

//     revalidatePath("/admin");

//     return updatedAppointment; // Return the updated appointment
//   } catch (error) {
//     console.error('An error occurred while scheduling an appointment:', error);
//     throw new Error('Failed to update the appointment');
//   }
// };

export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  await connectDB();

  try {
    // Find and update the appointment document in MongoDB
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        $set: appointment,
      },
      { new: true, lean: true } // Return the updated document as a plain object
    ).lean(); // Ensure the document returned is plain JS object

    if (!updatedAppointment) throw new Error("Appointment not found");

    const smsMessage = `Greetings from Doctor on Go, ${
      type === "schedule"
        ? `Your appointment is confirmed for ${
            formatDateTime(updatedAppointment.schedule!).dateTime
          } with Dr. ${updatedAppointment.doctor}`
        : `We regret to inform you that your appointment for ${
            formatDateTime(updatedAppointment.schedule!).dateTime
          } is cancelled. Reason: ${updatedAppointment.cancellationReason}`
    }`;

    // Send SMS notification to the user
    await sendSMSNotification(userId, smsMessage);

    return updatedAppointment; // Ensure this is a plain object
  } catch (error) {
    console.error("An error occurred while scheduling an appointment:", error);
    throw new Error("Failed to update the appointment");
  }
};
