import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import AppointmentForm from "@/components/forms/AppointmentForm";
import Image from "next/image";

const JWT_SECRET = "jsonwebtoken_secret_key";

export default async function NewAppointment({ params: { userId } }) {
  const cookieStore = cookies();
  const token = cookieStore.get("jwt_token")?.value;

  if (!token) {
    redirect("/"); // Redirect to home if no token
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET); // Decode and verify token
    const userIdFromToken = decodedToken.id;

    if (userIdFromToken !== userId) {
      redirect("/"); // Unauthorized, redirect to home
    }

    // Render the new appointment page
    return (
      <div className="flex h-screen max-h-screen">
        <section className="remove-scrollbar container my-auto">
          <div className="sub-container max-w-[860px] flex-1 justify-between">
            <Image
              src="/assets/icons/logo-full.png"
              height={100}
              width={100}
              alt="patient"
            />
            <AppointmentForm type="create" userId={userId} />
            <p className="copyright mt-10 py-12">© 2024 Doctor on Go</p>
          </div>
        </section>
        <Image
          src="/assets/images/appointment-img.png"
          height={1000}
          width={1000}
          alt="appointment"
          className="side-img max-w-[390px] bg-bottom"
        />
      </div>
    );
  } catch (error) {
    redirect("/"); // Redirect if token is invalid
  }
}
