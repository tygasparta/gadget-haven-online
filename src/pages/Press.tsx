
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Calendar, Download, Mail, Award } from 'lucide-react';

const Press = () => {
  const pressReleases = [
    {
      date: "2024-12-15",
      title: "Gadget Genie Launches Flash Sale Season with Up to 70% Off Electronics",
      excerpt: "Zimbabwe's leading electronics retailer announces its biggest sale event of the year, featuring discounts on smartphones, laptops, and home appliances."
    },
    {
      date: "2024-11-20",
      title: "Gadget Genie Expands Delivery Network to Cover All Major Cities",
      excerpt: "The company announces expanded delivery services to Bulawayo, Mutare, and Gweru, bringing fast tech delivery to more Zimbabweans."
    },
    {
      date: "2024-10-10",
      title: "Gadget Genie Partners with Local Tech Startups for Innovation Hub",
      excerpt: "New partnership program aims to support local technology entrepreneurs and showcase Zimbabwean innovation."
    },
    {
      date: "2024-09-05",
      title: "Record Sales Quarter: Gadget Genie Reports 150% Growth in Online Sales",
      excerpt: "The electronics retailer attributes growth to improved customer experience and expanded product range."
    }
  ];

  const awards = [
    {
      year: "2024",
      title: "Best E-commerce Platform",
      organization: "Zimbabwe Digital Awards"
    },
    {
      year: "2024",
      title: "Customer Choice Award",
      organization: "Tech Retail Excellence"
    },
    {
      year: "2023",
      title: "Innovation in Retail",
      organization: "African Retail Summit"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Press & Media</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest news, announcements, and achievements from Gadget Genie. 
            Find press releases, media assets, and contact information for media inquiries.
          </p>
        </div>

        {/* Press Releases */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Press Releases</h2>
          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(release.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{release.title}</h3>
                <p className="text-gray-600 mb-4">{release.excerpt}</p>
                <button className="text-blue-600 hover:text-blue-800 font-semibold flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Download Full Release
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Awards & Recognition */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Awards & Recognition</h2>
            <div className="space-y-4">
              {awards.map((award, index) => (
                <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <Award className="w-8 h-8 text-yellow-500 mr-4" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{award.title}</h3>
                    <p className="text-sm text-gray-600">{award.organization} • {award.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Media Assets</h2>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold mb-2">Company Logo Pack</h3>
                <p className="text-sm text-gray-600 mb-3">High-resolution logos in various formats</p>
                <button className="text-blue-600 hover:text-blue-800 font-semibold">Download ZIP</button>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold mb-2">Product Images</h3>
                <p className="text-sm text-gray-600 mb-3">Professional product photography</p>
                <button className="text-blue-600 hover:text-blue-800 font-semibold">Download ZIP</button>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold mb-2">Executive Photos</h3>
                <p className="text-sm text-gray-600 mb-3">Leadership team headshots</p>
                <button className="text-blue-600 hover:text-blue-800 font-semibold">Download ZIP</button>
              </div>
            </div>
          </div>
        </div>

        {/* Media Contact */}
        <div className="bg-gray-900 text-white rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Mail className="w-8 h-8 text-blue-400 mb-4" />
              <h2 className="text-2xl font-bold mb-4">Media Inquiries</h2>
              <p className="text-gray-300 mb-6">
                For press inquiries, interview requests, or additional information, please contact our media team.
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> press@gadgetgenie.org</p>
                <p><strong>Phone:</strong> +263719337910</p>
                <p><strong>Response Time:</strong> 24-48 hours</p>
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Quick Facts</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400">Founded:</span>
                  <span className="ml-2">2020</span>
                </div>
                <div>
                  <span className="text-gray-400">Location:</span>
                  <span className="ml-2">Harare, Zimbabwe</span>
                </div>
                <div>
                  <span className="text-gray-400">Products:</span>
                  <span className="ml-2">10,000+ Electronics</span>
                </div>
                <div>
                  <span className="text-gray-400">Customers:</span>
                  <span className="ml-2">50,000+ Served</span>
                </div>
                <div>
                  <span className="text-gray-400">Coverage:</span>
                  <span className="ml-2">Nationwide Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Press;
