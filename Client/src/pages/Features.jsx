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
    <div className="min-h-screen bg-gradient-to-br from-[var(--ui-bg-page)] via-[var(--ui-bg-surface)]/30 to-[var(--ui-bg-page)] relative overflow-hidden backdrop-blur-[0.5px]">
      {/* Advanced Background Effects for Features Page */}
      <div className="absolute inset-0 animate-fade-in" style={{animationDuration: '1.5s'}}>
        {/* Primary gradient mesh - Features themed */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[var(--color-overlay-secondary)] via-transparent to-[var(--color-overlay-primary)] opacity-70"></div>

        {/* Floating geometric shapes - Features themed */}
        <div className="absolute top-16 left-12 w-36 h-36 bg-gradient-to-br from-[var(--brand-secondary)]/12 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDuration: '4.5s'}}></div>
        <div className="absolute top-32 right-16 w-28 h-28 bg-gradient-to-tl from-[var(--brand-accent)]/10 to-transparent rounded-full blur-xl animate-pulse" style={{animationDuration: '6.5s', animationDelay: '1s'}}></div>
        <div className="absolute bottom-24 left-1/5 w-44 h-44 bg-gradient-to-tr from-[var(--brand-tertiary)]/8 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDuration: '5.5s', animationDelay: '2s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-gradient-to-bl from-[var(--brand-accent)]/15 to-transparent rounded-full blur-lg animate-pulse" style={{animationDuration: '7s', animationDelay: '3s'}}></div>

        {/* Enhanced mesh pattern for Features */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(124, 58, 237, 0.18) 2px, transparent 2px),
            radial-gradient(circle at 80% 70%, rgba(37, 99, 235, 0.12) 1.5px, transparent 1.5px),
            radial-gradient(circle at 40% 60%, rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            radial-gradient(circle at 70% 20%, rgba(124, 58, 237, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '90px 90px, 70px 70px, 110px 110px, 130px 130px'
        }}></div>

        {/* Additional floating particles for Features */}
        <div className="absolute top-1/4 left-1/6 w-2 h-2 bg-[var(--brand-secondary)]/20 rounded-full animate-float opacity-30" style={{animationDuration: '8s'}}></div>
        <div className="absolute bottom-1/3 right-1/6 w-1.5 h-1.5 bg-[var(--brand-accent)]/25 rounded-full animate-float opacity-40" style={{animationDuration: '10s', animationDelay: '2s'}}></div>
        <div className="absolute top-3/4 left-2/3 w-1 h-1 bg-[var(--brand-tertiary)]/30 rounded-full animate-float opacity-35" style={{animationDuration: '9s', animationDelay: '4s'}}></div>
      </div>

      {/* Enhanced Hero Section with Advanced Animations */}
      <section className="relative py-32 px-4">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Advanced Title with Multiple Effects */}
          <div className="relative mb-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight animate-fade-in-up relative">
              {/* Main gradient text */}
              <span className="bg-gradient-to-r from-[var(--ui-text-primary)] via-[var(--brand-secondary)] to-[var(--brand-accent)] bg-clip-text text-transparent relative z-10">
                Platform Features
              </span>

              {/* Subtle glow effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-[var(--glow-secondary)] via-[var(--glow-primary)] to-[var(--glow-secondary)] bg-clip-text text-transparent opacity-40 blur-sm scale-105 animate-pulse" style={{animationDuration: '3s'}}>
                Platform Features
              </span>

              {/* Floating particles effect */}
              <div className="absolute -top-4 -left-4 w-2 h-2 bg-[var(--brand-secondary)] rounded-full animate-bounce opacity-60" style={{animationDuration: '2s'}}></div>
              <div className="absolute -top-2 -right-6 w-1.5 h-1.5 bg-[var(--brand-accent)] rounded-full animate-bounce opacity-50" style={{animationDuration: '2.5s', animationDelay: '0.5s'}}></div>
              <div className="absolute -bottom-3 left-1/4 w-1 h-1 bg-[var(--brand-tertiary)] rounded-full animate-bounce opacity-55" style={{animationDuration: '3s', animationDelay: '1s'}}></div>
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-[var(--ui-text-secondary)] max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.3s'}}>
            Everything you need to manage properties and find your perfect home
          </p>
        </div>
      </section>

      {/* Why PropManage Section */}
      <section className="py-16 px-4 bg-[var(--ui-bg-muted)]">
        <div className="max-w-4xl mx-auto text-center slide-up">
          <h2 className="text-4xl font-bold mb-6 text-[var(--ui-text-primary)]">Why PropManage?</h2>
          <p className="text-xl text-[var(--ui-text-secondary)] leading-relaxed mb-12 max-w-3xl mx-auto">
            PropManage is designed to solve the common pain points in property management. Whether you're a tenant searching
            for a home or a property owner managing rentals, our platform provides all the tools you need in one secure,
            easy-to-use system.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[var(--ui-bg-surface)] p-8 rounded-2xl border border-[var(--ui-border-default)] shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="w-12 h-12 bg-[var(--ui-action-primary)] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-6 h-6 text-[var(--ui-text-inverse)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[var(--ui-text-primary)]">For Tenants</h3>
              <p className="text-[var(--ui-text-muted)] leading-relaxed">Find properties, save favorites, contact owners, and track applications—all free.</p>
            </div>
            <div className="bg-[var(--ui-bg-surface)] p-8 rounded-2xl border border-[var(--ui-border-default)] shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="w-12 h-12 bg-[var(--ui-action-primary)] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-6 h-6 text-[var(--ui-text-inverse)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[var(--ui-text-primary)]">For Property Owners</h3>
              <p className="text-[var(--ui-text-muted)] leading-relaxed">List properties, manage tenants, track income, and handle maintenance—no commission fees.</p>
            </div>
            <div className="bg-[var(--ui-bg-surface)] p-8 rounded-2xl border border-[var(--ui-border-default)] shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="w-12 h-12 bg-[var(--ui-success)] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[var(--ui-text-primary)]">For Everyone</h3>
              <p className="text-[var(--ui-text-muted)] leading-relaxed">Secure platform, mobile-friendly, direct communication, and 24/7 support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features by User Type */}
      <section className="py-20 px-4 bg-[var(--ui-bg-surface)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-[var(--ui-text-primary)]">Features by User Type</h2>
            <p className="text-xl text-[var(--ui-text-secondary)] max-w-2xl mx-auto">See what features are available for each role</p>
          </div>

          {/* Tenant Features */}
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center bg-[var(--ui-action-primary)] text-[var(--ui-text-inverse)] px-6 py-3 rounded-full shadow-md">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-xl font-semibold">Tenant Features</h3>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentFeatures.filter((_, i) => [0, 2, 3].includes(i)).map((feature, index) => (
                <div key={index} className="fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <FeatureCard {...feature} />
                </div>
              ))}
            </div>
          </div>

          {/* Owner Features */}
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center bg-[var(--ui-success)] text-white px-6 py-3 rounded-full shadow-md">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="text-xl font-semibold">Property Owner Features</h3>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentFeatures.filter((_, i) => [1, 4].includes(i)).map((feature, index) => (
                <div key={index} className="fade-in" style={{animationDelay: `${(index + 3) * 0.1}s`}}>
                  <FeatureCard {...feature} />
                </div>
              ))}
            </div>
          </div>

          {/* Shared Features */}
          <div>
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center bg-[var(--ui-info)] text-white px-6 py-3 rounded-full shadow-md">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold">Shared Features</h3>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentFeatures.filter((_, i) => [5].includes(i)).map((feature, index) => (
                <div key={index} className="fade-in" style={{animationDelay: `${(index + 6) * 0.1}s`}}>
                  <FeatureCard {...feature} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-20 px-4 bg-[var(--ui-bg-muted)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-[var(--ui-text-primary)]">Feature Comparison</h2>
            <p className="text-xl text-[var(--ui-text-secondary)]">Compare what's available for each user type</p>
          </div>
          <div className="overflow-x-auto rounded-2xl shadow-lg">
            <table className="w-full border-collapse bg-[var(--ui-bg-surface)]" role="table" aria-label="Feature comparison across user types">
              <thead>
                <tr className="bg-[var(--ui-bg-inverse)] text-[var(--ui-text-inverse)]">
                  <th className="p-6 text-left font-semibold text-lg" scope="col">Feature</th>
                  <th className="p-6 text-center font-semibold text-lg" scope="col">
                    <div className="flex flex-col items-center">
                      <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Tenant
                    </div>
                  </th>
                  <th className="p-6 text-center font-semibold text-lg" scope="col">
                    <div className="flex flex-col items-center">
                      <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Property Owner
                    </div>
                  </th>
                  <th className="p-6 text-center font-semibold text-lg" scope="col">
                    <div className="flex flex-col items-center">
                      <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V8a2 2 0 01-2 2H8a2 2 0 01-2-2V6m8 0H8m0 0V4" />
                      </svg>
                      Property Manager
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Browse Properties', tenant: true, owner: true, manager: true },
                  { feature: 'List Properties', tenant: false, owner: true, manager: true },
                  { feature: 'Direct Messaging', tenant: true, owner: true, manager: true },
                  { feature: 'Save Favorites', tenant: true, owner: false, manager: false },
                  { feature: 'Manage Tenants', tenant: false, owner: true, manager: true },
                  { feature: 'Analytics & Reports', tenant: false, owner: true, manager: true },
                  { feature: 'Assign Vendors', tenant: false, owner: false, manager: true },
                  { feature: 'Task Management', tenant: false, owner: false, manager: true },
                ].map((row, index) => (
                  <tr key={index} className={`${index % 2 === 0 ? 'bg-[var(--ui-bg-surface)]' : 'bg-[var(--ui-bg-muted)]'} hover:bg-[var(--ui-bg-surface)] transition-colors duration-200`}>
                    <td className="p-6 font-medium text-[var(--ui-text-primary)] text-lg">{row.feature}</td>
                    <td className="p-6 text-center">
                      {row.tenant ? (
                        <div className="w-8 h-8 bg-[var(--ui-success)] rounded-full flex items-center justify-center mx-auto">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-[var(--ui-border-default)] rounded-full flex items-center justify-center mx-auto">
                          <svg className="w-4 h-4 text-[var(--ui-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="p-6 text-center">
                      {row.owner ? (
                        <div className="w-8 h-8 bg-[var(--ui-success)] rounded-full flex items-center justify-center mx-auto">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-[var(--ui-border-default)] rounded-full flex items-center justify-center mx-auto">
                          <svg className="w-4 h-4 text-[var(--ui-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="p-6 text-center">
                      {row.manager ? (
                        <div className="w-8 h-8 bg-[var(--ui-success)] rounded-full flex items-center justify-center mx-auto">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-[var(--ui-border-default)] rounded-full flex items-center justify-center mx-auto">
                          <svg className="w-4 h-4 text-[var(--ui-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 bg-[var(--ui-bg-surface)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-[var(--ui-text-primary)]">Real-World Use Cases</h2>
            <p className="text-xl text-[var(--ui-text-secondary)] max-w-3xl mx-auto">See how PropManage solves real problems for tenants and property owners</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-[var(--ui-bg-surface)] p-8 rounded-2xl shadow-lg border border-[var(--ui-border-default)] hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-[var(--ui-action-primary)] rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-7 h-7 text-[var(--ui-text-inverse)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-[var(--ui-text-primary)]">For Tenants</h3>
              </div>
              <div className="space-y-6">
                <div className="bg-[var(--ui-bg-muted)] p-6 rounded-xl border border-[var(--ui-border-default)]">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-[var(--ui-info)] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-[var(--ui-text-primary)] mb-2">Finding Your First Apartment</h4>
                      <p className="text-[var(--ui-text-secondary)] leading-relaxed">Use advanced filters to find apartments in your budget, save your favorites, contact multiple owners, and track all your applications in one place.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[var(--ui-bg-muted)] p-6 rounded-xl border border-[var(--ui-border-default)]">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-[var(--ui-info)] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-[var(--ui-text-primary)] mb-2">Relocating for Work</h4>
                      <p className="text-[var(--ui-text-secondary)] leading-relaxed">Search properties in your new city, filter by commute time, contact owners remotely, and schedule viewings—all before you move.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[var(--ui-bg-surface)] p-8 rounded-2xl shadow-lg border border-[var(--ui-border-default)] hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-[var(--ui-success)] rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-[var(--ui-text-primary)]">For Property Owners</h3>
              </div>
              <div className="space-y-6">
                <div className="bg-[var(--ui-bg-muted)] p-6 rounded-xl border border-[var(--ui-border-default)]">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-[var(--ui-success)] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-[var(--ui-text-primary)] mb-2">Managing Multiple Properties</h4>
                      <p className="text-[var(--ui-text-secondary)] leading-relaxed">List all your properties in one dashboard, respond to tenant inquiries quickly, track rental income, and manage maintenance requests efficiently.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[var(--ui-bg-muted)] p-6 rounded-xl border border-[var(--ui-border-default)]">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-[var(--ui-success)] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-[var(--ui-text-primary)] mb-2">Finding Quality Tenants</h4>
                      <p className="text-[var(--ui-text-secondary)] leading-relaxed">Reach thousands of potential tenants, review applications, communicate directly, and find the perfect match for your property—all without paying commission fees.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[var(--ui-bg-muted)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-[var(--ui-text-primary)]">All Current Features</h2>
            <p className="text-xl text-[var(--ui-text-secondary)]">Everything available right now in PropManage</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentFeatures.map((feature, index) => (
              <div
                key={index}
                className="fade-in slide-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[var(--ui-bg-muted)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-[var(--ui-text-primary)]">Coming Soon</h2>
            <p className="text-xl text-[var(--ui-text-secondary)] max-w-2xl mx-auto">Exciting features we're developing to make property management even better</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {comingSoonFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-[var(--ui-bg-surface)] rounded-2xl shadow-lg p-8 border border-[var(--ui-border-default)] hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {/* Background gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--ui-action-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="text-[var(--ui-action-primary)] mb-4 group-hover:scale-110 transition-transform duration-200">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--ui-text-primary)] mb-3 group-hover:text-[var(--ui-action-primary)] transition-colors duration-200">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--ui-text-secondary)] leading-relaxed mb-4">{feature.description}</p>

                  {/* Coming Soon Badge */}
                  <div className="flex items-center">
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[var(--ui-warning)] to-[var(--ui-warning)]/80 text-white rounded-full text-sm font-semibold shadow-md">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Coming Soon
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-2 -right-2 w-20 h-20 bg-[var(--ui-warning)]/10 rounded-full blur-xl group-hover:bg-[var(--ui-warning)]/20 transition-colors duration-300"></div>
              </div>
            ))}
          </div>

          {/* Call to action */}
          <div className="text-center mt-16">
            <p className="text-lg text-[var(--ui-text-secondary)] mb-6">
              Want to get notified when these features launch?
            </p>
            <button className="inline-flex items-center px-8 py-4 bg-[var(--ui-action-primary)] text-[var(--ui-text-inverse)] font-semibold rounded-full hover:bg-[var(--ui-action-primary-hover)] transition-colors duration-200 shadow-lg hover:shadow-xl">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Notify Me
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Features;

