import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';
import CTASection from '../components/CTASection';
import Card from '../components/ui/Card';
import MetricCard from '../components/ui/MetricCard';

function Landing() {
  const { user, isSuperAdmin, isPropertyManager, isVendor, isPropertyOwner } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect all authenticated users to their role-specific dashboard
    if (user) {
      if (isSuperAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else if (isPropertyManager) {
        navigate('/property-manager/dashboard', { replace: true });
      } else if (isVendor) {
        navigate('/vendor/dashboard', { replace: true });
      } else if (isPropertyOwner) {
        navigate('/owner/dashboard', { replace: true });
      }
    }
  }, [user, isSuperAdmin, isPropertyManager, isVendor, isPropertyOwner, navigate]);
  const features = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: 'Advanced Search',
      description: 'Find your perfect property with powerful filtering options by price, location, bedrooms, and more.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Secure Platform',
      description: 'Your data and transactions are protected with industry-standard security measures.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Easy Payments',
      description: 'Streamlined rent payment process coming soon. Pay your rent online securely and on time.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Property Management',
      description: 'Owners can easily manage listings, track tenants, and handle all property-related tasks in one place.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Fast & Efficient',
      description: 'Quick property discovery and instant listing updates. Save time with our streamlined platform.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Mobile Friendly',
      description: 'Access your properties and manage listings from anywhere, on any device.'
    }
  ];

  return (
    <div className="min-h-screen bg-porcelain">
      {/* Hero Section */}
      <HeroSection
        title="Modern Property Operations, Elevated"
        subtitle="Search, lease, pay, and manage in a single premium experience. No commissions for owners, effortless discovery for tenants, and streamlined workflows for managers."
        primaryCTA="Get Started Free"
        primaryLink="/register"
        secondaryCTA="Browse Properties"
        secondaryLink="/properties"
      />

      {/* Hero promise strip */}
      <section className="bg-porcelain px-4 pb-12 -mt-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Premium Experience', value: 'Design-first', subtitle: 'Crystal-clear hierarchy, zero clutter' },
            { title: 'Launch Fast', value: '< 3 minutes', subtitle: 'Pick your role, start doing real work' },
            { title: 'All Roles, One Hub', value: 'Tenant • Owner • PM • Vendor', subtitle: 'Unified platform, no silos' }
          ].map((item) => (
            <Card key={item.title} variant="elevated" padding="lg" className="h-full bg-[var(--color-surface)]/95 backdrop-blur">
              <Card.Title className="text-xs uppercase tracking-[0.18em] text-architectural">{item.title}</Card.Title>
              <p className="text-2xl font-bold text-charcoal mt-2">{item.value}</p>
              <p className="text-sm text-architectural mt-1">{item.subtitle}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* What is PropManage Section */}
      <section className="py-16 px-4 bg-[var(--color-surface)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-4 text-charcoal">What is PropManage?</h2>
            <p className="text-lg md:text-xl text-architectural leading-relaxed">
              A premium, role-aware platform that unifies discovery, leasing, payments, maintenance, and analytics with a clean, modern interface.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              { title: 'For Tenants', desc: 'Search beautifully, favorite quickly, message instantly, and track applications in one flow.' },
              { title: 'For Owners', desc: 'List with zero commissions, manage tenants and payments, and view clear portfolio analytics.' },
              { title: 'For Managers', desc: 'Onboard properties, orchestrate vendors, track maintenance, and monitor revenue in real time.' }
            ].map((item) => (
              <Card key={item.title} variant="elevated" padding="lg" className="h-full">
                <Card.Title className="text-xl mb-2">{item.title}</Card.Title>
                <Card.Description className="leading-relaxed">{item.desc}</Card.Description>
              </Card>
            ))}
          </div>

          <Card variant="filled" padding="lg" className="mt-12 bg-obsidian text-porcelain border border-obsidian-500">
            <div className="grid md:grid-cols-3 gap-4 text-left">
              {[
                { title: 'No Commissions', desc: 'Keep 100% of rental income—evergreen pricing.' },
                { title: 'One Platform', desc: 'Search, lease, pay, track, and message without context switching.' },
                { title: 'Secure & Private', desc: 'Enterprise-grade security with privacy-first defaults.' }
              ].map((item) => (
                <div key={item.title}>
                  <span className="font-semibold text-porcelain">✓ {item.title}</span>
                  <p className="text-stone-200 text-sm mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16 px-4 bg-porcelain">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-10 text-charcoal">Why Choose PropManage?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'For Tenants',
                items: ['Advanced search & filters', 'Direct owner chat', 'Favorites & application tracking', 'Mobile-first experience'],
                cta: { text: 'Learn more →', link: '/for-tenants' }
              },
              {
                title: 'For Owners',
                items: ['Unlimited listings', 'Zero commission fees', 'Tenant & payment tools', 'Analytics & reporting'],
                cta: { text: 'Learn more →', link: '/for-owners' }
              },
              {
                title: 'All-in-One',
                items: ['Search, lease, and pay', 'Messaging & maintenance', 'Secure processing', 'Unified operations'],
                cta: { text: 'View features →', link: '/features' }
              }
            ].map((block) => (
              <Card key={block.title} variant="elevated" padding="lg" className="h-full">
                <Card.Title className="text-2xl mb-3">{block.title}</Card.Title>
                <ul className="text-sm text-architectural mb-5 space-y-2">
                  {block.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 text-brass">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link to={block.cta.link} className="text-obsidian font-semibold hover:text-brass transition-colors text-sm">
                  {block.cta.text}
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-16 px-4 bg-porcelain">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-charcoal mb-4">Powerful Features</h2>
            <p className="text-xl text-architectural">Everything you need to manage properties efficiently</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/features"
              className="inline-block px-6 py-3 bg-obsidian text-porcelain rounded-xl font-semibold hover:bg-obsidian-light transition-colors"
            >
              View All Features
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-16 px-4 bg-stone-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-charcoal">Get Started in 3 Simple Steps</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Browse Properties', desc: 'Explore curated listings with filters for location, price, and amenities.' },
              { step: '2', title: 'Choose Your Role', desc: 'Sign up as Tenant, Owner, or Manager and unlock role-specific tools.' },
              { step: '3', title: 'Launch in Minutes', desc: 'Onboard quickly—no credit card required. Manage or apply immediately.' }
            ].map((item) => (
              <Card key={item.step} variant="elevated" padding="lg" className="text-center h-full">
                <div className="w-14 h-14 bg-obsidian text-porcelain rounded-xl flex items-center justify-center font-bold text-xl mx-auto mb-4 shadow-md">
                  {item.step}
                </div>
                <Card.Title className="text-xl mb-2">{item.title}</Card.Title>
                <Card.Description className="text-architectural">{item.desc}</Card.Description>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-architectural mb-4">
              Not sure which role to choose? <Link to="/how-it-works" className="text-obsidian font-semibold hover:text-brass transition-colors">See how it works</Link>
            </p>
            <Link
              to="/register"
              className="inline-block px-8 py-4 bg-gradient-to-r from-obsidian to-brass text-porcelain rounded-xl font-semibold text-lg hover:brightness-110 transition-transform hover:-translate-y-0.5 shadow-xl"
            >
              Create Your Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-obsidian-700 via-obsidian-600 to-obsidian-800 text-porcelain">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-porcelain">Trusted by Property Owners and Tenants</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Properties Listed" value="100+" subtitle="Growing daily" variant="gradient" accent="brass" />
            <MetricCard title="Active Users" value="500+" subtitle="Tenants & owners" variant="gradient" accent="obsidian" />
            <MetricCard title="Satisfaction" value="98%" subtitle="Happy customers" variant="gradient" accent="brass" />
            <MetricCard title="Support" value="24/7" subtitle="Always here to help" variant="gradient" accent="obsidian" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready to Get Started?"
        description="Join thousands of tenants and property owners using PropManage to simplify property management."
        primaryText="Browse Properties"
        primaryLink="/properties"
        secondaryText="Create Account"
        secondaryLink="/register"
      />
    </div>
  );
}

export default Landing;

