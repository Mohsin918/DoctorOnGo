"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getDoctorAppointments,
  markAppointmentAsCompleted,
} from "@/lib/actions/appointment.actions";

const DoctorDashboard = () => {
  const { doctorId } = useParams();
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null); // To store the selected appointment to mark as completed

  useEffect(() => {
    const checkAuthAndFetchAppointments = async () => {
      try {
        // Make a request to the API route to verify the token
        const response = await fetch("/api/verifyToken", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!data.success || data.decoded.id !== doctorId) {
          return router.push("/loginDoctor");
        }

        // If token is valid, fetch the appointments
        const appointmentsData = await getDoctorAppointments(doctorId);
        setAppointments(appointmentsData);
        setLoading(false);
      } catch (error) {
        console.error("Authentication failed or invalid token:", error);
        router.push("/loginDoctor");
      }
    };

    checkAuthAndFetchAppointments();
  }, [doctorId, router]);

  // Function to handle opening the confirmation modal
  const openConfirmationModal = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setShowModal(true);
  };

  // Function to handle marking the appointment as completed
  const handleMarkCompleted = async () => {
    try {
      if (selectedAppointmentId) {
        const updatedAppointment = await markAppointmentAsCompleted(
          selectedAppointmentId
        );
        setAppointments((prevAppointments) =>
          prevAppointments.filter(
            (appointment) => appointment._id !== updatedAppointment._id
          )
        );
        setShowModal(false);
      }
    } catch (error) {
      console.error("Failed to mark appointment as completed:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-10 rounded-lg shadow-lg w-full max-w-5xl">
        <h1 className="text-4xl text-center text-white font-extrabold mb-8">
          Doctor's Dashboard
        </h1>
        <h2 className="text-2xl text-center text-white font-semibold mb-6">
          Today's Appointments
        </h2>

        {appointments.length > 0 ? (
          <ul className="space-y-6 text-white">
            {appointments.map((appointment) => (
              <li
                key={appointment._id}
                className="p-6 bg-gray-700 rounded-md flex justify-between items-center shadow-md hover:bg-gray-600 transition-colors duration-200"
              >
                <div>
                  <p className="text-lg font-semibold">
                    Appointment with{" "}
                    <span className="text-blue-400">
                      {appointment.patient?.name || "Unknown"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-300">
                    Scheduled at{" "}
                    <span className="font-semibold text-white">
                      {new Date(appointment.schedule).toLocaleString()}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => openConfirmationModal(appointment._id)} // Open confirmation modal
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors duration-200"
                >
                  Mark as Completed
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-xl text-gray-300">
            No appointments for today.
          </p>
        )}

        {/* Confirmation Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Confirm Action
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to mark this appointment as completed?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowModal(false)} // Close modal without marking as completed
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMarkCompleted} // Proceed with marking as completed
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
