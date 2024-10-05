
import DoctorCard from '@/components/DoctorCard';
// import { fetchDoctors } from '@/lib/actions/doctor.actions';
import { getDoctors } from '@/lib/actions/doctor.actions';


export default async function DoctorsPage() {
  // Await the fetching of doctors data
  const doctors = await getDoctors();

  return (
    <div className="bg-black min-h-screen p-8">
      <h1 className="text-4xl text-white mb-8 text-center">Our Doctors</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
       
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <DoctorCard
              // key={doctor._id} // Ensure each card has a unique key
              name={doctor.name}
              specialization={doctor.specialization}
              email={doctor.email}
              imgPath={`/assets/images/dr-${(doctor.name.split(' ')[1]).toLowerCase()}.png`}
              gender={doctor.gender}
            />
          ))
        ) : (
          <p className="text-white text-center col-span-full">
            No doctors available.
          </p>
        )}
      </div>
    </div>
  );
}
