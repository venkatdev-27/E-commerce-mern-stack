import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, Send, MessageCircle, HelpCircle } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { submitSupportMessage } from "../../src/api/support.api";

const SupportPage = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
await new Promise((resolve) => setTimeout(resolve, 3000));
      await submitSupportMessage(formData);

      addToast(
        "Message sent successfully! We will get back to you soon.",
        "success"
      );
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error submitting support message:", error);
      addToast(
        "Failed to send message. Please try again.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How can we help you?
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Our dedicated support team is here to assist you with any questions or concerns. Choose the method that works best for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Phone Support</h3>
                <p className="text-gray-500 text-sm mb-2">
                  Mon-Fri from 8am to 5pm
                </p>
                <a
                  href="tel:+1234567890"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  +91 7013269473
                </a>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Email Us</h3>
                <p className="text-gray-500 text-sm mb-2">
                  We usually reply within 24h/7
                </p>
                <a
                  href="mailto:luxemarket008@gmail.com"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  luxemarket008@gmail.com
                </a>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                <MessageCircle size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">About LuxeMarket</h3>
                <p className="text-gray-500 text-sm mb-2">
                  Your premium destination for fashion, electronics, and lifestyle products
                </p>
                <p className="text-sm text-gray-600">
                  Discover curated collections from top brands with authentic products and exceptional customer service.
                </p>
              </div>
            </div>
            <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg mt-8">
              <HelpCircle size={32} className="mb-4 text-indigo-200" />
              <h3 className="font-bold text-xl mb-2">Why Choose Us?</h3>
              <ul className="text-indigo-100 mb-4 space-y-1 text-sm">
                <li>• 100% Authentic Products</li>
                <li>• Fast & Secure Delivery</li>
                <li>• 30-Day Return Policy</li>
                <li>• 24/7 Customer Support</li>
              </ul>
              <button
                onClick={() => navigate('/')}
                className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-bold text-sm w-full hover:bg-indigo-50 transition-colors"
              >
                Shop Now
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Send us a message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                    placeholder="Describe your issue or question..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} /> Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
