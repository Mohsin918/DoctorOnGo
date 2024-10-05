"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getDoctors } from "@/lib/actions/doctor.actions"; // Import the function to fetch doctors
import { z } from "zod";
import { SelectItem } from "@/components/ui/select";
// import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions";
import { createAppointment, updateAppointment} from "@/lib/actions/test.actions";
import { getAppointmentSchema } from "@/lib/validation";
import { Appointment } from "@/types/mongoDB.types";
import "react-datepicker/dist/react-datepicker.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Form } from "../ui/form";

// Define DoctorData interface
export interface DoctorData {
  name: string;
  image?: string;
}

const AppointmentForm = ({
  userId,
  type = "create",
  appointment,
  setOpen,
}: {
  userId: string;
  type: "create" | "schedule" | "cancel";
  appointment?: Appointment;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState<DoctorData[]>([]); // Explicitly define type for doctors array
  const AppointmentFormValidation = getAppointmentSchema(type);

  // Fetch doctors on component mount
  useEffect(() => {
    const fetchAllDoctors = async () => {
      try {
        const fetchedDoctors = await getDoctors(); // Fetch the doctors from the server
        setDoctors(fetchedDoctors); // Set the state with fetched doctors
      } catch (error) {
        console.error("Failed to fetch doctors", error);
      }
    };
    fetchAllDoctors();
  }, []);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      doctor: appointment ? appointment?.doctor : "",
      schedule: appointment ? new Date(appointment?.schedule!) : new Date(Date.now()),
      reason: appointment ? appointment.reason : "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof AppointmentFormValidation>) => {
    setIsLoading(true);

    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
    }

    try {
      if (type === "create" && userId) {
        const appointment = {
          patient: userId,
          userId,
          doctor: values.doctor,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          status: status as Status,
          note: values.note,
        };

    
        const newAppointment = await createAppointment(appointment);

        console.log("New-Appointment",newAppointment)
    



        if (newAppointment) {
          form.reset();
          router.push(`/patients/${userId}/new-appointment/success?appointmentId=${newAppointment._id}`);
        }
      } else {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?._id!,
          appointment: {
            doctor: values.doctor,
            schedule: new Date(values.schedule),
            status: status as Status,
            cancellationReason: values.cancellationReason,
          },
          type,
        };

        const updatedAppointment = await updateAppointment(appointmentToUpdate);
        if (updatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
          router.refresh();
        }
      }
    } 

    // try {
    //   if (type === "create" && userId) {
    //     // Handle creation of a new appointment
    //     const appointment = {
    //       patient: userId, // Assuming userId is the patient ID
    //       userId,
    //       doctor: values.doctor,
    //       schedule: new Date(values.schedule),
    //       reason: values.reason!,
    //       status: status as Status,
    //       note: values.note,
    //     };
    
    //     // Create a new appointment
    //     const newAppointment = await createAppointment(appointment);
    
    //     if (newAppointment) {
    //       // Reset form and navigate to success page after appointment creation
    //       form.reset();
    //       router.push(`/patients/${userId}/new-appointment/success?appointmentId=${newAppointment._id}`);
    //     }
    //   } else if (appointment?._id && (type === "schedule" || type === "cancel")) {
    //     // Handle updating an existing appointment (schedule or cancel)
    //     const appointmentToUpdate = {
    //       userId,
    //       appointmentId: appointment._id.toString(), // Ensure the appointmentId is a string
    //       appointment: {
    //         doctor: values.doctor,
    //         schedule: new Date(values.schedule),
    //         status: status as Status,
    //         cancellationReason: values.cancellationReason,
    //       },
    //       type, // Only "schedule" or "cancel" types are passed here
    //     };
    
    //     // Update the appointment
    //     const updatedAppointment = await updateAppointment(appointmentToUpdate);
    
    //     if (updatedAppointment) {
    //       // Close the modal, reset the form, and redirect after successful update
    //       setOpen && setOpen(false);
    //       form.reset();
    //       router.push('/');
    //     }
    //   }
    // }
    catch (error) {
      console.error("Error creating appointment",error);
    }
    setIsLoading(false);
  };

  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    default:
      buttonLabel = "Submit Appointment";
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        {type === "create" && (
          <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment</h1>
            <p className="text-dark-700">Request a new appointment in 10 seconds.</p>
          </section>
        )}

        {type !== "cancel" && (
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="doctor"
              label="Doctor"
              placeholder="Select a doctor"
            >
              {doctors.map((doctor: DoctorData, i: number) => (
                <SelectItem key={doctor.name + i} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={`/assets/images/dr-${(doctor.name.split(' ')[1]).toLowerCase()}.png`} // Fallback image if doctor image is missing
                      width={32}
                      height={32}
                      alt="doctor"
                      className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy  -  h:mm aa"
            />

            <div className={`flex flex-col gap-6  ${type === "create" && "xl:flex-row"}`}>
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Appointment reason"
                placeholder="Annual monthly check-up"
                disabled={type === "schedule"}
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Comments/notes"
                placeholder="Prefer afternoon appointments, if possible"
                disabled={type === "schedule"}
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Urgent meeting came up"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;

