
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { MapPin, Clock, Users, Briefcase, Heart, Coffee, Zap, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Careers = () => {
  const benefits = [
    { icon: Heart, title: 'Health Insurance', description: 'Comprehensive medical coverage for you and your family' },
    { icon: Coffee, title: 'Flexible Hours', description: 'Work-life balance with flexible scheduling options' },
    { icon: Zap, title: 'Learning Budget', description: 'Annual budget for courses, conferences, and skill development' },
    { icon: Trophy, title: 'Performance Bonus', description: 'Quarterly bonuses based on individual and team performance' }
  ];

  const jobs = [
    {
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Harare, Zimbabwe',
      type: 'Full-time',
      description: 'Join our engineering team to build amazing user experiences for our e-commerce platform.',
      requirements: ['5+ years React experience', 'TypeScript proficiency', 'UI/UX design sense']
    },
    {
      title: 'Product Manager',
      department: 'Product',
      location: 'Remote',
      type: 'Full-time',
      description: 'Lead product strategy and roadmap for our mobile and web applications.',
      requirements: ['3+ years product management', 'E-commerce experience', 'Data-driven mindset']
    },
    {
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Harare, Zimbabwe',
      type: 'Full-time',
      description: 'Help our customers succeed and grow their satisfaction with our platform.',
      requirements: ['Customer service experience', 'Excellent communication', 'Problem-solving skills']
    },
    {
      title: 'Digital Marketing Specialist',
      department: 'Marketing',
      location: 'Hybrid',
      type: 'Full-time',
      description: 'Drive growth through innovative digital marketing campaigns and strategies.',
      requirements: ['Digital marketing experience', 'SEO/SEM knowledge', 'Analytics proficiency']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Join the <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">GadgetGenie</span> Team
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Help us revolutionize the way people discover and buy technology. 
            We're looking for passionate individuals who want to make a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">View Open Positions</Button>
            <Button variant="outline" size="lg" className="px-8">Learn About Our Culture</Button>
          </div>
        </div>

        {/* Company Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Users, label: 'Team Members', value: '50+' },
            { icon: MapPin, label: 'Locations', value: '3' },
            { icon: Briefcase, label: 'Open Roles', value: '12' },
            { icon: Clock, label: 'Avg. Tenure', value: '3.2 yrs' }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Why Work With Us */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Work With Us?</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                At GadgetGenie, we believe technology should be accessible to everyone. 
                We're building the future of e-commerce, one innovation at a time.
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Culture</h3>
              <p className="text-gray-600 leading-relaxed">
                We foster a collaborative environment where creativity thrives, 
                learning never stops, and every team member's voice matters.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop" 
                alt="Team working together"
                className="rounded-2xl shadow-lg w-full"
              />
            </div>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-gray-50">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Open Positions</h2>
          <div className="space-y-6">
            {jobs.map((job, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-1" />
                        {job.department}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <Button className="mt-4 md:mt-0">Apply Now</Button>
                </div>
                <p className="text-gray-600 mb-4">{job.description}</p>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {job.requirements.map((req, reqIndex) => (
                      <li key={reqIndex}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Us?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Don't see a perfect fit? We're always looking for talented individuals. 
            Send us your resume and tell us how you'd like to contribute.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-blue-600 hover:bg-gray-100">Send Resume</Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10">
              careers@gadgetgenie.org
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Careers;
