"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { StatusBadge } from "../StatusBadge";
import { formatDateTime } from "@/lib/utils";
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getDoctors } from "@/lib/actions/doctor.actions";  // Replace the static import with doctor fetching function
import AppointmentModal from "../AppointmentModal";
import { useEffect, useState } from "react";
import { getPatientById } from "@/lib/actions/patient.actions";



// Fetch the doctors from the database dynamically
const fetchDoctors = async () => {
  try {
    const doctors = await getDoctors();
    return doctors;
  } catch (error) {
    console.error("Failed to fetch doctors", error);
    return [];
  }
};





export const columns: ColumnDef<Appointment>[] = [
  {
    header: 'ID',
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>
  },
  {
    accessorKey: 'patient',
    header: 'Patient',
    cell: ({ row }) => <p className="text-14-medium">{row.original.patient.name}</p>
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="min-w-[115px]">
        <StatusBadge status={row.original.status} />
      </div>
    )
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => (
      <p className="text-14-regular min-w-[100px]">
        {formatDateTime(row.original.schedule).dateTime}
      </p>
    )
  },
  {
    accessorKey: "doctor",
    header: () => 'Doctor',
    cell: ({ row }) => {
      const [doctors, setDoctors] = useState<DoctorData[]>([]);
      
      // Fetch doctors when the component mounts
      useEffect(() => {
        const loadDoctors = async () => {
          const fetchedDoctors = await fetchDoctors();
          setDoctors(fetchedDoctors);
        };
        loadDoctors();
      }, []);

      const doctor = doctors.find((doc) => doc.name === row.original.doctor);

      return (
        <div className="flex items-center gap-3">
          {/* <Image
            src={doctor?.image || `/assets/images/dr-${(doctor.name.split(' ')[1]).toLowerCase()}.png`}
            // src={doctor?.image}
            alt={doctor?.name || "Unknown Doctor"}
            width={100}
            height={100}
            className="size-8"
          /> */}
          <p className="whitespace-nowrap">
            Dr. {doctor?.name || "Unknown"}
          </p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row: { original: data } }) => {
      return (
        <div className="flex gap-1">
          <AppointmentModal
            type="schedule"
            patientId={data.patient._id}  // Using Mongoose/MongoDB object structure
            userId={data.userId}
            appointment={data}
          />
          <AppointmentModal
            type="cancel"
            patientId={data.patient._id}
            userId={data.userId}
            appointment={data}
          />
        </div>
      );
    },
  },
];
