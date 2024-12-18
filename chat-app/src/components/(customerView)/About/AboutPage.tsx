import React from 'react';
import { 
  Target, 
  Eye, 
  Users, 
  CheckCircle, 
  Award, 
  Globe 
} from 'lucide-react';

const AboutPage = () => {
  // Core values and team members (you can replace with actual data)
  const coreValues = [
    {
      icon: Target,
      title: "Innovation",
      description: "Constantly pushing the boundaries of technological solutions."
    },
    {
      icon: Eye,
      title: "Vision",
      description: "Anticipating and creating future-ready technological landscapes."
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Building strong partnerships with clients and team members."
    }
  ];

  const teamMembers = [
    {
      name: "John Doe",
      role: "CEO & Founder",
      bio: "Tech visionary with 15+ years of experience in AI and cloud solutions.",
      image: "/api/placeholder/300/300"
    },
    {
      name: "Jane Smith",
      role: "Chief Technology Officer",
      bio: "Expert in developing cutting-edge AI and machine learning strategies.",
      image: "/api/placeholder/300/300"
    },
    {
      name: "Mike Johnson",
      role: "Lead Software Architect",
      bio: "Innovative problem solver with expertise in cloud infrastructure.",
      image: "/api/placeholder/300/300"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Company Overview Section */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-[#213555] mb-6">
          About AI Solutions
        </h1>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-gray-700 leading-relaxed">
            We are a forward-thinking technology company dedicated to transforming 
            businesses through innovative AI and cloud solutions. Our mission is to 
            empower organizations with cutting-edge technologies that drive efficiency, 
            growth, and digital transformation.
          </p>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#213555]">
            Our Core Values
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {coreValues.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <div 
                key={index}
                className="
                  bg-white 
                  rounded-lg 
                  shadow-md 
                  border 
                  border-[#D8C4B6] 
                  p-6 
                  text-center 
                  transition 
                  hover:shadow-lg
                "
              >
                <div className="flex justify-center mb-4">
                  <IconComponent 
                    size={48} 
                    className="text-[#213555] opacity-80"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#213555] mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-700">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Achievements Section */}
      <section className="mb-12 bg-[#F5EFE7] py-12">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#213555]">
              Our Achievements
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Award size={48} className="mx-auto text-[#3E5879] mb-4" />
              <h3 className="text-xl font-semibold text-[#213555]">
                15+ Industry Awards
              </h3>
              <p className="text-gray-700">
                Recognized for excellence in technological innovation
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Globe size={48} className="mx-auto text-[#3E5879] mb-4" />
              <h3 className="text-xl font-semibold text-[#213555]">
                Global Presence
              </h3>
              <p className="text-gray-700">
                Serving clients across multiple continents
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <CheckCircle size={48} className="mx-auto text-[#3E5879] mb-4" />
              <h3 className="text-xl font-semibold text-[#213555]">
                99% Client Satisfaction
              </h3>
              <p className="text-gray-700">
                Committed to delivering exceptional solutions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#213555]">
            Meet Our Leadership
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto mt-4">
            Our team comprises industry experts passionate about driving technological innovation 
            and solving complex business challenges.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className="
                bg-white 
                rounded-lg 
                shadow-md 
                border 
                border-[#D8C4B6] 
                overflow-hidden 
                transition 
                hover:shadow-lg
              "
            >
              <div className="h-64 bg-[#3E5879] flex items-center justify-center">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-[#213555] mb-2">
                  {member.name}
                </h3>
                <p className="text-[#3E5879] mb-3 font-medium">
                  {member.role}
                </p>
                <p className="text-gray-700">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;