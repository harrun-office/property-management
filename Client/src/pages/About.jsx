import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

function About() {
  const values = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Trust & Security',
      description: 'We prioritize the security of your data and transactions with industry-leading security measures.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Innovation',
      description: 'Continuously improving our platform with new features and technologies to serve you better.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'User-Centric',
      description: 'Every feature we build is designed with our users\' needs in mind, making property management simple and intuitive.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Transparency',
      description: 'No hidden fees, no surprises. We believe in clear, honest communication with our users.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--ui-bg-page)] via-[var(--ui-bg-surface)]/30 to-[var(--ui-bg-page)] relative overflow-hidden backdrop-blur-[0.5px]">
      {/* Advanced Background Effects for About Page */}
      <div className="absolute inset-0 animate-fade-in" style={{animationDuration: '1.5s'}}>
        {/* Primary gradient mesh - Trust & Professional themed */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[var(--color-overlay-primary)] via-[var(--color-overlay-tertiary)] to-[var(--color-overlay-secondary)] opacity-65"></div>

        {/* Floating geometric shapes - Stability themed */}
        <div className="absolute top-16 left-8 w-40 h-40 bg-gradient-to-br from-[var(--brand-accent)]/18 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDuration: '6s'}}></div>
        <div className="absolute top-32 right-12 w-32 h-32 bg-gradient-to-tl from-[var(--brand-tertiary)]/15 to-transparent rounded-full blur-xl animate-pulse" style={{animationDuration: '8s', animationDelay: '1s'}}></div>
        <div className="absolute bottom-24 left-1/5 w-48 h-48 bg-gradient-to-tr from-[var(--brand-secondary)]/12 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDuration: '7s', animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-28 h-28 bg-gradient-to-bl from-[var(--brand-accent)]/20 to-transparent rounded-full blur-lg animate-pulse" style={{animationDuration: '9s', animationDelay: '3s'}}></div>

        {/* Professional mesh pattern */}
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: `
            radial-gradient(circle at 30% 30%, rgba(37, 99, 235, 0.25) 2px, transparent 2px),
            radial-gradient(circle at 70% 70%, rgba(6, 182, 212, 0.2) 1.5px, transparent 1.5px),
            radial-gradient(circle at 50% 20%, rgba(124, 58, 237, 0.18) 1px, transparent 1px),
            radial-gradient(circle at 20% 80%, rgba(37, 99, 235, 0.15) 1px, transparent 1px),
            linear-gradient(45deg, rgba(37, 99, 235, 0.08) 1px, transparent 1px),
            linear-gradient(-45deg, rgba(6, 182, 212, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px, 90px 90px, 150px 150px, 180px 180px, 100px 100px, 80px 80px'
        }}></div>

        {/* Additional floating particles for trust theme */}
        <div className="absolute top-1/5 left-1/6 w-2 h-2 bg-[var(--brand-accent)]/30 rounded-full animate-float opacity-40" style={{animationDuration: '10s'}}></div>
        <div className="absolute bottom-1/3 right-1/5 w-1.5 h-1.5 bg-[var(--brand-tertiary)]/35 rounded-full animate-float opacity-50" style={{animationDuration: '12s', animationDelay: '2s'}}></div>
        <div className="absolute top-3/5 left-3/4 w-1 h-1 bg-[var(--brand-secondary)]/40 rounded-full animate-float opacity-45" style={{animationDuration: '11s', animationDelay: '4s'}}></div>
      </div>

      {/* Enhanced Hero Section with Advanced Animations */}
      <section className="relative py-32 px-4">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Advanced Title with Multiple Effects */}
          <div className="relative mb-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight animate-fade-in-up relative">
              {/* Main gradient text */}
              <span className="bg-gradient-to-r from-[var(--ui-text-primary)] via-[var(--brand-accent)] to-[var(--brand-secondary)] bg-clip-text text-transparent relative z-10">
                About PropManage
              </span>

              {/* Subtle glow effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-[var(--glow-primary)] via-[var(--glow-secondary)] to-[var(--glow-primary)] bg-clip-text text-transparent opacity-50 blur-sm scale-105 animate-pulse" style={{animationDuration: '3s'}}>
                About PropManage
              </span>

              {/* Trust-themed floating particles */}
              <div className="absolute -top-6 -left-6 w-3 h-3 bg-[var(--brand-accent)] rounded-full animate-bounce opacity-70" style={{animationDuration: '2.4s'}}></div>
              <div className="absolute -top-3 -right-8 w-2 h-2 bg-[var(--brand-secondary)] rounded-full animate-bounce opacity-65" style={{animationDuration: '3s', animationDelay: '0.5s'}}></div>
              <div className="absolute -bottom-4 left-1/3 w-1.5 h-1.5 bg-[var(--brand-tertiary)] rounded-full animate-bounce opacity-68" style={{animationDuration: '2.6s', animationDelay: '1s'}}></div>
              <div className="absolute -bottom-2 right-1/4 w-1 h-1 bg-[var(--brand-accent)] rounded-full animate-bounce opacity-62" style={{animationDuration: '3.4s', animationDelay: '1.5s'}}></div>
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-[var(--ui-text-secondary)] max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.4s'}}>
            Simplifying property management for everyone
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-[var(--ui-bg-muted)]">
        <div className="max-w-4xl mx-auto slide-up">
          <div className="bg-[var(--ui-bg-surface)] p-8 rounded-2xl border border-[var(--ui-border-default)] shadow-sm hover:shadow-md transition-all duration-300 mb-8">
            <h2 className="text-4xl font-bold mb-6 text-[var(--ui-text-primary)]">What is PropManage?</h2>
            <p className="text-lg text-[var(--ui-text-secondary)] leading-relaxed">
              PropManage is a comprehensive property management platform designed to connect tenants and property owners
              in one easy-to-use system. We provide all the tools needed for property search, listing management, tenant
              communication, and rental operations—all in one secure platform.
            </p>
          </div>

          <div className="bg-[var(--ui-bg-surface)] p-8 rounded-2xl border border-[var(--ui-border-default)] shadow-sm hover:shadow-md transition-all duration-300">
            <h2 className="text-4xl font-bold mb-6 text-[var(--ui-text-primary)]">Our Mission</h2>
            <div className="space-y-6 text-[var(--ui-text-secondary)] leading-relaxed">
              <p>
                At PropManage, we believe that finding a home or managing rental properties shouldn't be complicated.
                Our mission is to create a seamless, user-friendly platform that connects tenants with property owners
                and simplifies every aspect of the rental process.
              </p>
              <p>
                We're building a comprehensive property management solution that eliminates the friction in traditional
                rental processes. Whether you're a tenant searching for your next home or a property owner looking
                to streamline your rental business, PropManage provides the tools you need to succeed.
              </p>
              <p>
                Our platform is designed to be transparent, secure, and accessible to everyone. We're committed to
                continuous innovation, always working on new features that make property management easier and more
                efficient for our users.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[var(--ui-bg-surface)]">
        <div className="max-w-4xl mx-auto slide-up">
          <h2 className="text-4xl font-bold mb-12 text-[var(--ui-text-primary)] text-center">Who We Serve</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[var(--ui-bg-surface)] p-8 rounded-2xl border border-[var(--ui-border-default)] shadow-sm hover:shadow-lg transition-all duration-500 group">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--ui-action-primary)] to-[var(--ui-action-primary-dark)] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-8 h-8 text-[var(--ui-text-inverse)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[var(--ui-text-primary)]">Tenants</h3>
              <p className="text-[var(--ui-text-secondary)] leading-relaxed">People looking for rental properties. Free to browse, free to register, and free to use all tenant features.</p>
            </div>

            <div className="bg-[var(--ui-bg-surface)] p-8 rounded-2xl border border-[var(--ui-border-default)] shadow-sm hover:shadow-lg transition-all duration-500 group">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--ui-success)] to-[var(--ui-success)]/80 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[var(--ui-text-primary)]">Property Owners</h3>
              <p className="text-[var(--ui-text-secondary)] leading-relaxed">Individuals and businesses managing rental properties. List unlimited properties with zero commission fees.</p>
            </div>

            <div className="bg-[var(--ui-bg-surface)] p-8 rounded-2xl border border-[var(--ui-border-default)] shadow-sm hover:shadow-lg transition-all duration-500 group">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--ui-info)] to-[var(--ui-info)]/80 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V8a2 2 0 01-2 2H8a2 2 0 01-2-2V6m8 0H8m0 0V4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[var(--ui-text-primary)]">Property Managers</h3>
              <p className="text-[var(--ui-text-secondary)] leading-relaxed">Professional property management companies managing multiple properties, vendors, and maintenance tasks.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[var(--ui-bg-muted)]">
        <div className="max-w-6xl mx-auto slide-up">
          <h2 className="text-4xl font-bold text-center mb-16 text-[var(--ui-text-primary]">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-[var(--ui-bg-surface)] p-8 rounded-2xl border border-[var(--ui-border-default)] shadow-sm hover:shadow-lg transition-all duration-500 group animate-slide-up" style={{animationDelay: `${index * 0.2}s`}}>
                <div className="w-14 h-14 bg-gradient-to-br from-[var(--brand-accent)] to-[var(--brand-accent-dark)] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                  <div className="text-[var(--ui-text-inverse)] scale-75">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[var(--ui-text-primary)] group-hover:text-[var(--brand-accent)] transition-colors duration-200">{value.title}</h3>
                <p className="text-[var(--ui-text-secondary)] leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[var(--ui-bg-surface)]">
        <div className="max-w-4xl mx-auto slide-up">
          <div className="bg-[var(--ui-bg-surface)] p-8 rounded-2xl border border-[var(--ui-border-default)] shadow-sm hover:shadow-md transition-all duration-300">
            <h2 className="text-4xl font-bold mb-8 text-[var(--ui-text-primary)]">Why We Built This</h2>
            <div className="space-y-6 text-[var(--ui-text-secondary)] leading-relaxed">
              <p>
                The rental market has been fragmented and inefficient for too long. Tenants struggle to find suitable
                properties, while property owners face challenges in managing listings, communicating with tenants, and
                collecting rent. We saw an opportunity to create a unified platform that addresses these pain points.
              </p>
              <p>
                PropManage was born from the frustration of dealing with outdated property management systems and
                inefficient rental processes. We wanted to build something modern, intuitive, and powerful—a platform
                that works for everyone, regardless of technical expertise.
              </p>
              <p>
                Today, we're proud to serve thousands of users who trust PropManage for their property management needs.
                But we're just getting started. We're constantly working on new features and improvements to make the
                platform even better.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[var(--ui-bg-muted)]">
        <div className="max-w-4xl mx-auto slide-up">
          <h2 className="text-4xl font-bold mb-12 text-[var(--ui-text-primary)] text-center">Contact Information</h2>
          <div className="bg-[var(--ui-bg-surface)] p-8 rounded-2xl border border-[var(--ui-border-default)] shadow-sm hover:shadow-md transition-all duration-300">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--ui-success)] to-[var(--ui-success)]/80 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 3a9 9 0 100 18 9 9 0 000-18zm0 16a7 7 0 110-14 7 7 0 010 14z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-[var(--ui-text-primary)]">Support</h3>
                <p className="text-[var(--ui-text-secondary)] mb-2">Email: support@propmanage.com</p>
                <p className="text-[var(--ui-text-secondary)]">Available 24/7</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--ui-info)] to-[var(--ui-info)]/80 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-[var(--ui-text-primary)]">General Inquiries</h3>
                <p className="text-[var(--ui-text-secondary)]">Email: info@propmanage.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Final CTA - Professional & Trustworthy */}
      <section className="py-32 px-4 bg-gradient-to-br from-[var(--ui-bg-inverse)] via-[var(--brand-primary)] to-[var(--ui-bg-inverse)] relative overflow-hidden animate-slide-up" style={{animationDelay: '1.6s', animationFillMode: 'both'}}>
        {/* Advanced Background System */}
        <div className="absolute inset-0">
          {/* Primary professional gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/40 via-[var(--brand-accent)]/25 to-[var(--brand-primary)]/35"></div>

          {/* Animated floating orbs */}
          <div className="absolute top-10 left-12 w-40 h-40 bg-gradient-to-br from-white/15 to-transparent rounded-full blur-2xl animate-float" style={{animationDuration: '8s'}}></div>
          <div className="absolute bottom-12 right-12 w-56 h-56 bg-gradient-to-tl from-white/12 to-transparent rounded-full blur-3xl animate-float" style={{animationDuration: '10s', animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-[var(--brand-accent)]/20 via-transparent to-[var(--brand-secondary)]/15 rounded-full blur-3xl animate-float" style={{animationDuration: '12s', animationDelay: '4s'}}></div>

          {/* Professional geometric pattern overlay */}
          <div className="absolute inset-0 opacity-6" style={{
            backgroundImage: `
              radial-gradient(circle at 25% 75%, rgba(255,255,255,0.2) 0%, transparent 50%),
              radial-gradient(circle at 75% 25%, rgba(255,255,255,0.15) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)
            `,
            backgroundSize: '300px 300px, 200px 200px, 400px 400px'
          }}></div>
        </div>

        {/* Dynamic floating elements */}
        <div className="absolute top-20 left-20 animate-bounce" style={{animationDuration: '3s'}}>
          <div className="w-3 h-3 bg-white/30 rounded-full shadow-lg"></div>
        </div>
        <div className="absolute top-40 right-32 animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}>
          <div className="w-2 h-2 bg-[var(--brand-accent)]/40 rounded-full shadow-md"></div>
        </div>
        <div className="absolute bottom-32 left-1/3 animate-bounce" style={{animationDuration: '3.5s', animationDelay: '2s'}}>
          <div className="w-4 h-4 bg-[var(--brand-secondary)]/35 rounded-full shadow-xl"></div>
        </div>
        <div className="absolute top-1/4 right-1/4 animate-bounce" style={{animationDuration: '5s', animationDelay: '3s'}}>
          <div className="w-2.5 h-2.5 bg-white/25 rounded-full shadow-lg"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="mb-10">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/15 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/25 shadow-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Building Trust, One Property at a Time
            </div>
          </div>

          <h2 className="text-5xl md:text-7xl font-black mb-8 text-white leading-tight">
            Join Our
            <br />
            <span className="bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent">
              Community
            </span>
          </h2>

          <p className="text-xl md:text-2xl mb-12 text-white/95 max-w-4xl mx-auto leading-relaxed font-light">
            Whether you're a tenant or property owner, we'd love to have you as part of the PropManage community.
            Together, we're simplifying property management for everyone.
          </p>

          <div className="flex flex-col lg:flex-row gap-6 justify-center items-center mb-16">
            <Link
              to="/register"
              className="group inline-flex items-center px-12 py-6 bg-white text-[var(--brand-primary)] rounded-2xl font-bold text-xl hover:bg-gray-50 hover:shadow-2xl hover:shadow-white/25 transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              Get Started Today
              <svg className="w-7 h-7 ml-4 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </Link>

            <Link
              to="/how-it-works"
              className="group inline-flex items-center px-10 py-5 border-3 border-white/40 text-white rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white/60 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg backdrop-blur-sm"
            >
              <svg className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Learn How It Works
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <h4 className="text-white font-bold text-lg mb-2">Secure & Reliable</h4>
              <p className="text-white/90 text-sm">Enterprise-grade security you can trust</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <h4 className="text-white font-bold text-lg mb-2">Growing Community</h4>
              <p className="text-white/90 text-sm">Join thousands of satisfied users</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 3a9 9 0 100 18 9 9 0 000-18zm0 16a7 7 0 110-14 7 7 0 010 14z" />
                  </svg>
                </div>
              </div>
              <h4 className="text-white font-bold text-lg mb-2">Always Here</h4>
              <p className="text-white/90 text-sm">24/7 support whenever you need us</p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/25">
            <p className="text-white/70 text-sm max-w-2xl mx-auto leading-relaxed">
              <span className="inline-block w-6 h-6 bg-white/20 rounded-full mr-3 mb-1">
                <svg className="w-4 h-4 text-white m-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <strong>Experience the difference</strong> with a platform built on trust, innovation, and user-centric design.
              Your property management journey starts here.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;

