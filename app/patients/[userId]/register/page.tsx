import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import RegisterForm from "@/components/forms/RegisterForm";
import Image from "next/image";
import { getPatientById } from "@/lib/actions/patient.actions";

const JWT_SECRET = "jsonwebtoken_secret_key";

export default async function Register({ params: { userId } }) {
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

    // Fetch the patient data
    const user = await getPatientById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Render the register page
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
    redirect("/"); // Redirect if token is invalid or user is not found
  }
}
