"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GenderOptions } from "@/constants"; // Import gender options from your constants
import { registerPatient } from "@/lib/actions/patient.actions";
import { PatientFormValidation } from "@/lib/validation"; // Add your validation schema
import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import FileUploader from "../FileUploader";



const RegisterForm = ({ user }: { user: any }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
    },
  });
// const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
//   setIsLoading(true);

//   try {
//     const formData = new FormData();
//     const prescriptionFile = values.prescription[0]; // Access the file

//     if (prescriptionFile) {
//       formData.append('prescription', prescriptionFile);

//       // Send the file to the backend
//       const uploadResponse = await fetch('/api/uploadEHR', {
//         method: 'POST',
//         body: formData,
//       });

//       const uploadData = await uploadResponse.json();
//       if (!uploadResponse.ok) {
//         throw new Error('File upload failed');
//       }

//       console.log('File uploaded successfully:', uploadData.filePath);
//     }
//     // Prepare the registration data
//     const registrationData = {
//       birthDate: new Date(values.birthDate),
//       gender: values.gender,
//       address: values.address,
//       occupation: values.occupation,
//       emergencyContactName: values.emergencyContactName,
//       emergencyContactNumber: values.emergencyContactNumber,
//       allergies: values.allergies,
//       currentMedication: values.currentMedication,
//       familyMedicalHistory: values.familyMedicalHistory,
//       pastMedicalHistory: values.pastMedicalHistory,
//     };

//     console.log('Registering patient:', registrationData);
//     const updatedPatient = await registerPatient(user._id, registrationData);

//     if (updatedPatient) {
//     // Redirect to new appointment page upon successful registration
//       router.push(`/patients/${user._id}/new-appointment`);
//     }
//   } catch (error) {
//     console.error('Error registering patient:', error);
//   } finally {
//     setIsLoading(false);
//   }
// };

const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
  setIsLoading(true);

  try {
    const formData = new FormData();
    const prescriptionFile = values.prescription?.[0];

    if (prescriptionFile) {
      formData.append('prescription', prescriptionFile);
      
      const uploadResponse = await fetch('/api/uploadEHR', {
        method: 'POST',
        body: formData,
      });

      // Check if the response is JSON before parsing
      const contentType = uploadResponse.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const uploadData = await uploadResponse.json();
        if (!uploadResponse.ok) {
          throw new Error('File upload failed');
        }
        console.log('File uploaded successfully:', uploadData.filePath);
      } else {
        throw new Error('Unexpected response format');
      }
    }

    const registrationData = {
      birthDate: new Date(values.birthDate),
      gender: values.gender,
      address: values.address,
      occupation: values.occupation,
      emergencyContactName: values.emergencyContactName,
      emergencyContactNumber: values.emergencyContactNumber,
      allergies: values.allergies,
      currentMedication: values.currentMedication,
      familyMedicalHistory: values.familyMedicalHistory,
      pastMedicalHistory: values.pastMedicalHistory,
    };

    const updatedPatient = await registerPatient(user._id, registrationData);

    if (updatedPatient) {
      router.push(`/patients/${user._id}/new-appointment`);
    }
  } catch (error) {
    console.error('Error registering patient:', error);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-12">
        <section className="space-y-4">
          <h1 className="header">Let us know more about yourself</h1>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>

          {/* Name */}
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Full name"
            placeholder="John Doe"
            readOnly={true}
          />

          {/* Email & Phone */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              label="Email address"
              placeholder="johndoe@gmail.com"
              readOnly={true}
            />

            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="phone"
              label="Phone number"
              placeholder="(555) 123-4567"
              readOnly={true}
            />
          </div>

          {/* BirthDate & Gender */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="birthDate"
              label="Date of birth"
            />

            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="gender"
              label="Gender"
              renderSkeleton={(field) => (
                <FormControl>
                  <RadioGroup
                    className="flex h-11 gap-6 xl:justify-between"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {GenderOptions.map((option, i) => (
                      <div key={option + i} className="radio-group">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />
          </div>

          {/* Address & Occupation */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="address"
              label="Address"
              placeholder="14 street, New York, NY"
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="occupation"
              label="Occupation"
              placeholder="Software Engineer"
            />
          </div>

          {/* Emergency Contact Name & Emergency Contact Number */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="emergencyContactName"
              label="Emergency Contact Name"
              placeholder="Guardian's name"
            />

            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="emergencyContactNumber"
              label="Emergency Contact Number"
              placeholder="(555) 123-4567"
            />




          </div>

          {/* Medical Information */}
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>

          {/* Allergies */}
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="allergies"
            label="Allergies (if any)"
            placeholder="E.g., Peanuts, Penicillin"
          />

          {/* Current Medications */}
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="currentMedication"
            label="Current Medications"
            placeholder="E.g., Ibuprofen 200mg, Levothyroxine"
          />

          {/* Family Medical History */}
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="familyMedicalHistory"
            label="Family Medical History (if relevant)"
            placeholder="E.g., Mother had cancer, Father has hypertension"
          />

          {/* Past Medical History */}
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="pastMedicalHistory"
            label="Past Medical History"
            placeholder="E.g., Appendectomy in 2015"
          />
          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="prescription"
            label="Scanned Copy of prescription"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange} />
              </FormControl>
            )}
          />
        </section>
              

        <SubmitButton isLoading={isLoading}>Submit and Continue</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;






