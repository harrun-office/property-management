import FeatureCard from '../components/FeatureCard';

function Features() {
  const currentFeatures = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: 'Advanced Property Search',
      description: 'Powerful filtering system to find properties by price, location, bedrooms, bathrooms, property type, and more. Save your searches for quick access.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      title: 'Property Listing Management',
      description: 'Easy-to-use dashboard for property owners to create, edit, and manage property listings. Upload multiple photos, add detailed descriptions, and update availability in real-time.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'User Authentication & Roles',
      description: 'Secure login system with separate roles for tenants and property owners. Each role has access to features tailored to their needs.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: 'Direct Communication',
      description: 'Built-in messaging system for tenants and owners to communicate directly. Ask questions, schedule viewings, and discuss property details.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Secure Platform',
      description: 'Industry-standard security measures to protect user data and ensure safe transactions. Regular security audits and updates.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Mobile Responsive',
      description: 'Fully responsive design that works seamlessly on desktop, tablet, and mobile devices. Access your properties and listings from anywhere.'
    }
  ];

  const comingSoonFeatures = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Online Rent Payment',
      description: 'Secure online payment system for tenants to pay rent directly through the platform. Support for credit cards, bank transfers, and automatic recurring payments.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Analytics & Reports',
      description: 'Comprehensive analytics dashboard for property owners. Track property performance, rental income, occupancy rates, and generate detailed reports.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Lease Management',
      description: 'Digital lease agreements, e-signatures, and automated lease renewal reminders. Store all lease documents securely in the cloud.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Maintenance Requests',
      description: 'Tenants can submit maintenance requests directly through the platform. Owners can track, assign, and manage all maintenance tasks efficiently.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      title: 'Reviews & Ratings',
      description: 'Tenants can leave reviews and ratings for properties and landlords. Help build trust and transparency in the rental market.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Automated Reminders',
      description: 'Automated email and SMS reminders for rent due dates, lease renewals, maintenance schedules, and important property-related deadlines.'
    }
  ];

  return (
    <div className="min-h-screen bg-porcelain">
      <section className="bg-obsidian text-porcelain py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-porcelain">Platform Features</h1>
          <p className="text-xl md:text-2xl text-stone-200 max-w-3xl mx-auto">
            Everything you need to manage properties and find your perfect home
          </p>
        </div>
      </section>

      {/* Why PropManage Section */}
      <section className="py-16 px-4 bg-stone-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-charcoal">Why PropManage?</h2>
          <p className="text-xl text-charcoal leading-relaxed mb-8">
            PropManage is designed to solve the common pain points in property management. Whether you're a tenant searching 
            for a home or a property owner managing rentals, our platform provides all the tools you need in one secure, 
            easy-to-use system.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-porcelain p-6 rounded-xl border border-stone-200">
              <h3 className="text-lg font-semibold mb-2 text-charcoal">For Tenants</h3>
              <p className="text-architectural text-sm">Find properties, save favorites, contact owners, and track applications—all free.</p>
            </div>
            <div className="bg-porcelain p-6 rounded-xl border border-stone-200">
              <h3 className="text-lg font-semibold mb-2 text-charcoal">For Property Owners</h3>
              <p className="text-architectural text-sm">List properties, manage tenants, track income, and handle maintenance—no commission fees.</p>
            </div>
            <div className="bg-porcelain p-6 rounded-xl border border-stone-200">
              <h3 className="text-lg font-semibold mb-2 text-charcoal">For Everyone</h3>
              <p className="text-architectural text-sm">Secure platform, mobile-friendly, direct communication, and 24/7 support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features by User Type */}
      <section className="py-16 px-4 bg-porcelain">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-charcoal">Features by User Type</h2>
          <p className="text-center text-architectural mb-12">See what features are available for each role</p>
          
          {/* Tenant Features */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6 text-charcoal flex items-center">
              <svg className="w-8 h-8 mr-2 text-obsidian" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Tenant Features
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentFeatures.filter((_, i) => [0, 2, 3].includes(i)).map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>

          {/* Owner Features */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6 text-charcoal flex items-center">
              <svg className="w-8 h-8 mr-2 text-obsidian" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Property Owner Features
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentFeatures.filter((_, i) => [1, 4].includes(i)).map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>

          {/* Shared Features */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-charcoal flex items-center">
              <svg className="w-8 h-8 mr-2 text-obsidian" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Shared Features
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentFeatures.filter((_, i) => [5].includes(i)).map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 px-4 bg-stone-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-charcoal">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-stone-100 rounded-xl shadow-md border border-stone-200">
              <thead>
                <tr className="bg-obsidian text-porcelain">
                  <th className="p-4 text-left">Feature</th>
                  <th className="p-4 text-center">Tenant</th>
                  <th className="p-4 text-center">Property Owner</th>
                  <th className="p-4 text-center">Property Manager</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-stone-300">
                  <td className="p-4 font-medium text-charcoal">Browse Properties</td>
                  <td className="p-4 text-center text-charcoal">✓</td>
                  <td className="p-4 text-center text-charcoal">✓</td>
                  <td className="p-4 text-center text-charcoal">✓</td>
                </tr>
                <tr className="border-b border-stone-300 bg-porcelain">
                  <td className="p-4 font-medium text-charcoal">List Properties</td>
                  <td className="p-4 text-center text-charcoal">-</td>
                  <td className="p-4 text-center text-charcoal">✓</td>
                  <td className="p-4 text-center text-charcoal">✓</td>
                </tr>
                <tr className="border-b border-stone-300">
                  <td className="p-4 font-medium text-charcoal">Direct Messaging</td>
                  <td className="p-4 text-center text-charcoal">✓</td>
                  <td className="p-4 text-center text-charcoal">✓</td>
                  <td className="p-4 text-center text-charcoal">✓</td>
                </tr>
                <tr className="border-b border-stone-300 bg-porcelain">
                  <td className="p-4 font-medium text-charcoal">Save Favorites</td>
                  <td className="p-4 text-center text-charcoal">✓</td>
                  <td className="p-4 text-center text-charcoal">-</td>
                  <td className="p-4 text-center text-charcoal">-</td>
                </tr>
                <tr className="border-b border-stone-300">
                  <td className="p-4 font-medium text-charcoal">Manage Tenants</td>
                  <td className="p-4 text-center text-charcoal">-</td>
                  <td className="p-4 text-center text-charcoal">✓</td>
                  <td className="p-4 text-center text-charcoal">✓</td>
                </tr>
                <tr className="border-b border-stone-300 bg-porcelain">
                  <td className="p-4 font-medium text-charcoal">Analytics & Reports</td>
                  <td className="p-4 text-center text-charcoal">-</td>
                  <td className="p-4 text-center text-charcoal">✓</td>
                  <td className="p-4 text-center text-charcoal">✓</td>
                </tr>
                <tr className="border-b border-stone-300">
                  <td className="p-4 font-medium text-charcoal">Assign Vendors</td>
                  <td className="p-4 text-center text-charcoal">-</td>
                  <td className="p-4 text-center text-charcoal">-</td>
                  <td className="p-4 text-center text-charcoal">✓</td>
                </tr>
                <tr className="bg-porcelain">
                  <td className="p-4 font-medium text-charcoal">Task Management</td>
                  <td className="p-4 text-center text-charcoal">-</td>
                  <td className="p-4 text-center text-charcoal">-</td>
                  <td className="p-4 text-center text-charcoal">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 px-4 bg-porcelain">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-charcoal">Real-World Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-stone-100 p-8 rounded-xl shadow-md border border-stone-200">
              <h3 className="text-2xl font-semibold mb-4 text-charcoal">For Tenants</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-charcoal mb-2">Scenario: Finding Your First Apartment</h4>
                  <p className="text-architectural">Use advanced filters to find apartments in your budget, save your favorites, contact multiple owners, and track all your applications in one place.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal mb-2">Scenario: Relocating for Work</h4>
                  <p className="text-architectural">Search properties in your new city, filter by commute time, contact owners remotely, and schedule viewings—all before you move.</p>
                </div>
              </div>
            </div>
            <div className="bg-stone-100 p-8 rounded-xl shadow-md border border-stone-200">
              <h3 className="text-2xl font-semibold mb-4 text-charcoal">For Property Owners</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-charcoal mb-2">Scenario: Managing Multiple Properties</h4>
                  <p className="text-architectural">List all your properties in one dashboard, respond to tenant inquiries quickly, track rental income, and manage maintenance requests efficiently.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal mb-2">Scenario: Finding Quality Tenants</h4>
                  <p className="text-architectural">Reach thousands of potential tenants, review applications, communicate directly, and find the perfect match for your property—all without paying commission fees.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-stone-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-charcoal">All Current Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentFeatures.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-stone-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-charcoal">Coming Soon</h2>
            <p className="text-xl text-architectural">Exciting features we're working on</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {comingSoonFeatures.map((feature, index) => (
              <div key={index} className="bg-porcelain rounded-2xl shadow-md p-8 opacity-75 border border-stone-200">
                <div className="text-obsidian mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-charcoal mb-3">{feature.title}</h3>
                <p className="text-architectural leading-relaxed">{feature.description}</p>
                <span className="inline-block mt-4 px-3 py-1 bg-obsidian-100 text-obsidian rounded-full text-sm font-semibold">
                  Coming Soon
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Features;

