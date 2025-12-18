import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';
import CTASection from '../components/CTASection';

function Landing() {
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Your Complete Property Management Solution"
        subtitle="Connect tenants with property owners. Search properties, manage listings, and handle everything in one secure platform. Free for tenants, no commission fees for owners."
        primaryCTA="Get Started Free"
        primaryLink="/register"
        secondaryCTA="Browse Properties"
        secondaryLink="/properties"
      />

      {/* What is PropManage Section */}
      <section className="py-16 px-4 bg-porcelain">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-charcoal">What is PropManage?</h2>
          <p className="text-xl text-architectural leading-relaxed mb-6">
            PropManage is a comprehensive property management platform that connects tenants and property owners in one easy-to-use system. 
            Whether you're looking for your next home or managing rental properties, we provide all the tools you need.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-stone-100 p-6 rounded-xl shadow-md border border-stone-200">
              <h3 className="text-lg font-semibold mb-2 text-charcoal">For Tenants</h3>
              <p className="text-architectural">Search properties, contact owners, and manage your rental journey</p>
            </div>
            <div className="bg-stone-100 p-6 rounded-xl shadow-md border border-stone-200">
              <h3 className="text-lg font-semibold mb-2 text-charcoal">For Property Owners</h3>
              <p className="text-architectural">List properties, manage tenants, and track everything from one dashboard</p>
            </div>
            <div className="bg-stone-100 p-6 rounded-xl shadow-md border border-stone-200">
              <h3 className="text-lg font-semibold mb-2 text-charcoal">For Property Managers</h3>
              <p className="text-architectural">Manage multiple properties, assign vendors, and track maintenance tasks</p>
            </div>
          </div>
          <div className="mt-8 p-6 bg-obsidian-500 text-porcelain rounded-xl">
            <h3 className="text-2xl font-semibold mb-3">Key Differentiators</h3>
            <div className="grid md:grid-cols-3 gap-4 text-left">
              <div>
                <span className="font-semibold">✓ No Commission Fees</span>
                <p className="text-stone-200 text-sm mt-1">Owners keep 100% of rental income</p>
              </div>
              <div>
                <span className="font-semibold">✓ All-in-One Platform</span>
                <p className="text-stone-200 text-sm mt-1">Everything you need in one place</p>
              </div>
              <div>
                <span className="font-semibold">✓ Secure & Trusted</span>
                <p className="text-stone-200 text-sm mt-1">Industry-standard security measures</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16 px-4 bg-porcelain">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-charcoal">
            Why Choose PropManage?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-obsidian-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-charcoal">For Tenants</h3>
              <p className="text-architectural mb-4">
                <strong>Free to browse</strong> thousands of properties with advanced search filters. Save favorites, 
                contact owners directly, and track your applications—all in one place.
              </p>
              <ul className="text-sm text-architectural mb-4 text-left space-y-1">
                <li>✓ Advanced property search</li>
                <li>✓ Direct owner communication</li>
                <li>✓ Save favorite properties</li>
                <li>✓ Track applications</li>
              </ul>
              <Link to="/for-tenants" className="text-obsidian-500 font-semibold hover:text-brass-500 transition-colors">
                Learn more →
              </Link>
            </div>
            <div className="text-center">
              <div className="text-obsidian-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-charcoal">For Owners</h3>
              <p className="text-architectural mb-4">
                <strong>No commission fees!</strong> List unlimited properties, reach thousands of tenants, and manage 
                everything from one powerful dashboard. Keep 100% of your rental income.
              </p>
              <ul className="text-sm text-architectural mb-4 text-left space-y-1">
                <li>✓ Unlimited property listings</li>
                <li>✓ Zero commission fees</li>
                <li>✓ Tenant management tools</li>
                <li>✓ Analytics & reports</li>
              </ul>
              <Link to="/for-owners" className="text-obsidian-500 font-semibold hover:text-brass-500 transition-colors">
                Learn more →
              </Link>
            </div>
            <div className="text-center">
              <div className="text-obsidian-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-charcoal">All-in-One</h3>
              <p className="text-architectural mb-4">
                Complete property management solution. From property discovery to rent collection, tenant communication 
                to maintenance tracking—everything you need in one secure platform.
              </p>
              <ul className="text-sm text-architectural mb-4 text-left space-y-1">
                <li>✓ Property search & listing</li>
                <li>✓ Direct messaging system</li>
                <li>✓ Secure payment processing</li>
                <li>✓ Mobile-friendly design</li>
              </ul>
              <Link to="/features" className="text-obsidian-500 font-semibold hover:text-brass-500 transition-colors">
                View features →
              </Link>
            </div>
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
              className="inline-block px-6 py-3 bg-obsidian-500 text-porcelain rounded-xl font-semibold hover:bg-obsidian-600 transition-colors"
            >
              View All Features
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-16 px-4 bg-stone-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-charcoal">Get Started in 3 Simple Steps</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-obsidian-500 text-porcelain rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-3 text-charcoal">Browse Properties</h3>
              <p className="text-architectural mb-4">Explore available properties without creating an account. Use filters to find exactly what you're looking for.</p>
              <Link to="/properties" className="text-obsidian-500 font-semibold hover:text-brass-500 transition-colors text-sm">
                Browse now →
              </Link>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-obsidian-500 text-porcelain rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-3 text-charcoal">Choose Your Role</h3>
              <p className="text-architectural mb-4">Register as a Tenant to find properties, or as a Property Owner to list and manage your properties.</p>
              <Link to="/how-it-works" className="text-obsidian-500 font-semibold hover:text-brass-500 transition-colors text-sm">
                Learn more →
              </Link>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-obsidian-500 text-porcelain rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-3 text-charcoal">Start Using</h3>
              <p className="text-architectural mb-4">Create your free account in seconds. No credit card required. Start managing properties or finding your next home today.</p>
              <Link to="/register" className="text-obsidian-500 font-semibold hover:text-brass-500 transition-colors text-sm">
                Register now →
              </Link>
            </div>
          </div>
          <div className="text-center mt-12">
            <p className="text-architectural mb-4">Not sure which role to choose? <Link to="/how-it-works" className="text-obsidian-500 font-semibold hover:text-brass-500 transition-colors">See how it works</Link></p>
            <Link
              to="/register"
              className="inline-block px-8 py-4 bg-brass-500 text-white rounded-xl font-semibold text-lg hover:bg-brass-600 transition-colors shadow-lg"
            >
              Create Your Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-obsidian-500 text-porcelain">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Trusted by Property Owners and Tenants</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2 text-brass-500">100+</div>
              <div className="text-stone-200">Properties Listed</div>
              <div className="text-stone-300 text-sm mt-1">And growing daily</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2 text-brass-500">500+</div>
              <div className="text-stone-200">Active Users</div>
              <div className="text-stone-300 text-sm mt-1">Tenants and owners</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2 text-brass-500">98%</div>
              <div className="text-stone-200">Satisfaction Rate</div>
              <div className="text-stone-300 text-sm mt-1">Happy customers</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2 text-brass-500">24/7</div>
              <div className="text-stone-200">Support Available</div>
              <div className="text-stone-300 text-sm mt-1">Always here to help</div>
            </div>
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

