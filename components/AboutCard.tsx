



// interface AboutCardProps {
//     name: string;
//     areaOfExpertise: string;
//     contribution: string;
//     imageUrl: string;
//   }
  
//   const AboutCard: React.FC<AboutCardProps> = ({
//     name,
//     areaOfExpertise,
//     contribution,
//     imageUrl,
//   }) => {
//     return (
//       <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
//         {/* Image Section */}
//         <div className="w-full h-48 overflow-hidden">
//           <img
//             className="w-full h-full object-cover"
//             src={imageUrl}
//             alt={`${name}'s photo`}
//           />
//         </div>
  
//         {/* Info Section */}
//         <div className="p-4 text-center">
//           <h2 className="text-lg font-bold text-gray-900 mb-2">{name}</h2>
//           <p className="text-gray-700 mb-2"><strong>Expertise:</strong> {areaOfExpertise}</p>
//           <p className="text-gray-600 mt-2"><strong>Contribution:</strong> {contribution}</p>
//         </div>
//       </div>
//     );
//   };
  
//   export default AboutCard;
  
  // components/AboutCard.tsx

interface AboutCardProps {
    name: string;
    areaOfExpertise: string;
    contribution: string;
    imageUrl: string;
  }
  
  const AboutCard: React.FC<AboutCardProps> = ({
    name,
    areaOfExpertise,
    contribution,
    imageUrl,
    
  }) => {
    
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        {/* Image Section with Blur Effect */}
        <div className="relative w-full h-48 overflow-hidden">
          <img
            className="w-full h-full object-cover filter blur-sm"
            src={imageUrl}
            alt={`${name}'s photo`}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              className="w-48 h-48 object-cover rounded-full"
              src={imageUrl}
              alt={`${name}'s portrait`}
            />
          </div>
        </div>
  
        {/* Info Section */}
        <div className="p-4 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-2">{name}</h2>
          <p className="text-gray-700 mb-2"><strong>Expertise:</strong> {areaOfExpertise}</p>
          <p className="text-gray-600 mt-2"><strong>Contribution:</strong> {contribution}</p>
        </div>
      </div>
    );
  };
  
  export default AboutCard;
  