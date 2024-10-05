
import AboutCard from "@/components/AboutCard";

export default function AboutPage() {

    const teamMembers = [
                {
                  name: "Farzan Bilal",
                  areaOfExpertise: "Full-Stack Development, Security, and API Integration",
                  contribution: "Handled end-to-end development, integrating Twilio API for SMS notifications for appointment scheduling and cancellation. Conducted software testing and patched vulnerabilities like SQL Injection to enhance security. Additionally, implemented modular React components to promote code reusability and reduce duplication.",
                  imageUrl: "/assets/about_us/farzan.jpg",
                },
                {
                    name: "Syed Mohammad Umar",
                    areaOfExpertise: "Data Engineering & Visualization",
                    contribution: "Designed and optimized database schemas and managed relationships between collections. Developed analytics and visualizations, showing trends based on the number of appointments by each doctor, segregating appointments by gender, and analyzing appointment rush hours using D3.js and Charts.js.",
                    imageUrl: "/assets/about_us/syed.jpg",
                  },
                  {
                    name: "Jasir Mukhtar",
                    areaOfExpertise: "UI/UX Design, Business Logic, and Authentication",
                    contribution: "Led the team, developed the user interface using the ShadCN library, and wrote the business logic of the application. Implemented and validated the patient registration form and appointment system using the Zod library. Managed authentication for doctors and designed the admin dashboard for approving, rescheduling, and canceling appointments.",
                    imageUrl: "/assets/about_us/jasir.jpg",
                  },
                // other team members (if any)
              ];
  
              return (
                <div className="min-h-screen bg-black p-8">
                  <h1 className="text-4xl font-bold mb-8 text-center text-white">Meet Our Team</h1>
                  {/* Grid for Team Members */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teamMembers.map((member) => (
                      <AboutCard
                        key={member.name}
                        name={member.name}
                        areaOfExpertise={member.areaOfExpertise}
                        contribution={member.contribution}
                        imageUrl={member.imageUrl}
                      />
                    ))}
                  </div>
                </div>
              );
}
