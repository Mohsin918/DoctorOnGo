import Image from 'next/image';

type DoctorCardProps = {
  name: string;
  specialization: string;
  email: string;
  imgPath: string;
  gender: string;
};

const DoctorCard: React.FC<DoctorCardProps> = ({ name, specialization, email, imgPath, gender }) => {
  return (
    <div className="bg-gray-800 shadow-md rounded-lg p-6 text-white transition-transform transform hover:scale-105">
      <div className="flex items-center">
        <Image src={imgPath} alt={name} width={80} height={80} className="rounded-full" />
        <div className="ml-4">
          <h3 className="text-xl font-semibold">{name}</h3>
          <p className="text-sm text-gray-400">{specialization}</p>
          <p className="text-sm text-gray-400">Gender: {gender}</p>
          <a href={`mailto:${email}`} className="text-blue-400 hover:underline mt-2 block text-sm">{email}</a>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;