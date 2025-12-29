import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';
import CTASection from '../components/CTASection';
import Card from '../components/ui/Card';
import MetricCard from '../components/ui/MetricCard';

function Landing() {
  const { user, isSuperAdmin, isPropertyManager, isVendor, isPropertyOwner, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated users to their role-specific dashboard only on initial load
    // This prevents the landing page from being blank for logged-in users
    // but still allows them to return to the landing page if desired
    if (user && window.location.pathname === '/') {
      // Add a small delay to allow the landing page to render first
      const timer = setTimeout(() => {
        if (isSuperAdmin) {
          navigate('/admin/dashboard', { replace: true });
        } else if (isPropertyManager) {
          navigate('/property-manager/dashboard', { replace: true });
        } else if (isVendor) {
          navigate('/vendor/dashboard', { replace: true });
        } else if (isPropertyOwner) {
          navigate('/owner/dashboard', { replace: true });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [user, isSuperAdmin, isPropertyManager, isVendor, isPropertyOwner, navigate]);

  const features = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: 'Smart Property Search',
      description: 'Advanced filtering by location, price, amenities, and property type. Find your perfect rental in minutes.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Bank-Level Security',
      description: 'Enterprise-grade encryption, secure payments, and privacy-first design. Your data is always protected.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Automated Rent Collection',
      description: 'Set up automatic rent payments, track payment history, and never chase late payments again.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Complete Property Management',
      description: 'From tenant screening to maintenance tracking, manage every aspect of your properties in one platform.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Lightning Fast',
      description: 'Modern tech stack with instant updates, real-time notifications, and seamless mobile experience.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Mobile First Design',
      description: 'Access your properties, communicate with tenants, and manage maintenance from anywhere, anytime.'
    }
  ];

  // Show loading state if auth is still loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--ui-bg-page)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
          <p className="text-sm text-[var(--ui-text-muted)] mt-2">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--ui-bg-page)] via-[var(--ui-bg-surface)]/30 to-[var(--ui-bg-page)] relative overflow-hidden backdrop-blur-[0.5px]">
      {/* Advanced Background Effects with Page Animation */}
      <div className="absolute inset-0 animate-fade-in" style={{animationDuration: '1.5s'}}>
        {/* Primary gradient mesh */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[var(--color-overlay-primary)] via-transparent to-[var(--color-overlay-secondary)] opacity-60"></div>

        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-[var(--brand-accent)]/10 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-tl from-[var(--brand-secondary)]/8 to-transparent rounded-full blur-xl animate-pulse" style={{animationDuration: '6s', animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-tr from-[var(--brand-tertiary)]/6 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDuration: '5s', animationDelay: '2s'}}></div>

        {/* Subtle mesh pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(37, 99, 235, 0.15) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(124, 58, 237, 0.1) 1px, transparent 1px),
            radial-gradient(circle at 50% 10%, rgba(6, 182, 212, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px, 60px 60px, 100px 100px'
        }}></div>
      </div>
      {/* Enhanced Hero Section with Advanced Animations */}
      <div className="animate-slide-up" style={{animationDelay: '0.2s', animationFillMode: 'both'}}>
        <HeroSection
          title="Transform Your Property Business in 30 Days"
          subtitle="Join 500+ property managers who've automated rent collection, eliminated vacancies, and increased profits by 40%. Start your free trial today - no credit card required."
          primaryCTA="Start Free 30-Day Trial"
          primaryLink="/register"
          secondaryCTA="Watch 2-Min Demo"
          secondaryLink="#demo"
        />
      </div>

      {/* Advanced Social Proof Hub with Scroll Animation */}
      <section className="relative py-16 animate-slide-up" style={{animationDelay: '0.4s', animationFillMode: 'both'}}>
        {/* Glassmorphism background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--ui-bg-surface)]/90 via-[var(--ui-bg-surface)]/95 to-[var(--ui-bg-surface)]/90 backdrop-blur-xl border-y border-[var(--ui-border-default)]/50"></div>

        {/* Enhanced Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-4 left-1/4 w-16 h-16 bg-gradient-to-br from-[var(--brand-accent)]/20 to-transparent rounded-full blur-lg animate-float" style={{animationDuration: '6s'}}></div>
          <div className="absolute bottom-4 right-1/3 w-12 h-12 bg-gradient-to-tl from-[var(--brand-secondary)]/15 to-transparent rounded-full blur-md animate-float" style={{animationDuration: '8s', animationDelay: '2s'}}></div>
          <div className="absolute top-8 right-1/4 w-8 h-8 bg-gradient-to-bl from-[var(--brand-tertiary)]/10 to-transparent rounded-full blur-sm animate-float" style={{animationDuration: '7s', animationDelay: '4s'}}></div>

          {/* Additional floating particles */}
          <div className="absolute top-1/3 left-1/6 w-3 h-3 bg-[var(--brand-accent)]/30 rounded-full animate-float opacity-40" style={{animationDuration: '5s', animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/3 right-1/6 w-2 h-2 bg-[var(--brand-secondary)]/25 rounded-full animate-float opacity-50" style={{animationDuration: '7s', animationDelay: '3s'}}></div>
          <div className="absolute top-2/3 left-1/3 w-1.5 h-1.5 bg-[var(--brand-tertiary)]/35 rounded-full animate-float opacity-45" style={{animationDuration: '6s', animationDelay: '2.5s'}}></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--brand-accent)]/10 via-[var(--brand-secondary)]/10 to-[var(--brand-accent)]/10 rounded-full text-sm font-semibold text-[var(--ui-text-primary)] border border-[var(--ui-border-default)]/50 backdrop-blur-sm mb-4">
              <div className="flex gap-1">
                {[1,2,3,4,5].map((star) => (
                  <svg key={star} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <span>Industry-Leading Platform</span>
            </div>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[var(--brand-accent)] to-transparent mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Properties Managed */}
            <div className="group relative">
              <div className="bg-gradient-to-br from-[var(--ui-bg-surface)] to-[var(--ui-bg-surface)]/80 backdrop-blur-sm rounded-2xl p-6 border border-[var(--ui-border-default)]/50 hover:border-[var(--brand-accent)]/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--ui-success)] via-[var(--ui-success)] to-[var(--ui-success)]/80 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-[var(--ui-text-primary)] group-hover:text-[var(--brand-accent)] transition-colors duration-300">500+</div>
                    <div className="text-xs text-[var(--ui-text-secondary)] uppercase tracking-wider">Properties</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--ui-text-secondary)]">Managed Daily</span>
                    <span className="font-semibold text-[var(--ui-text-primary)]">24/7</span>
                  </div>
                  <div className="w-full bg-[var(--ui-bg-muted)] rounded-full h-2 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-[var(--ui-success)] to-[var(--ui-success)]/80 rounded-full w-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tenant Satisfaction */}
            <div className="group relative">
              <div className="bg-gradient-to-br from-[var(--ui-bg-surface)] to-[var(--ui-bg-surface)]/80 backdrop-blur-sm rounded-2xl p-6 border border-[var(--ui-border-default)]/50 hover:border-[var(--brand-secondary)]/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--brand-accent)] via-[var(--brand-accent)] to-[var(--brand-accent-dark)] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-[var(--ui-text-primary)] group-hover:text-[var(--brand-secondary)] transition-colors duration-300">98%</div>
                    <div className="text-xs text-[var(--ui-text-secondary)] uppercase tracking-wider">Satisfaction</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--ui-text-secondary)]">Tenant Rating</span>
                    <span className="font-semibold text-[var(--ui-text-primary)]">★★★★★</span>
                  </div>
                  <div className="w-full bg-[var(--ui-bg-muted)] rounded-full h-2 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-[var(--brand-accent)] to-[var(--brand-accent-dark)] rounded-full w-[98%] animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Compliance */}
            <div className="group relative">
              <div className="bg-gradient-to-br from-[var(--ui-bg-surface)] to-[var(--ui-bg-surface)]/80 backdrop-blur-sm rounded-2xl p-6 border border-[var(--ui-border-default)]/50 hover:border-[var(--brand-tertiary)]/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--ui-info)] via-[var(--ui-info)] to-[var(--ui-info)]/80 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-[var(--ui-text-primary)] group-hover:text-[var(--brand-tertiary)] transition-colors duration-300">SOC 2</div>
                    <div className="text-xs text-[var(--ui-text-secondary)] uppercase tracking-wider">Certified</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--ui-text-secondary)]">Security Level</span>
                    <span className="font-semibold text-[var(--ui-text-primary)]">Enterprise</span>
                  </div>
                  <div className="w-full bg-[var(--ui-bg-muted)] rounded-full h-2 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-[var(--ui-info)] to-[var(--ui-info)]/80 rounded-full w-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Benefits Showcase with Scroll Animation */}
      <section className="py-32 px-4 bg-gradient-to-b from-[var(--ui-bg-surface)] via-[var(--ui-bg-surface)] to-[var(--ui-bg-page)] relative overflow-hidden animate-slide-up" style={{animationDelay: '0.6s', animationFillMode: 'both'}}>
        {/* Advanced Background Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-[var(--color-overlay-primary)] to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-[var(--color-overlay-secondary)] to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[var(--color-overlay-tertiary)] via-transparent to-[var(--color-overlay-primary)] rounded-full blur-3xl opacity-30"></div>

        {/* Floating accent elements */}
        <div className="absolute top-20 right-10 w-4 h-4 bg-[var(--brand-accent)] rounded-full animate-float opacity-20" style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-20 left-10 w-3 h-3 bg-[var(--brand-secondary)] rounded-full animate-float opacity-15" style={{animationDuration: '6s', animationDelay: '2s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-[var(--brand-tertiary)] rounded-full animate-float opacity-25" style={{animationDuration: '5s', animationDelay: '1s'}}></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-accent)]/10 text-[var(--brand-accent)] rounded-full text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Proven Results
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[var(--ui-text-primary)] to-[var(--ui-text-secondary)] bg-clip-text text-transparent">
              Why Property Managers Choose Us
            </h2>
            <p className="text-xl text-[var(--ui-text-secondary)] max-w-3xl mx-auto leading-relaxed">
              The complete solution for modern property management that delivers real results
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[var(--ui-bg-surface)] via-[var(--ui-bg-surface)] to-[var(--ui-bg-surface)]/90 backdrop-blur-sm rounded-3xl p-8 border border-[var(--ui-border-default)]/50 hover:border-[var(--brand-accent)]/40 shadow-soft hover:shadow-strong hover:-translate-y-3 transition-all duration-700 group relative overflow-hidden animate-slide-up" style={{animationDelay: '0.8s', animationFillMode: 'both'}}>
              {/* Card background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-overlay-primary)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>

              {/* Floating accent dot */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-[var(--brand-accent)] rounded-full animate-pulse opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">
                <div className="relative mb-8">
                  <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-[var(--brand-accent)] via-[var(--brand-accent)] to-[var(--brand-accent-dark)] flex items-center justify-center text-5xl shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 relative">
                    💰
                    {/* Icon glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  </div>
                  {/* Success badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-[var(--ui-success)] to-[var(--ui-success)]/80 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{animationDuration: '2s'}}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-6 text-[var(--ui-text-primary)] group-hover:text-[var(--brand-accent)] transition-colors duration-500">
                  Never Chase Rent Again
                </h3>

                <p className="text-[var(--ui-text-secondary)] leading-relaxed mb-8 group-hover:text-[var(--ui-text-primary)] transition-colors duration-500">
                  Automated rent collection with instant notifications. Reduce late payments by 60% and save 10+ hours per month on billing tasks.
                </p>

                <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-[var(--ui-success)]/10 via-[var(--ui-success)]/15 to-[var(--ui-success)]/10 text-[var(--ui-success)] rounded-2xl text-sm font-bold border border-[var(--ui-success)]/20 shadow-soft group-hover:shadow-medium transition-all duration-500">
                  <div className="w-5 h-5 bg-[var(--ui-success)] rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span>60% fewer late payments</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[var(--ui-bg-surface)] via-[var(--ui-bg-surface)] to-[var(--ui-bg-surface)]/90 backdrop-blur-sm rounded-3xl p-8 border border-[var(--ui-border-default)]/50 hover:border-[var(--brand-secondary)]/40 shadow-soft hover:shadow-strong hover:-translate-y-3 transition-all duration-700 group relative overflow-hidden animate-slide-up" style={{animationDelay: '1.0s', animationFillMode: 'both'}}>
              {/* Card background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-overlay-secondary)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>

              {/* Floating accent dot */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-[var(--brand-secondary)] rounded-full animate-pulse opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">
                <div className="relative mb-8">
                  <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-[var(--ui-success)] via-[var(--ui-success)] to-[var(--ui-success)]/80 flex items-center justify-center text-5xl shadow-2xl group-hover:scale-110 group-hover:-rotate-6 transition-all duration-700 relative">
                    🏠
                    {/* Icon glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  </div>
                  {/* Success badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-[var(--ui-success)] to-[var(--ui-success)]/80 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{animationDuration: '2.5s'}}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-6 text-[var(--ui-text-primary)] group-hover:text-[var(--brand-secondary)] transition-colors duration-500">
                  Fill Vacancies Faster
                </h3>

                <p className="text-[var(--ui-text-secondary)] leading-relaxed mb-8 group-hover:text-[var(--ui-text-primary)] transition-colors duration-500">
                  Professional property listings with automated marketing. Reduce vacancy periods by 35% and attract higher-quality tenants.
                </p>

                <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-[var(--ui-success)]/10 via-[var(--ui-success)]/15 to-[var(--ui-success)]/10 text-[var(--ui-success)] rounded-2xl text-sm font-bold border border-[var(--ui-success)]/20 shadow-soft group-hover:shadow-medium transition-all duration-500">
                  <div className="w-5 h-5 bg-[var(--ui-success)] rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span>35% shorter vacancies</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[var(--ui-bg-surface)] via-[var(--ui-bg-surface)] to-[var(--ui-bg-surface)]/90 backdrop-blur-sm rounded-3xl p-8 border border-[var(--ui-border-default)]/50 hover:border-[var(--brand-tertiary)]/40 shadow-soft hover:shadow-strong hover:-translate-y-3 transition-all duration-700 group relative overflow-hidden animate-slide-up" style={{animationDelay: '1.2s', animationFillMode: 'both'}}>
              {/* Card background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-overlay-tertiary)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>

              {/* Floating accent dot */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-[var(--brand-tertiary)] rounded-full animate-pulse opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">
                <div className="relative mb-8">
                  <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-[var(--ui-info)] via-[var(--ui-info)] to-[var(--ui-info)]/80 flex items-center justify-center text-5xl shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 relative">
                    📊
                    {/* Icon glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  </div>
                  {/* Success badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-[var(--ui-success)] to-[var(--ui-success)]/80 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{animationDuration: '3s'}}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-6 text-[var(--ui-text-primary)] group-hover:text-[var(--brand-tertiary)] transition-colors duration-500">
                  Make Smarter Decisions
                </h3>

                <p className="text-[var(--ui-text-secondary)] leading-relaxed mb-8 group-hover:text-[var(--ui-text-primary)] transition-colors duration-500">
                  Real-time analytics and automated reports. Track performance, optimize pricing, and grow your portfolio with data-driven insights.
                </p>

                <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-[var(--ui-info)]/10 via-[var(--ui-info)]/15 to-[var(--ui-info)]/10 text-[var(--ui-info)] rounded-2xl text-sm font-bold border border-[var(--ui-info)]/20 shadow-soft group-hover:shadow-medium transition-all duration-500">
                  <div className="w-5 h-5 bg-[var(--ui-info)] rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span>Real-time insights</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced How It Works with Scroll Animation */}
      <section className="py-32 px-4 bg-gradient-to-b from-[var(--ui-bg-page)] to-[var(--ui-bg-surface)] relative animate-slide-up" style={{animationDelay: '0.8s', animationFillMode: 'both'}}>
        {/* Background elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-[var(--brand-accent)]/10 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-tl from-[var(--ui-info)]/10 to-transparent rounded-full blur-2xl"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--ui-success)]/10 to-[var(--ui-success)]/20 text-[var(--ui-success)] rounded-full text-sm font-medium mb-6 border border-[var(--ui-success)]/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Quick Setup
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[var(--ui-text-primary)] to-[var(--ui-text-secondary)] bg-clip-text text-transparent">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-xl text-[var(--ui-text-secondary)] max-w-3xl mx-auto leading-relaxed">
              From signup to success in under 10 minutes. No complex setup or technical expertise required.
            </p>
          </div>

          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl">
            <div className="flex justify-between items-center">
              <div className="w-4 h-4 rounded-full bg-[var(--brand-accent)]"></div>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-[var(--brand-accent)] to-[var(--brand-accent)]/50 mx-4"></div>
              <div className="w-4 h-4 rounded-full bg-[var(--brand-accent)]"></div>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-[var(--brand-accent)] to-[var(--brand-accent)]/50 mx-4"></div>
              <div className="w-4 h-4 rounded-full bg-[var(--brand-accent)]"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            <div className="bg-[var(--ui-bg-surface)] rounded-2xl p-8 border border-[var(--ui-border-default)] shadow-soft hover:shadow-strong transition-all duration-500 group text-center animate-slide-up" style={{animationDelay: '1.0s', animationFillMode: 'both'}}>
              <div className="relative mb-8">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[var(--brand-accent)] to-[var(--brand-accent-dark)] flex items-center justify-center text-3xl font-bold text-white shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  1
                </div>
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-[var(--ui-success)] to-[var(--ui-success)]/80 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[var(--ui-text-primary)] group-hover:text-[var(--brand-accent)] transition-colors duration-300">
                Sign Up Free
              </h3>
              <p className="text-[var(--ui-text-secondary)] leading-relaxed">
                Create your account in 2 minutes. No credit card required. Import your existing properties or start fresh with our guided setup.
              </p>
            </div>

            <div className="bg-[var(--ui-bg-surface)] rounded-2xl p-8 border border-[var(--ui-border-default)] shadow-soft hover:shadow-strong transition-all duration-500 group text-center animate-slide-up" style={{animationDelay: '1.2s', animationFillMode: 'both'}}>
              <div className="relative mb-8">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[var(--ui-success)] to-[var(--ui-success)]/80 flex items-center justify-center text-3xl font-bold text-white shadow-xl group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                  2
                </div>
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-[var(--ui-info)] to-[var(--ui-info)]/80 rounded-full flex items-center justify-center shadow-lg animate-pulse" style={{animationDelay: '0.5s'}}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[var(--ui-text-primary)] group-hover:text-[var(--ui-success)] transition-colors duration-300">
                Set Up Properties
              </h3>
              <p className="text-[var(--ui-text-secondary)] leading-relaxed">
                Add your properties, set rent amounts, and configure automated collection. Our intelligent system handles the rest automatically.
              </p>
            </div>

            <div className="bg-[var(--ui-bg-surface)] rounded-2xl p-8 border border-[var(--ui-border-default)] shadow-soft hover:shadow-strong transition-all duration-500 group text-center animate-slide-up" style={{animationDelay: '1.4s', animationFillMode: 'both'}}>
              <div className="relative mb-8">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[var(--ui-info)] to-[var(--ui-info)]/80 flex items-center justify-center text-3xl font-bold text-white shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  3
                </div>
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-[var(--ui-warning)] to-[var(--ui-warning)]/80 rounded-full flex items-center justify-center shadow-lg animate-pulse" style={{animationDelay: '1s'}}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[var(--ui-text-primary)] group-hover:text-[var(--ui-info)] transition-colors duration-300">
                Start Earning More
              </h3>
              <p className="text-[var(--ui-text-secondary)] leading-relaxed">
                Watch rent come in automatically, handle maintenance requests instantly, and focus on growing your property business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Social Proof with Scroll Animation */}
      <section className="py-32 px-4 bg-gradient-to-br from-[var(--ui-bg-surface)] via-[var(--ui-bg-surface)] to-[var(--ui-bg-page)] relative overflow-hidden animate-slide-up" style={{animationDelay: '1.0s', animationFillMode: 'both'}}>
        {/* Background decoration */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-[var(--brand-accent)]/3 via-transparent to-[var(--ui-info)]/3 rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--ui-success)]/10 to-[var(--ui-success)]/20 text-[var(--ui-success)] rounded-full text-sm font-medium border border-[var(--ui-success)]/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Customer Success Story
            </div>
          </div>

          <div className="bg-[var(--ui-bg-surface)]/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-strong border border-[var(--ui-border-default)] relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-[var(--brand-accent)]/10 to-transparent rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-tl from-[var(--ui-info)]/10 to-transparent rounded-full"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-center gap-1 mb-8">
                {[1,2,3,4,5].map((star, index) => (
                  <svg key={star} className="w-8 h-8 text-yellow-400 fill-current animate-pulse" style={{animationDelay: `${index * 0.1}s`}} viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <blockquote className="text-2xl md:text-3xl text-[var(--ui-text-primary)] font-medium mb-8 italic leading-relaxed">
                "PropManage transformed our business overnight. We went from chasing rent payments to having them arrive automatically. Our vacancy rate dropped 40% and tenant satisfaction is at an all-time high."
              </blockquote>
              <div className="flex items-center justify-center gap-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--brand-accent)] via-[var(--brand-accent)] to-[var(--brand-accent-dark)] flex items-center justify-center text-white font-bold text-xl shadow-xl">
                  SM
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold text-[var(--ui-text-primary)]">Sarah Martinez</div>
                  <div className="text-[var(--ui-text-secondary)]">Property Manager • 28 Units</div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-[var(--ui-success)] rounded-full"></div>
                    <span className="text-xs text-[var(--ui-text-secondary)] uppercase tracking-wider">Verified Customer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA with Ultimate Animation */}
      <section className="py-32 px-4 bg-gradient-to-br from-[var(--brand-accent)] via-[var(--brand-accent)] to-[var(--brand-accent-dark)] relative overflow-hidden animate-slide-up" style={{animationDelay: '1.2s', animationFillMode: 'both'}}>
        {/* Advanced Background System */}
        <div className="absolute inset-0">
          {/* Primary mesh gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-accent)]/30 via-[var(--brand-secondary)]/20 to-[var(--brand-tertiary)]/25"></div>

          {/* Animated floating orbs */}
          <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-white/15 to-transparent rounded-full blur-2xl animate-float" style={{animationDuration: '8s'}}></div>
          <div className="absolute bottom-10 right-10 w-56 h-56 bg-gradient-to-tl from-white/10 to-transparent rounded-full blur-3xl animate-float" style={{animationDuration: '10s', animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-[var(--brand-secondary)]/15 via-transparent to-[var(--brand-tertiary)]/10 rounded-full blur-3xl animate-float" style={{animationDuration: '12s', animationDelay: '4s'}}></div>

          {/* Geometric pattern overlay */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(255,255,255,0.1) 0%, transparent 50%)
            `,
            backgroundSize: '200px 200px, 150px 150px, 300px 300px'
          }}></div>
        </div>

        {/* Dynamic floating elements */}
        <div className="absolute top-20 left-20 animate-bounce" style={{animationDuration: '3s'}}>
          <div className="w-3 h-3 bg-white/30 rounded-full shadow-lg"></div>
        </div>
        <div className="absolute top-40 right-32 animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}>
          <div className="w-2 h-2 bg-[var(--brand-secondary)]/40 rounded-full shadow-md"></div>
        </div>
        <div className="absolute bottom-32 left-1/3 animate-bounce" style={{animationDuration: '3.5s', animationDelay: '2s'}}>
          <div className="w-4 h-4 bg-[var(--brand-tertiary)]/35 rounded-full shadow-xl"></div>
        </div>
        <div className="absolute top-1/4 right-1/4 animate-bounce" style={{animationDuration: '5s', animationDelay: '3s'}}>
          <div className="w-2.5 h-2.5 bg-white/25 rounded-full shadow-lg"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Join 500+ Property Managers Today
            </div>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white leading-tight">
            Transform Your Property
            <br />
            <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Business Today
            </span>
          </h2>

          <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed font-light">
            Start your free 30-day trial today. No credit card required.
            Join thousands who've already transformed their property management.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link
              to="/register"
              className="group inline-flex items-center px-10 py-5 bg-white text-[var(--brand-accent)] rounded-2xl font-bold text-lg hover:bg-gray-50 hover:shadow-2xl hover:shadow-[var(--glow-primary)] transition-all duration-500 hover:scale-105 hover:-translate-y-1 relative overflow-hidden"
            >
              Start Free Trial Now
              <svg className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </Link>

            <Link
              to="#demo"
              className="group inline-flex items-center px-8 py-4 border-2 border-white/30 text-white rounded-2xl font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Watch 2-Min Demo
            </Link>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 text-white/80 text-sm">
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
              <div className="w-6 h-6 rounded-full bg-[var(--ui-success)] flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-medium">Free 30-day trial</span>
            </div>

            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
              <div className="w-6 h-6 rounded-full bg-[var(--ui-success)] flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="font-medium">No credit card required</span>
            </div>

            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
              <div className="w-6 h-6 rounded-full bg-[var(--ui-success)] flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 3a9 9 0 100 18 9 9 0 000-18zm0 16a7 7 0 110-14 7 7 0 010 14z" />
                </svg>
              </div>
              <span className="font-medium">24/7 customer support</span>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-white/60 text-sm">
              ⚡ <strong>Setup takes just 5 minutes.</strong> Join thousands of property managers who've transformed their business.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;

