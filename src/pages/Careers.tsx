
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Briefcase, Users, Award, TrendingUp, Mail } from 'lucide-react';

const Careers = () => {
  const openPositions = [
    {
      title: "Senior Software Engineer",
      department: "Technology",
      type: "Full-time",
      location: "Harare",
      description: "Join our tech team to build cutting-edge e-commerce solutions."
    },
    {
      title: "Sales Representative",
      department: "Sales",
      type: "Full-time",
      location: "Harare",
      description: "Help customers find the perfect tech solutions for their needs."
    },
    {
      title: "Digital Marketing Specialist",
      department: "Marketing",
      type: "Full-time",
      location: "Remote",
      description: "Drive our online presence and customer engagement strategies."
    },
    {
      title: "Customer Service Representative",
      department: "Support",
      type: "Part-time",
      location: "Harare",
      description: "Provide exceptional support to our valued customers."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Join Our Team</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Be part of Zimbabwe's leading technology company. We're looking for passionate individuals 
            who want to shape the future of tech retail in Africa.
          </p>
        </div>

        {/* Why Work With Us */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Why Work With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Growth Opportunities</h3>
              <p className="text-gray-600">Advance your career with continuous learning and development programs.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Great Team</h3>
              <p className="text-gray-600">Work with talented, passionate people who care about making a difference.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Competitive Benefits</h3>
              <p className="text-gray-600">Enjoy comprehensive benefits including health insurance and performance bonuses.</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Work-Life Balance</h3>
              <p className="text-gray-600">Flexible schedules and remote work options to help you thrive.</p>
            </div>
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Open Positions</h2>
          <div className="space-y-6">
            {openPositions.map((job, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{job.department}</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{job.type}</span>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">{job.location}</span>
                    </div>
                  </div>
                  <button className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Apply Now
                  </button>
                </div>
                <p className="text-gray-600">{job.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gray-900 text-white rounded-lg p-8 text-center">
          <Mail className="w-12 h-12 mx-auto mb-4 text-blue-400" />
          <h2 className="text-2xl font-bold mb-4">Don't See Your Role?</h2>
          <p className="text-gray-300 mb-6">
            We're always looking for talented individuals. Send us your resume and tell us how you'd like to contribute.
          </p>
          <a 
            href="mailto:careers@gadgetgenie.org" 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Send Your Resume
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Careers;
