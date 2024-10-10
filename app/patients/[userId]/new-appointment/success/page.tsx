import Link from "next/link";
import Image from "next/image";
import React from "react";
import { getAppointment } from "@/lib/actions/test.actions";
import { getDoctors } from "@/lib/actions/doctor.actions";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Success = async ({
  params: { userId },
  searchParams,
}: SearchParamProps) => {
  const appointmentId = (searchParams?.appointmentId as string) || "";
  const appointment = await getAppointment(appointmentId);
  // console.log("Test Going On",appointment.patient.name)
  const Doctors = await getDoctors();
  const doctor = Doctors.find((doc) => doc.name === appointment?.doctor);
  return (
    <div className=" flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.png"
            height={100}
            width={100}
            alt="logo"
            // className="h-10 w-fit"
          />
        </Link>
        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt="success"
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment request</span> has
            been successfully submitted!
          </h2>
          <p>We&apos;ll be in touch shortly to confirm.</p>
        </section>
        <section className="request-details">
          <p>Requested appointment details:</p>
          {doctor ? (
            <div className="flex items-center gap-3">
              <Image
                src={`/assets/images/dr-${
                  doctor.name.split(" ")[1]
                    ? doctor.name.split(" ")[1].toLowerCase()
                    : "default"
                }.png`}
                alt="doctor"
                width={100}
                height={100}
                className="size-6"
              />
              <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
            </div>
          ) : (
            <p>Doctor details not available.</p>
          )}

          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calendar"
            />
            <p> {formatDateTime(appointment.schedule).dateTime}</p>
          </div>
        </section>
        <Button variant="outline" className="shad-primary-btn" asChild>
          <Link href={`/patients/${userId}/new-appointment`}>
            New Appointment
          </Link>
        </Button>
        <p className="copyright">© 2024 Doctor on Go </p>
      </div>
    </div>
  );
};

export default Success;
