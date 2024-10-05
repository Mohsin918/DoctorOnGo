"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { UserFormValidation } from "@/lib/validation";
import {
  isPatientRegistered,
  createPatient,
} from "@/lib/actions/patient.actions"; // Adjust import path
import CustomFormField, { FormFieldType } from "../CustomFormField";
import "react-phone-number-input/style.css";
import SubmitButton from "../SubmitButton";

export const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize the form using useForm hook
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  // const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
  //   setIsLoading(true);

  //   try {
  //     // Check if the patient is already registered (including partially registered patients)
  //     const { isRegistered, isPartiallyRegistered, _id } = await isPatientRegistered(values.email);

  //     if (isRegistered) {
  //       // If fully registered, redirect to the appointment page
  //       router.push(`/patients/${_id}/new-appointment`);
  //     } else if (isPartiallyRegistered) {
  //       // If partially registered, redirect to the register page to complete the registration
  //       router.push(`/patients/${_id}/register`);
  //     } else {
  //       // If not registered at all, create a new patient
  //       const newPatient = await createPatient({
  //         name: values.name,
  //         email: values.email,
  //         phone: values.phone,
  //       });

  //       // Redirect to the RegisterForm page after creating the patient
  //       if (newPatient) {
  //         router.push(`/patients/${newPatient._id}/register`);
  //       }
  //     }
  //   }
  //   catch (error) {
  //     console.error("Error submitting form:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);

    try {
      // Check if the patient is already registered (including partially registered patients)
      const { isRegistered, isPartiallyRegistered, _id } =
        await isPatientRegistered(values.email);
      console.log("CHECK HERRE");

      // console.log( "isRegd , isPreged , id ",isRegistered , isPartiallyRegistered , _id)

      if (isRegistered) {
        // If fully registered, redirect to the appointment page
        router.push(`/patients/${_id}/new-appointment`);
      } else if (isPartiallyRegistered) {
        // If partially registered, redirect to the register page to complete the registration
        router.push(`/patients/${_id}/register`);
      } else {
        // If not registered at all, create a new patient
        const newPatient = await createPatient({
          name: values.name,
          email: values.email,
          phone: values.phone,
        });

        // Redirect to the RegisterForm page after creating the patient
        if (newPatient) {
          router.push(`/patients/${newPatient._id}/register`);
        } else {
          throw new Error("Failed to create new patient");
        }
      }
    } catch (error: any) {
      // Check if the error is a network issue or server-side validation error
      if (error.response) {
        // Server responded with a status other than 200 range
        console.error("Server error:", error.response.data);
        alert(
          `Server error: ${
            error.response.data.message || "Something went wrong!"
          }`
        );
      } else if (error.request) {
        // Request was made but no response received (e.g., network issue)
        console.error("Network error:", error.request);
        alert("Network error: Please check your internet connection.");
      } else {
        // Something else happened in setting up the request
        console.error("Error submitting form:", error.message);
        alert(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Using CustomFormField for name */}
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="John Doe"
        />

        {/* Using CustomFormField for email */}
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="john.doe@example.com"
        />

        {/* Using CustomFormField for phone */}
        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone"
          placeholder="(555) 123-4567"
        />

        <SubmitButton isLoading={isLoading}>Submit</SubmitButton>
      </form>
    </FormProvider>
  );
};
