"use client";
import { useState, useEffect } from "react";
import { getDoctors } from "@/lib/actions/doctor.actions"; // Fetch doctors for dropdown
import { getDoctorAppointments } from "@/lib/actions/appointment.actions"; // Fetch appointments

const TrackApplication = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch doctors on page load
  useEffect(() => {
    async function fetchDoctors() {
      const doctorsList = await getDoctors();
      setDoctors(doctorsList);
    }
    fetchDoctors();
  }, []);

  // Handle doctor selection
  const handleDoctorChange = async (e) => {
    const doctorId = e.target.value;
    setSelectedDoctor(doctorId);
    setLoading(true);

    // Fetch pending appointments for the selected doctor
    const todayAppointments = await getDoctorAppointments(doctorId);
    setAppointments(todayAppointments);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-black flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-4xl">
        {/* Track Application Heading */}
        <h1 className="text-4xl text-center text-white font-bold mb-8">
          Track Application
        </h1>

        {/* Dropdown to select the doctor */}
        <div className="mb-6">
          <label
            htmlFor="doctor"
            className="block text-lg text-white font-medium mb-2"
          >
            Select Doctor
          </label>
          <select
            id="doctor"
            onChange={handleDoctorChange}
            className="p-3 w-full bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                Dr. {doctor.name}
              </option>
            ))}
          </select>
        </div>

        {/* Show loading message */}
        {loading && (
          <p className="text-lg text-center text-white">
            Loading appointments...
          </p>
        )}

        {/* Show pending appointments for selected doctor */}
        {!loading && appointments.length > 0 ? (
          <ul className="text-white space-y-6">
            {appointments.map((appointment) => (
              <li
                key={appointment._id}
                className="p-4 bg-gray-700 rounded-lg flex justify-between items-center"
              >
                <div className="text-lg">
                  <p>
                    <span className="font-semibold">Appointment with:</span>{" "}
                    {appointment.patient?.name || "Unknown"}
                  </p>
                  <p>
                    <span className="font-semibold">Scheduled at:</span>{" "}
                    {new Date(appointment.schedule).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          !loading && (
            <p className="text-lg text-center text-white mt-8">
              {selectedDoctor
                ? "No pending appointments for today."
                : "Please select a doctor to track appointments."}
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default TrackApplication;
