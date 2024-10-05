import React from 'react';
import Image from 'next/image';
import RegisterForm from '@/components/forms/RegisterForm';
import { getPatientById } from '@/lib/actions/patient.actions'; // Import the function to fetch patient details

import * as Sentry from '@sentry/nextjs';

interface SearchParamProps {
  params: {
    userId: string; // User ID will be passed as a route parameter
  };
}

const Register = async ({ params: { userId } }: SearchParamProps) => {
  try {
    // Fetch the patient details using the userId
    const user = await getPatientById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Track with Sentry (optional)
    // Sentry.metrics.set('user_view_register', user.name);

    return (
      <div className="flex h-screen max-h-screen">
        <section className="remove-scrollbar container">
          <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
            <Image
              src="/assets/icons/logo-full.png"
              height={100}
              width={100}
              alt="patient"
            />
            {/* Pass the fetched user details to the RegisterForm */}
            <RegisterForm user={user} />
            <p className="copyright py-12">© 2024 Doctor on Go</p>
          </div>
        </section>
        <Image
          src="/assets/images/register-img.png"
          height={1000}
          width={1000}
          alt="patient"
          className="side-img max-w-[390px]"
        />
      </div>
    );
  } catch (error) {
    console.error('Error fetching user details:', error);
    return (
      <div className="flex h-screen max-h-screen">
        <p className="error-message">Failed to load user data.</p>
      </div>
    );
  }
};

export default Register;

