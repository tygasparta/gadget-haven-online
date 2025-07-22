
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Calendar, Download, ExternalLink, Award, TrendingUp, Users, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Press = () => {
  const pressReleases = [
    {
      date: '2025-01-15',
      title: 'GadgetGenie Reaches 50,000 Happy Customers Milestone',
      excerpt: 'Leading e-commerce platform celebrates major growth milestone with expansion into new markets.',
      category: 'Company News'
    },
    {
      date: '2025-01-10',
      title: 'Partnership Announcement: Major Tech Brand Collaboration',
      excerpt: 'GadgetGenie announces exclusive partnership to bring cutting-edge products to customers.',
      category: 'Partnerships'
    },
    {
      date: '2024-12-20',
      title: 'Year-End Review: Record-Breaking Sales and Customer Satisfaction',
      excerpt: 'Company reports 300% growth in sales and 98% customer satisfaction rating for 2024.',
      category: 'Financial'
    },
    {
      date: '2024-12-01',
      title: 'GadgetGenie Wins E-commerce Excellence Award',
      excerpt: 'Platform recognized for outstanding customer service and innovative shopping experience.',
      category: 'Awards'
    }
  ];

  const mediaKit = [
    { name: 'Company Logo (PNG)', size: '2.4 MB', type: 'Logo Package' },
    { name: 'Brand Guidelines', size: '5.1 MB', type: 'Brand Guide' },
    { name: 'Executive Photos', size: '8.7 MB', type: 'Photography' },
    { name: 'Product Images', size: '12.3 MB', type: 'Photography' }
  ];

  const stats = [
    { icon: Users, label: 'Active Customers', value: '50K+', color: 'from-blue-500 to-blue-600' },
    { icon: Globe, label: 'Countries Served', value: '25+', color: 'from-green-500 to-green-600' },
    { icon: TrendingUp, label: 'Monthly Growth', value: '15%', color: 'from-purple-500 to-purple-600' },
    { icon: Award, label: 'Industry Awards', value: '8', color: 'from-orange-500 to-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Press <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">&</span> Media
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Stay updated with the latest news, announcements, and milestones from GadgetGenie. 
            Access our media resources and connect with our press team.
          </p>
          <Button size="lg" className="px-8">
            Contact Press Team
          </Button>
        </div>

        {/* Company Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg text-center transform hover:scale-105 transition-all duration-300">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Press Releases */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Press Releases</h2>
          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        {release.category}
                      </span>
                      <span className="flex items-center text-gray-500 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(release.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{release.title}</h3>
                    <p className="text-gray-600">{release.excerpt}</p>
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0 md:ml-6">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Read More
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Media Kit */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Media Kit</h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            Download our complete media kit including logos, brand guidelines, executive photos, and product images.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {mediaKit.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-6 border border-gray-200 rounded-2xl hover:border-blue-300 transition-colors">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{item.type}</span>
                    <span>{item.size}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button size="lg">
              Download Complete Media Kit
            </Button>
          </div>
        </div>

        {/* About Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About GadgetGenie</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              GadgetGenie is a leading e-commerce platform specializing in cutting-edge technology and innovative gadgets. 
              Founded in 2020, we've grown to serve over 50,000 customers across 25+ countries.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Our mission is to make the latest technology accessible to everyone by providing competitive prices, 
              exceptional customer service, and a seamless shopping experience.
            </p>
            <div className="space-y-2">
              <p className="text-gray-600"><strong>Founded:</strong> 2020</p>
              <p className="text-gray-600"><strong>Headquarters:</strong> Harare, Zimbabwe</p>
              <p className="text-gray-600"><strong>CEO:</strong> GadgetGenie Team</p>
              <p className="text-gray-600"><strong>Employees:</strong> 50+</p>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Press Contact</h2>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Media Inquiries</h3>
              <div className="space-y-3">
                <p className="text-gray-600">
                  <strong>Email:</strong> press@gadgetgenie.org
                </p>
                <p className="text-gray-600">
                  <strong>Phone:</strong> +263 719 337 910
                </p>
                <p className="text-gray-600">
                  <strong>Address:</strong> Harare, Zimbabwe
                </p>
              </div>
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-2">Response Time</h4>
                <p className="text-gray-600 text-sm">
                  We typically respond to media inquiries within 24 hours during business days.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Feature Our Story?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            We're always excited to share our journey and insights with media partners. 
            Get in touch to schedule interviews or request additional information.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              Schedule Interview
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10">
              Request Information
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Press;
