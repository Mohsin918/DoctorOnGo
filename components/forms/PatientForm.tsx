"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { UserFormValidation } from "@/lib/validation";
import { z } from "zod";
import "react-phone-number-input/style.css";
import {
  isPatientRegistered,
  createPatient,
  verifyPassword,
} from "@/lib/actions/patient.actions";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import PasswordModal from "./PasswordModal";
import { setCookie } from "nookies";

export const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [patientStatus, setPatientStatus] = useState(""); // Keep track of patient status
  const [patientId, setPatientId] = useState(""); // Store patient _id
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [isNewPatient, setIsNewPatient] = useState(false);

  // Initialize the form using useForm hook
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  // Handle the initial form submission (before showing the password modal)
  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);

    try {
      // Check if the patient is registered or partially registered
      const { isRegistered, isPartiallyRegistered, _id } =
        await isPatientRegistered(values.email);

      setPatientId(_id); // Store the patient ID for further operations

      if (isRegistered || isPartiallyRegistered) {
        setPasswordModalVisible(true); // Show the modal for password entry
        setPasswordRequired(true); // Show password field in modal
        setPatientStatus(
          isRegistered ? "isRegistered" : "isPartiallyRegistered"
        ); // Track the status
      } else {
        setPasswordModalVisible(true); // Show the modal for password creation
        setIsNewPatient(true); // New patient needs to create a password
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (password: string) => {
    setIsLoading(true);

    try {
      if (
        patientStatus === "isRegistered" ||
        patientStatus === "isPartiallyRegistered"
      ) {
        const { isMatch, token } = await verifyPassword(
          form.getValues("email"),
          password
        );

        if (isMatch) {
          setCookie(null, "jwt_token", token, { maxAge: 3600, path: "/" }); // Store JWT token in cookie

          if (patientStatus === "isRegistered") {
            router.push(`/patients/${patientId}/new-appointment`);
          } else {
            router.push(`/patients/${patientId}/register`);
          }
        } else {
          alert("Invalid password");
        }
      } else if (isNewPatient) {
        const { _id, token } = await createPatient({
          name: form.getValues("name"),
          email: form.getValues("email"),
          phone: form.getValues("phone"),
          password: password,
        });

        setCookie(null, "jwt_token", token, { maxAge: 3600, path: "/" }); // Store JWT token in cookie

        router.push(`/patients/${_id}/register`);
      }
    } catch (error) {
      console.error("Error handling password:", error);
      alert("Error: " + error.message);
    } finally {
      setIsLoading(false);
      setPasswordModalVisible(false);
    }
  };

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Full Name"
            placeholder="John Doe"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email"
            placeholder="john.doe@example.com"
          />
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

      {/* Render the Password Modal */}
      {passwordModalVisible && (
        <PasswordModal
          isOpen={passwordModalVisible}
          onClose={() => setPasswordModalVisible(false)}
          onSubmit={handlePasswordSubmit}
          isNewPatient={isNewPatient} // Determine whether it's for password creation or entry
        />
      )}
    </>
  );
};
