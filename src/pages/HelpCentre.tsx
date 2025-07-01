
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Search, ChevronDown, ChevronRight, HelpCircle, MessageCircle, Phone, Mail } from 'lucide-react';

const HelpCentre = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqCategories = [
    {
      title: "Orders & Shipping",
      faqs: [
        {
          question: "How can I track my order?",
          answer: "You can track your order by visiting the Track Order page and entering your order number and email address. You'll also receive tracking updates via SMS and email."
        },
        {
          question: "What are your delivery times?",
          answer: "We deliver within 2-5 business days in Harare, and 3-7 business days to other cities in Zimbabwe. Express shipping options are available for faster delivery."
        },
        {
          question: "Do you deliver nationwide?",
          answer: "Yes, we deliver to all major cities and towns across Zimbabwe including Harare, Bulawayo, Mutare, Gweru, and many more locations."
        }
      ]
    },
    {
      title: "Products & Pricing",
      faqs: [
        {
          question: "Are your products authentic?",
          answer: "Yes, all our products are 100% authentic and sourced directly from authorized distributors and manufacturers. We guarantee the authenticity of every item we sell."
        },
        {
          question: "Do you offer warranty on products?",
          answer: "Yes, all products come with manufacturer's warranty. The warranty period varies by product type - typically 1-2 years for electronics and smartphones."
        },
        {
          question: "How often do you update your prices?",
          answer: "Our prices are updated regularly to ensure competitiveness. Flash sales and special promotions are updated daily, while regular prices may change weekly."
        }
      ]
    },
    {
      title: "Returns & Refunds",
      faqs: [
        {
          question: "What is your return policy?",
          answer: "We offer a 14-day return policy for most items. Products must be in original condition with all accessories and packaging. Some restrictions apply to certain categories."
        },
        {
          question: "How long do refunds take?",
          answer: "Refunds are processed within 5-7 business days after we receive and inspect the returned item. The refund will be credited to your original payment method."
        },
        {
          question: "Can I exchange a product?",
          answer: "Yes, we offer exchanges for defective products or size/color variations where applicable. Contact our customer service team to initiate an exchange."
        }
      ]
    },
    {
      title: "Account & Payment",
      faqs: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, MasterCard), mobile money payments, bank transfers, and cash on delivery for select areas."
        },
        {
          question: "Is it safe to shop on your website?",
          answer: "Yes, our website uses SSL encryption to protect your personal and payment information. We also comply with international security standards for online transactions."
        },
        {
          question: "Do I need an account to make a purchase?",
          answer: "While you can checkout as a guest, creating an account allows you to track orders, save addresses, view purchase history, and receive exclusive offers."
        }
      ]
    }
  ];

  const contactOptions = [
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak with our customer service team",
      action: "+263719337910",
      availability: "Mon-Sat: 8AM-6PM"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us your questions anytime",
      action: "support@gadgetgenie.org",
      availability: "Response within 24 hours"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support agents",
      action: "Start Chat",
      availability: "Mon-Fri: 9AM-5PM"
    }
  ];

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Help Centre</h1>
          <p className="text-xl text-gray-600 mb-8">
            Find answers to frequently asked questions or get in touch with our support team
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
            
            {filteredFAQs.length > 0 ? (
              <div className="space-y-6">
                {filteredFAQs.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{category.title}</h3>
                    <div className="space-y-4">
                      {category.faqs.map((faq, faqIndex) => {
                        const globalIndex = categoryIndex * 100 + faqIndex;
                        return (
                          <div key={faqIndex} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                            <button
                              onClick={() => toggleFAQ(globalIndex)}
                              className="flex items-center justify-between w-full text-left py-2"
                            >
                              <span className="font-medium text-gray-900">{faq.question}</span>
                              {expandedFAQ === globalIndex ? (
                                <ChevronDown className="w-5 h-5 text-gray-500" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-gray-500" />
                              )}
                            </button>
                            {expandedFAQ === globalIndex && (
                              <div className="mt-2 text-gray-600">
                                {faq.answer}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : searchTerm ? (
              <div className="text-center py-12">
                <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">Try searching with different keywords or browse our contact options below.</p>
              </div>
            ) : null}
          </div>

          {/* Contact Options */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Need More Help?</h2>
            <div className="space-y-4">
              {contactOptions.map((option, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <option.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{option.title}</h3>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">{option.availability}</div>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    {option.action}
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Links */}
            <div className="bg-gray-100 rounded-lg p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="/track-order" className="block text-blue-600 hover:text-blue-800">Track Your Order</a>
                <a href="/returns" className="block text-blue-600 hover:text-blue-800">Return Policy</a>
                <a href="/shipping-info" className="block text-blue-600 hover:text-blue-800">Shipping Information</a>
                <a href="/warranty" className="block text-blue-600 hover:text-blue-800">Warranty Claims</a>
                <a href="/contact" className="block text-blue-600 hover:text-blue-800">Contact Us</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HelpCentre;
