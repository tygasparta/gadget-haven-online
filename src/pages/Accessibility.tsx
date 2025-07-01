
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Accessibility = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Accessibility Statement</h1>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-gray-600 mb-6">Last updated: January 1, 2025</p>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment</h2>
              <p className="text-gray-600">Gadget Genie is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Accessibility Features</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Keyboard navigation support</li>
                <li>Screen reader compatibility</li>
                <li>High contrast color schemes</li>
                <li>Scalable text and images</li>
                <li>Alternative text for images</li>
                <li>Clear page structure and headings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Standards</h2>
              <p className="text-gray-600">We strive to conform to Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These guidelines help make web content more accessible to people with disabilities.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Feedback and Assistance</h2>
              <p className="text-gray-600 mb-4">We welcome your feedback on the accessibility of our website. If you encounter any accessibility barriers or need assistance, please contact us:</p>
              <ul className="space-y-2 text-gray-600">
                <li><strong>Email:</strong> accessibility@gadgetgenie.org</li>
                <li><strong>Phone:</strong> +263719337910</li>
                <li><strong>Address:</strong> Gadget Genie, Harare, Zimbabwe</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ongoing Efforts</h2>
              <p className="text-gray-600">We regularly review our website and services to identify and address accessibility issues. Our team receives ongoing training on accessibility best practices and we work with accessibility experts to improve our offerings.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Browser and Assistive Technology Support</h2>
              <p className="text-gray-600 mb-4">Our website is designed to work with:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Modern web browsers (Chrome, Firefox, Safari, Edge)</li>
                <li>Screen readers (JAWS, NVDA, VoiceOver)</li>
                <li>Voice recognition software</li>
                <li>Keyboard-only navigation</li>
              </ul>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Accessibility;
