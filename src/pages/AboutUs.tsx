
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { MapPin, Phone, Mail, Users, Award, Shield, Truck } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About Gadget Genie</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Zimbabwe's premier destination for cutting-edge technology. We've been serving tech enthusiasts 
            with the latest smartphones, electronics, and home appliances since our inception.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded with a vision to bring the latest technology to Zimbabwe, Gadget Genie has grown 
              from a small startup to the country's most trusted electronics retailer. We believe that 
              everyone deserves access to quality technology at competitive prices.
            </p>
            <p className="text-gray-600 mb-4">
              Our journey began with a simple mission: to make technology accessible, affordable, and 
              reliable for every Zimbabwean. Today, we serve thousands of customers nationwide with 
              fast delivery and exceptional customer service.
            </p>
            <p className="text-gray-600">
              We're not just a retailer – we're your technology partner, helping you stay connected 
              to what matters most in an increasingly digital world.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Us</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Shield className="w-6 h-6 text-blue-500 mr-3" />
                <span>Authentic products with warranty</span>
              </div>
              <div className="flex items-center">
                <Truck className="w-6 h-6 text-blue-500 mr-3" />
                <span>Fast nationwide delivery</span>
              </div>
              <div className="flex items-center">
                <Award className="w-6 h-6 text-blue-500 mr-3" />
                <span>Award-winning customer service</span>
              </div>
              <div className="flex items-center">
                <Users className="w-6 h-6 text-blue-500 mr-3" />
                <span>Expert technical support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trust</h3>
              <p className="text-gray-600">We build lasting relationships through transparency and reliability.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-gray-600">We strive for excellence in every product and service we offer.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-600">We're committed to serving and supporting our local community.</p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-gray-900 text-white rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <Phone className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <p className="font-semibold">Call Us</p>
              <p>+263719337910</p>
            </div>
            <div>
              <Mail className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <p className="font-semibold">Email Us</p>
              <p>info@gadgetgenie.org</p>
            </div>
            <div>
              <MapPin className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <p className="font-semibold">Visit Us</p>
              <p>Harare, Zimbabwe</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;
