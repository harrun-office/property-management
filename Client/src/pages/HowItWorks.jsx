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
    <div className="min-h-screen bg-gradient-to-br from-[var(--ui-bg-page)] via-[var(--ui-bg-surface)]/30 to-[var(--ui-bg-page)] relative overflow-hidden backdrop-blur-[0.5px]">
      {/* Advanced Background Effects for How It Works Page */}
      <div className="absolute inset-0 animate-fade-in" style={{animationDuration: '1.5s'}}>
        {/* Primary gradient mesh - How It Works themed */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[var(--color-overlay-primary)] via-transparent to-[var(--color-overlay-tertiary)] opacity-75"></div>

        {/* Floating geometric shapes - Process themed */}
        <div className="absolute top-20 left-8 w-40 h-40 bg-gradient-to-br from-[var(--brand-accent)]/15 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDuration: '5s'}}></div>
        <div className="absolute top-40 right-12 w-32 h-32 bg-gradient-to-tl from-[var(--brand-tertiary)]/12 to-transparent rounded-full blur-xl animate-pulse" style={{animationDuration: '7s', animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-48 h-48 bg-gradient-to-tr from-[var(--brand-secondary)]/10 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDuration: '6s', animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-bl from-[var(--brand-accent)]/18 to-transparent rounded-full blur-lg animate-pulse" style={{animationDuration: '8s', animationDelay: '3s'}}></div>

        {/* Process-themed mesh pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(37, 99, 235, 0.2) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.15) 1.5px, transparent 1.5px),
            radial-gradient(circle at 50% 10%, rgba(124, 58, 237, 0.12) 1px, transparent 1px),
            radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.1) 1px, transparent 1px),
            linear-gradient(45deg, rgba(37, 99, 235, 0.05) 1px, transparent 1px),
            linear-gradient(-45deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px, 80px 80px, 120px 120px, 140px 140px, 60px 60px, 40px 40px'
        }}></div>

        {/* Additional floating particles for workflow theme */}
        <div className="absolute top-1/5 left-1/8 w-1.5 h-1.5 bg-[var(--brand-accent)]/25 rounded-full animate-float opacity-50" style={{animationDuration: '9s'}}></div>
        <div className="absolute bottom-1/4 right-1/5 w-1 h-1 bg-[var(--brand-tertiary)]/30 rounded-full animate-float opacity-60" style={{animationDuration: '11s', animationDelay: '2s'}}></div>
        <div className="absolute top-3/5 left-3/4 w-0.5 h-0.5 bg-[var(--brand-secondary)]/35 rounded-full animate-float opacity-45" style={{animationDuration: '10s', animationDelay: '4s'}}></div>
      </div>

      {/* Enhanced Hero Section with Advanced Animations */}
      <section className="relative py-32 px-4">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Advanced Title with Multiple Effects */}
          <div className="relative mb-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight animate-fade-in-up relative">
              {/* Main gradient text */}
              <span className="bg-gradient-to-r from-[var(--ui-text-primary)] via-[var(--brand-accent)] to-[var(--brand-tertiary)] bg-clip-text text-transparent relative z-10">
                How It Works
              </span>

              {/* Subtle glow effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-[var(--glow-primary)] via-[var(--glow-tertiary)] to-[var(--glow-primary)] bg-clip-text text-transparent opacity-50 blur-sm scale-105 animate-pulse" style={{animationDuration: '3s'}}>
                How It Works
              </span>

              {/* Flowing particle effects */}
              <div className="absolute -top-6 -left-6 w-3 h-3 bg-[var(--brand-accent)] rounded-full animate-bounce opacity-70" style={{animationDuration: '2.2s'}}></div>
              <div className="absolute -top-3 -right-8 w-2 h-2 bg-[var(--brand-tertiary)] rounded-full animate-bounce opacity-60" style={{animationDuration: '2.8s', animationDelay: '0.5s'}}></div>
              <div className="absolute -bottom-4 left-1/3 w-1.5 h-1.5 bg-[var(--brand-secondary)] rounded-full animate-bounce opacity-65" style={{animationDuration: '3.2s', animationDelay: '1s'}}></div>
              <div className="absolute -bottom-2 right-1/4 w-1 h-1 bg-[var(--brand-accent)] rounded-full animate-bounce opacity-55" style={{animationDuration: '2.6s', animationDelay: '1.5s'}}></div>
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-[var(--ui-text-secondary)] max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.4s'}}>
            Simple steps to find your perfect property or manage your listings
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 px-4 bg-[var(--ui-bg-muted)]">
        <div className="max-w-4xl mx-auto text-center slide-up">
          <h2 className="text-4xl font-bold mb-6 text-[var(--ui-text-primary)]">What is PropManage?</h2>
          <p className="text-xl text-[var(--ui-text-secondary)] leading-relaxed mb-12 max-w-3xl mx-auto">
            PropManage is a comprehensive property management platform that connects tenants and property owners.
            Whether you're looking for a place to rent or managing rental properties, our platform simplifies the entire process.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[var(--ui-bg-surface)] p-8 rounded-2xl border border-[var(--ui-border-default)] shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="w-14 h-14 bg-[var(--ui-action-primary)] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-7 h-7 text-[var(--ui-text-inverse)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[var(--ui-text-primary)]">Who Can Use It?</h3>
              <p className="text-[var(--ui-text-muted)] leading-relaxed">Tenants, property owners, and property managers—everyone involved in the rental market.</p>
            </div>
            <div className="bg-[var(--ui-bg-surface)] p-8 rounded-2xl border border-[var(--ui-border-default)] shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="w-14 h-14 bg-[var(--ui-warning)] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[var(--ui-text-primary)]">What Problems Does It Solve?</h3>
              <p className="text-[var(--ui-text-muted)] leading-relaxed">Fragmented property search, difficult tenant management, commission fees, and lack of communication tools.</p>
            </div>
            <div className="bg-[var(--ui-bg-surface)] p-8 rounded-2xl border border-[var(--ui-border-default)] shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="w-14 h-14 bg-[var(--ui-success)] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[var(--ui-text-primary)]">Why Choose Us?</h3>
              <p className="text-[var(--ui-text-muted)] leading-relaxed">Free for tenants, no commission fees for owners, all-in-one platform, and secure communication.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Choose Your Path Section */}
      <section className="py-20 px-4 bg-[var(--ui-bg-surface)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-[var(--ui-text-primary)]">Choose Your Path</h2>
            <p className="text-xl text-[var(--ui-text-secondary)] max-w-2xl mx-auto">Whether you're looking to rent or manage properties, we've got you covered</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-[var(--ui-bg-surface)] p-8 rounded-2xl shadow-lg border border-[var(--ui-border-default)] hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-overlay-primary)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-[var(--ui-action-primary)] rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-8 h-8 text-[var(--ui-text-inverse)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-[var(--ui-text-primary)]">I'm a Tenant</h3>
                </div>
                <p className="text-[var(--ui-text-secondary)] mb-6 text-lg leading-relaxed">Looking for a property to rent? Register as a tenant to:</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-[var(--ui-success)] rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[var(--ui-text-primary)]">Search and filter thousands of properties</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-[var(--ui-success)] rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[var(--ui-text-primary)]">Save favorite properties</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-[var(--ui-success)] rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[var(--ui-text-primary)]">Contact property owners directly</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-[var(--ui-success)] rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[var(--ui-text-primary)]">Track your applications</span>
                  </li>
                </ul>
                <Link
                  to="/for-tenants"
                  className="inline-flex items-center px-6 py-3 bg-[var(--ui-action-primary)] text-[var(--ui-text-inverse)] rounded-xl font-semibold hover:bg-[var(--ui-action-primary-hover)] transition-all duration-200 shadow-lg hover:shadow-xl group-hover:scale-105"
                >
                  Learn More About Tenant Features
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="bg-[var(--ui-bg-surface)] p-8 rounded-2xl shadow-lg border border-[var(--ui-border-default)] hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-overlay-secondary)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-[var(--ui-success)] rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-[var(--ui-text-primary)]">I'm a Property Owner</h3>
                </div>
                <p className="text-[var(--ui-text-secondary)] mb-6 text-lg leading-relaxed">Managing rental properties? Register as an owner to:</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-[var(--ui-success)] rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[var(--ui-text-primary)]">List unlimited properties (no commission fees!)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-[var(--ui-success)] rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[var(--ui-text-primary)]">Reach thousands of potential tenants</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-[var(--ui-success)] rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[var(--ui-text-primary)]">Manage tenants and track income</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-[var(--ui-success)] rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[var(--ui-text-primary)]">View analytics and reports</span>
                  </li>
                </ul>
                <Link
                  to="/for-owners"
                  className="inline-flex items-center px-6 py-3 bg-[var(--ui-success)] text-white rounded-xl font-semibold hover:bg-[var(--ui-success)]/90 transition-all duration-200 shadow-lg hover:shadow-xl group-hover:scale-105"
                >
                  Learn More About Owner Features
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Tenants */}
      <section className="py-20 px-4 bg-[var(--ui-bg-muted)]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-[var(--ui-text-primary)]">For Tenants</h2>
            <p className="text-xl text-[var(--ui-text-secondary)]">Find and rent your perfect property in 5 easy steps</p>
          </div>
          <div className="space-y-8">
            {tenantSteps.map((step, index) => (
              <div key={step.number} className="flex items-start group animate-slide-up" style={{animationDelay: `${index * 0.2}s`}}>
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-[var(--ui-action-primary)] to-[var(--ui-action-primary-dark)] text-[var(--ui-text-inverse)] rounded-full flex items-center justify-center font-bold text-2xl mr-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {step.number}
                </div>
                <div className="flex-1 bg-[var(--ui-bg-surface)] p-6 rounded-2xl border border-[var(--ui-border-default)] shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-semibold text-[var(--ui-text-primary)] group-hover:text-[var(--ui-action-primary)] transition-colors duration-200">{step.title}</h3>
                    <span className="text-sm text-[var(--ui-text-muted)] bg-[var(--ui-bg-muted)] px-4 py-2 rounded-full font-medium">~2 minutes</span>
                  </div>
                  <p className="text-[var(--ui-text-secondary)] text-lg leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-16">
            <Link
              to="/for-tenants"
              className="inline-flex items-center px-8 py-4 bg-[var(--ui-action-primary)] text-[var(--ui-text-inverse)] rounded-xl font-semibold text-lg hover:bg-[var(--ui-action-primary-hover)] transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Learn More About Tenant Features
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* For Owners */}
      <section className="py-20 px-4 bg-[var(--ui-bg-surface)]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-[var(--ui-text-primary)]">For Property Owners</h2>
            <p className="text-xl text-[var(--ui-text-secondary)]">Manage your properties efficiently in 5 simple steps</p>
          </div>
          <div className="space-y-8">
            {ownerSteps.map((step, index) => (
              <div key={step.number} className="flex items-start group animate-slide-up" style={{animationDelay: `${index * 0.2}s`}}>
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-[var(--ui-success)] to-[var(--ui-success)]/80 text-white rounded-full flex items-center justify-center font-bold text-2xl mr-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {step.number}
                </div>
                <div className="flex-1 bg-[var(--ui-bg-surface)] p-6 rounded-2xl border border-[var(--ui-border-default)] shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-semibold text-[var(--ui-text-primary)] group-hover:text-[var(--ui-success)] transition-colors duration-200">{step.title}</h3>
                    <span className="text-sm text-[var(--ui-text-muted)] bg-[var(--ui-bg-muted)] px-4 py-2 rounded-full font-medium">~5 minutes</span>
                  </div>
                  <p className="text-[var(--ui-text-secondary)] text-lg leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-16">
            <Link
              to="/for-owners"
              className="inline-flex items-center px-8 py-4 bg-[var(--ui-success)] text-white rounded-xl font-semibold text-lg hover:bg-[var(--ui-success)]/90 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Learn More About Owner Features
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-[var(--ui-bg-muted)]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-[var(--ui-text-primary)]">Frequently Asked Questions</h2>
            <p className="text-xl text-[var(--ui-text-secondary)]">Everything you need to know about getting started</p>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-[var(--ui-bg-surface)] rounded-2xl p-8 border border-[var(--ui-border-default)] shadow-sm hover:shadow-md transition-all duration-300 group animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <h3 className="text-xl font-semibold mb-4 text-[var(--ui-text-primary)] group-hover:text-[var(--ui-action-primary)] transition-colors duration-200">{faq.question}</h3>
                <p className="text-[var(--ui-text-secondary)] leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Final CTA - Ultimate Experience */}
      <section className="py-32 px-4 bg-gradient-to-br from-[var(--ui-success)] via-[var(--ui-success)] to-[var(--ui-success)]/80 relative overflow-hidden animate-slide-up" style={{animationDelay: '1.4s', animationFillMode: 'both'}}>
        {/* Advanced Background System */}
        <div className="absolute inset-0">
          {/* Primary success gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--ui-success)]/40 via-[var(--brand-accent)]/25 to-[var(--ui-success)]/30"></div>

          {/* Animated floating orbs */}
          <div className="absolute top-12 left-12 w-48 h-48 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl animate-float" style={{animationDuration: '9s'}}></div>
          <div className="absolute bottom-12 right-12 w-64 h-64 bg-gradient-to-tl from-white/15 to-transparent rounded-full blur-3xl animate-float" style={{animationDuration: '11s', animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-[var(--brand-accent)]/20 via-transparent to-[var(--brand-tertiary)]/15 rounded-full blur-3xl animate-float" style={{animationDuration: '13s', animationDelay: '4s'}}></div>

          {/* Geometric pattern overlay */}
          <div className="absolute inset-0 opacity-8" style={{
            backgroundImage: `
              radial-gradient(circle at 25% 75%, rgba(255,255,255,0.25) 0%, transparent 50%),
              radial-gradient(circle at 75% 25%, rgba(255,255,255,0.2) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 50%),
              linear-gradient(45deg, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(-45deg, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: '250px 250px, 180px 180px, 350px 350px, 80px 80px, 60px 60px'
          }}></div>
        </div>

        {/* Dynamic floating elements */}
        <div className="absolute top-24 left-24 animate-bounce" style={{animationDuration: '3.2s'}}>
          <div className="w-4 h-4 bg-white/40 rounded-full shadow-xl"></div>
        </div>
        <div className="absolute top-32 right-40 animate-bounce" style={{animationDuration: '4.2s', animationDelay: '1s'}}>
          <div className="w-3 h-3 bg-[var(--brand-accent)]/50 rounded-full shadow-lg"></div>
        </div>
        <div className="absolute bottom-28 left-1/4 animate-bounce" style={{animationDuration: '3.7s', animationDelay: '2s'}}>
          <div className="w-5 h-5 bg-[var(--brand-tertiary)]/45 rounded-full shadow-2xl"></div>
        </div>
        <div className="absolute top-1/3 right-1/5 animate-bounce" style={{animationDuration: '5.2s', animationDelay: '3s'}}>
          <div className="w-3.5 h-3.5 bg-white/35 rounded-full shadow-xl"></div>
        </div>
        <div className="absolute bottom-1/4 left-2/3 animate-bounce" style={{animationDuration: '4.5s', animationDelay: '1.5s'}}>
          <div className="w-2.5 h-2.5 bg-[var(--brand-accent)]/40 rounded-full shadow-lg"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="mb-10">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/15 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/25 shadow-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Simple Steps to Success
            </div>
          </div>

          <h2 className="text-5xl md:text-7xl font-black mb-8 text-white leading-tight">
            Start Your Journey
            <br />
            <span className="bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent">
              Today
            </span>
          </h2>

          <p className="text-xl md:text-2xl mb-12 text-white/95 max-w-4xl mx-auto leading-relaxed font-light">
            Follow our proven process and transform your property experience.
            Join thousands who've simplified property management with just a few clicks.
          </p>

          <div className="flex flex-col lg:flex-row gap-6 justify-center items-center mb-16">
            <Link
              to="/register"
              className="group inline-flex items-center px-12 py-6 bg-white text-[var(--ui-success)] rounded-2xl font-bold text-xl hover:bg-gray-50 hover:shadow-2xl hover:shadow-white/25 transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              Get Started Now
              <svg className="w-7 h-7 ml-4 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </Link>

            <Link
              to="/properties"
              className="group inline-flex items-center px-10 py-5 border-3 border-white/40 text-white rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white/60 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg backdrop-blur-sm"
            >
              <svg className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explore Properties
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h4 className="text-white font-bold text-lg mb-2">Quick Setup</h4>
              <p className="text-white/90 text-sm">Get started in under 5 minutes with our guided process</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <h4 className="text-white font-bold text-lg mb-2">Secure Platform</h4>
              <p className="text-white/90 text-sm">Bank-level security with enterprise-grade encryption</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 3a9 9 0 100 18 9 9 0 000-18zm0 16a7 7 0 110-14 7 7 0 010 14z" />
                  </svg>
                </div>
              </div>
              <h4 className="text-white font-bold text-lg mb-2">24/7 Support</h4>
              <p className="text-white/90 text-sm">Always here to help with dedicated customer support</p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/25">
            <p className="text-white/70 text-sm max-w-2xl mx-auto leading-relaxed">
              <span className="inline-block w-6 h-6 bg-white/20 rounded-full mr-3 mb-1">
                <svg className="w-4 h-4 text-white m-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <strong>Join 500+ satisfied users</strong> who've transformed their property management experience.
              Start your free trial today and see the difference in just minutes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HowItWorks;

