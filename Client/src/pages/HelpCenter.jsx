import { useState } from 'react';
import { Link } from 'react-router-dom';

function HelpCenter() {
  const [openCategory, setOpenCategory] = useState(null);

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Click on the "Register" button in the top right corner, fill in your details, and choose your role (Tenant, Property Owner, etc.).'
        },
        {
          q: 'What roles are available?',
          a: 'We support Tenants, Property Owners, Property Managers, and Vendors. Each role has specific features tailored to their needs.'
        },
        {
          q: 'Is there a fee to use the platform?',
          a: 'No! PropManage is completely free for tenants. Property owners can list unlimited properties with zero commission fees.'
        }
      ]
    },
    {
      category: 'For Tenants',
      questions: [
        {
          q: 'How do I apply for a property?',
          a: 'Browse properties, click on one you like, and click the "Apply" button. Fill in your application details and submit.'
        },
        {
          q: 'Can I save properties?',
          a: 'Yes! Click the heart icon on any property to save it to your favorites. Access them from your dashboard.'
        },
        {
          q: 'How do I track my applications?',
          a: 'Go to your Tenant Dashboard and click on "My Applications" to see the status of all your applications.'
        }
      ]
    },
    {
      category: 'For Property Owners',
      questions: [
        {
          q: 'How do I list a property?',
          a: 'After logging in as a property owner, click "Post Property" in the header or go to your dashboard and click "Add Property".'
        },
        {
          q: 'How do I manage applications?',
          a: 'Go to your dashboard and click on "Applications" to view, approve, or reject tenant applications.'
        },
        {
          q: 'How do I receive payments?',
          a: 'Payments are tracked in your dashboard. You can view payment history and status in the Payments section.'
        }
      ]
    },
    {
      category: 'Technical Support',
      questions: [
        {
          q: 'I forgot my password. How do I reset it?',
          a: 'Click on "Login" and then "Forgot Password". Enter your email and follow the instructions sent to your inbox.'
        },
        {
          q: 'How do I update my profile?',
          a: 'Click on your profile icon in the top right, then select "Profile Settings" to update your information.'
        },
        {
          q: 'Who do I contact for help?',
          a: 'You can reach our support team at support@propmanage.com or use the contact form on the About page.'
        }
      ]
    }
  ];

  const toggleCategory = (index) => {
    setOpenCategory(openCategory === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-charcoal mb-2">Help Center</h1>
        <p className="text-architectural mb-8">Find answers to common questions and get help using PropManage</p>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full px-4 py-3 pl-12 rounded-lg bg-stone-100 border border-stone-200 text-charcoal placeholder-architectural focus:outline-none focus:ring-2 focus:ring-obsidian focus:border-obsidian"
            />
            <svg className="absolute left-4 top-3.5 w-5 h-5 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-4">
          {faqs.map((category, index) => (
            <div key={index} className="bg-stone-100 rounded-xl border border-stone-200 overflow-hidden">
              <button
                onClick={() => toggleCategory(index)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-stone-200 transition-colors"
              >
                <h2 className="text-xl font-semibold text-charcoal">{category.category}</h2>
                <svg
                  className={`w-5 h-5 text-architectural transform transition-transform ${openCategory === index ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openCategory === index && (
                <div className="px-6 py-4 border-t border-stone-200 space-y-4">
                  {category.questions.map((faq, qIndex) => (
                    <div key={qIndex} className="pb-4 last:pb-0 border-b border-stone-200 last:border-b-0">
                      <h3 className="font-semibold text-charcoal mb-2">{faq.q}</h3>
                      <p className="text-architectural text-sm">{faq.a}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-8 bg-obsidian text-porcelain p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <p className="text-stone-200 mb-6">Our support team is here to help you 24/7</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:support@propmanage.com"
              className="px-6 py-3 bg-brass text-porcelain rounded-lg hover:bg-brass-light transition-colors text-center font-semibold"
            >
              Email Support
            </a>
            <Link
              to="/about"
              className="px-6 py-3 bg-transparent border-2 border-porcelain text-porcelain rounded-lg hover:bg-porcelain hover:text-obsidian transition-colors text-center font-semibold"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpCenter;

