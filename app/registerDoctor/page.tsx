"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for redirection
import { doctorRegisterValidation, DoctorFormData } from "@/lib/validation";
import { createDoctor, DoctorData } from "@/lib/actions/doctor.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CustomFormField, { FormFieldType } from '@/components/CustomFormField';
import FileUploader from '@/components/FileUploader';
import { FormControl } from '@/components/ui/form';

export default function RegisterDoctor() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DoctorFormData>({
    resolver: zodResolver(doctorRegisterValidation),
  });

  const router = useRouter(); // Initialize useRouter for redirection

  const [submittedData, setSubmittedData] = useState<DoctorFormData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // For storing selected image file

  // Function to handle image file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data: DoctorFormData) => {
    try {
      // Exclude confirmPassword before sending data to the server
      const { confirmPassword, ...doctorData } = data;

      // Call createDoctor function with validated data
      const newDoctor = await createDoctor(doctorData as DoctorData);

      // Check if newDoctor is valid
      if (newDoctor) {
        console.log("Doctor created successfully:", newDoctor);
        setSubmittedData(data); 
        setIsAlertOpen(true);
        reset(); // Reset form after submission

        // Save the uploaded image to the specified path
        if (selectedFile) {
          const firstName = newDoctor.name.split(' ')[0].toLowerCase(); // Get first name in lowercase
          
          // Prepare the form data to send to the upload API
          const formData = new FormData();
          formData.append("file", selectedFile);
          formData.append("filename", newDoctor.name); // Pass the doctor's full name

          // Make a POST request to the upload API
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            console.log(`File uploaded and renamed to: /assets/images/dr-${firstName}.jpg`);
          } else {
            console.error('File upload failed');
          }
        }

        // After a short delay, redirect to the root route ("/")
        setTimeout(() => {
          router.push("/");
        }, 2000); // Redirect after 2 seconds
      } else {
        throw new Error("Failed to register doctor. Please try again.");
      }

    } catch (error: any) {
      // Handle errors (e.g., duplicate email, connection issues)
      if (error.message.includes("Email is already registered")) {
        setError("Email is already registered. Please try another.");
      } else {
        setError("Failed to register doctor. Please try again.");
      }
      console.error("Doctor registration failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl text-center text-white font-bold mb-4">Register Doctor</h1>

        {/* Error message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-200">Name</label>
            <input
              {...register("name")}
              type="text"
              className={`mt-1 block w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter Doctor's Name"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Specialization Field */}
          <div>
            <label className="block text-sm font-medium text-gray-200">Specialization</label>
            <input
              {...register("specialization")}
              type="text"
              className={`mt-1 block w-full p-2 border ${errors.specialization ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter Specialization"
            />
            {errors.specialization && <p className="text-red-500 text-sm">{errors.specialization.message}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-200">Email</label>
            <input
              {...register("email")}
              type="email"
              className={`mt-1 block w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter Email Address"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Gender Field */}
          <div>
            <label className="block text-sm font-medium text-gray-200">Gender</label>
            <select
              {...register("gender")}
              className={`mt-1 block w-full p-2 border ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500`}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-200">Password</label>
            <input
              {...register("password")}
              type="password"
              className={`mt-1 block w-full p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter Password"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-200">Confirm Password</label>
            <input
              {...register("confirmPassword")}
              type="password"
              className={`mt-1 block w-full p-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Confirm Password"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
          </div>

          {/* Image Upload Field */}
          <div>
            <label className="block text-sm font-medium text-gray-200">Upload Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            Register Doctor
          </button>
        </form>

        {/* Success Alert */}
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Congratulations!</AlertDialogTitle>
              <AlertDialogDescription>
                Your registration has been submitted successfully.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogAction onClick={() => setIsAlertOpen(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </div>
  );
}
