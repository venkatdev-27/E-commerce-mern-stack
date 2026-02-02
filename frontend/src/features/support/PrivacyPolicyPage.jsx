import React from "react";
import { Shield, Lock, Eye, FileText } from "lucide-react";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <Eye size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  1. Information We Collect
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                We collect information you provide directly to us, such as when you create an account, update your profile, make a purchase, or communicate with us. This may include your name, email address, phone number, shipping address, and payment information.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Personal identification information (Name, email address, phone number, etc.)</li>
                <li>Billing and shipping details</li>
                <li>Payment transaction history</li>
              </ul>
            </section>
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  <FileText size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  2. How We Use Your Information
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                We use the information we collect to operate, maintain, and provide you with the features and functionality of the Service, to process and complete transactions, and to send you related information, including purchase confirmations and invoices.
              </p>
            </section>
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                  <Lock size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  3. Data Security
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems.
              </p>
            </section>
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg text-red-600">
                  <Shield size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  4. Third-Party Disclosure
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
