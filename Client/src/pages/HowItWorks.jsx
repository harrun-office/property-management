import { Link } from 'react-router-dom';

function HowItWorks() {
  const tenantSteps = [
    {
      number: 1,
      title: 'Create Your Account',
      description: 'Sign up as a tenant in just a few seconds. No credit card required, completely free to browse properties.'
    },
    {
      number: 2,
      title: 'Search Properties',
      description: 'Use our advanced filters to find properties that match your budget, preferred location, number of bedrooms, and other criteria.'
    },
    {
      number: 3,
      title: 'View Details',
      description: 'Browse detailed property listings with high-quality photos, descriptions, amenities, and location information.'
    },
    {
      number: 4,
      title: 'Contact Owner',
      description: 'Message property owners directly through the platform to ask questions, schedule viewings, or discuss rental terms.'
    },
    {
      number: 5,
      title: 'Apply & Move In',
      description: 'Submit your application, sign the lease, and move into your new home. Pay rent securely online once you\'re settled.'
    }
  ];

  const ownerSteps = [
    {
      number: 1,
      title: 'Register as Owner',
      description: 'Create your owner account and verify your identity. This helps build trust with potential tenants.'
    },
    {
      number: 2,
      title: 'List Your Property',
      description: 'Add property details, upload photos, set pricing, and publish your listing. It takes just a few minutes.'
    },
    {
      number: 3,
      title: 'Receive Inquiries',
      description: 'Get notified when tenants are interested in your property. Review their profiles and respond to inquiries.'
    },
    {
      number: 4,
      title: 'Manage Tenants',
      description: 'Once tenants move in, manage everything from your dashboard: rent collection, maintenance requests, and communications.'
    },
    {
      number: 5,
      title: 'Track Performance',
      description: 'Monitor your property\'s performance with analytics, view rental income, and generate reports for tax purposes.'
    }
  ];

  const faqs = [
    {
      question: 'Is PropManage free to use?',
      answer: 'Yes! Browsing properties is completely free for tenants. Property owners can list unlimited properties with no commission fees.'
    },
    {
      question: 'How do I choose which role to register as?',
      answer: 'If you\'re looking for a property to rent, choose "Tenant". If you own properties and want to list them, choose "Property Owner". You can always create multiple accounts if needed.'
    },
    {
      question: 'What information do I need to register?',
      answer: 'You only need your name, email address, and a password. No credit card or payment information is required to create an account.'
    },
    {
      question: 'Can I browse properties without registering?',
      answer: 'Yes! You can browse all available properties without creating an account. However, you\'ll need to register to contact owners, save favorites, or submit applications.'
    },
    {
      question: 'How do I contact a property owner?',
      answer: 'Once you create an account as a tenant, you can message property owners directly through the platform. They typically respond within 24 hours.'
    },
    {
      question: 'Can I list multiple properties?',
      answer: 'Absolutely! Property owners can list as many properties as they want. There are no limits or additional fees for multiple listings.'
    },
    {
      question: 'How secure is the platform?',
      answer: 'We use industry-standard security measures including encryption, secure authentication, and regular security audits to protect your data.'
    },
    {
      question: 'When will online rent payment be available?',
      answer: 'We\'re actively working on the online payment feature and plan to launch it soon. Stay tuned for updates!'
    },
    {
      question: 'What if I have issues with my property or tenant?',
      answer: 'Our support team is available 24/7 to help resolve any issues. You can contact us through the platform or email support.'
    }
  ];

  return (
    <div className="min-h-screen bg-porcelain">
      <section className="bg-obsidian text-porcelain py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-porcelain">How It Works</h1>
          <p className="text-xl md:text-2xl text-stone-200 max-w-3xl mx-auto">
            Simple steps to find your perfect property or manage your listings
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 px-4 bg-stone-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-charcoal">What is PropManage?</h2>
          <p className="text-xl text-charcoal leading-relaxed mb-6">
            PropManage is a comprehensive property management platform that connects tenants and property owners. 
            Whether you're looking for a place to rent or managing rental properties, our platform simplifies the entire process.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-porcelain p-6 rounded-xl border border-stone-200">
              <h3 className="font-semibold text-lg mb-2 text-charcoal">Who Can Use It?</h3>
              <p className="text-architectural text-sm">Tenants, property owners, and property managers—everyone involved in the rental market.</p>
            </div>
            <div className="bg-porcelain p-6 rounded-xl border border-stone-200">
              <h3 className="font-semibold text-lg mb-2 text-charcoal">What Problems Does It Solve?</h3>
              <p className="text-architectural text-sm">Fragmented property search, difficult tenant management, commission fees, and lack of communication tools.</p>
            </div>
            <div className="bg-porcelain p-6 rounded-xl border border-stone-200">
              <h3 className="font-semibold text-lg mb-2 text-charcoal">Why Choose Us?</h3>
              <p className="text-architectural text-sm">Free for tenants, no commission fees for owners, all-in-one platform, and secure communication.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Choose Your Path Section */}
      <section className="py-16 px-4 bg-porcelain">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-charcoal">Choose Your Path</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-stone-100 p-8 rounded-xl shadow-md border-2 border-stone-300">
              <div className="flex items-center mb-4">
                <svg className="w-12 h-12 text-obsidian mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-2xl font-semibold text-charcoal">I'm a Tenant</h3>
              </div>
              <p className="text-architectural mb-4">Looking for a property to rent? Register as a tenant to:</p>
              <ul className="space-y-2 mb-6 text-architectural">
                <li className="flex items-start">
                  <span className="text-obsidian mr-2">✓</span>
                  <span>Search and filter thousands of properties</span>
                </li>
                <li className="flex items-start">
                  <span className="text-obsidian mr-2">✓</span>
                  <span>Save favorite properties</span>
                </li>
                <li className="flex items-start">
                  <span className="text-obsidian mr-2">✓</span>
                  <span>Contact property owners directly</span>
                </li>
                <li className="flex items-start">
                  <span className="text-obsidian mr-2">✓</span>
                  <span>Track your applications</span>
                </li>
              </ul>
              <Link
                to="/for-tenants"
                className="inline-block px-6 py-3 bg-obsidian text-porcelain rounded-xl font-semibold hover:bg-obsidian-light transition-colors"
              >
                Learn More About Tenant Features
              </Link>
            </div>
            <div className="bg-stone-100 p-8 rounded-xl shadow-md border-2 border-stone-300">
              <div className="flex items-center mb-4">
                <svg className="w-12 h-12 text-obsidian mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="text-2xl font-semibold text-charcoal">I'm a Property Owner</h3>
              </div>
              <p className="text-architectural mb-4">Managing rental properties? Register as an owner to:</p>
              <ul className="space-y-2 mb-6 text-architectural">
                <li className="flex items-start">
                  <span className="text-obsidian mr-2">✓</span>
                  <span>List unlimited properties (no commission fees!)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-obsidian mr-2">✓</span>
                  <span>Reach thousands of potential tenants</span>
                </li>
                <li className="flex items-start">
                  <span className="text-obsidian mr-2">✓</span>
                  <span>Manage tenants and track income</span>
                </li>
                <li className="flex items-start">
                  <span className="text-obsidian mr-2">✓</span>
                  <span>View analytics and reports</span>
                </li>
              </ul>
              <Link
                to="/for-owners"
                className="inline-block px-6 py-3 bg-obsidian text-porcelain rounded-xl font-semibold hover:bg-obsidian-light transition-colors"
              >
                Learn More About Owner Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* For Tenants */}
      <section className="py-16 px-4 bg-stone-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-charcoal">For Tenants</h2>
            <p className="text-xl text-architectural">Find and rent your perfect property in 5 easy steps</p>
          </div>
          <div className="space-y-8">
            {tenantSteps.map((step) => (
              <div key={step.number} className="flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-obsidian text-porcelain rounded-full flex items-center justify-center font-bold text-2xl mr-6">
                  {step.number}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-semibold text-charcoal">{step.title}</h3>
                    <span className="text-sm text-stone-600 bg-porcelain px-3 py-1 rounded-full">~2 minutes</span>
                  </div>
                  <p className="text-architectural text-lg">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/for-tenants"
              className="inline-block px-8 py-4 bg-obsidian text-porcelain rounded-xl font-semibold text-lg hover:bg-obsidian-light transition-colors"
            >
              Learn More About Tenant Features
            </Link>
          </div>
        </div>
      </section>

      {/* For Owners */}
      <section className="py-16 px-4 bg-porcelain">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-charcoal">For Property Owners</h2>
            <p className="text-xl text-architectural">Manage your properties efficiently in 5 simple steps</p>
          </div>
          <div className="space-y-8">
            {ownerSteps.map((step) => (
              <div key={step.number} className="flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-obsidian text-porcelain rounded-full flex items-center justify-center font-bold text-2xl mr-6">
                  {step.number}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-semibold text-charcoal">{step.title}</h3>
                    <span className="text-sm text-stone-600 bg-porcelain px-3 py-1 rounded-full">~5 minutes</span>
                  </div>
                  <p className="text-architectural text-lg">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/for-owners"
              className="inline-block px-8 py-4 bg-obsidian text-porcelain rounded-xl font-semibold text-lg hover:bg-obsidian-light transition-colors"
            >
              Learn More About Owner Features
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-stone-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-charcoal">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-porcelain rounded-xl p-6 border border-stone-200">
                <h3 className="text-xl font-semibold mb-3 text-charcoal">{faq.question}</h3>
                <p className="text-architectural">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-obsidian text-porcelain">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-porcelain">Ready to Get Started?</h2>
          <p className="text-xl text-stone-200 mb-8">
            Join thousands of users who are simplifying property management
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-brass text-porcelain rounded-xl font-semibold text-lg hover:bg-brass-light transition-colors shadow-lg"
            >
              Create Account
            </Link>
            <Link
              to="/properties"
              className="px-8 py-4 bg-transparent border-2 border-porcelain text-porcelain rounded-xl font-semibold text-lg hover:bg-porcelain hover:text-obsidian transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HowItWorks;

