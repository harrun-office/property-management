import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import BenefitSection from '../components/BenefitSection';
import FeatureCard from '../components/FeatureCard';
import CTASection from '../components/CTASection';

function ForTenants() {
  const benefits = [
    'Advanced search filters to find exactly what you need',
    'Secure online rent payment system (coming soon)',
    'Direct communication with property owners',
    'Property history and reviews from other tenants',
    'Mobile-friendly platform accessible anywhere',
    'No hidden fees or commissions',
    'Real-time property availability updates',
    'Save favorite properties for later'
  ];

  const features = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: 'Smart Search',
      description: 'Filter properties by price, location, bedrooms, bathrooms, and property type. Find your perfect match in seconds.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Easy Rent Payment',
      description: 'Pay your rent online securely with just a few clicks. Set up automatic payments and never miss a due date. (Coming Soon)'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: 'Direct Communication',
      description: 'Message property owners directly through the platform. Ask questions, schedule viewings, and get quick responses.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      title: 'Property Reviews',
      description: 'Read reviews from previous tenants and share your own experiences. Make informed decisions based on real feedback.'
    }
  ];

  return (
    <div className="min-h-screen">
      <HeroSection
        title="Find Your Perfect Home"
        subtitle="Search thousands of properties, connect with owners, and manage your rental journey all in one place. Free to browse, free to register."
        primaryCTA="Create Free Account"
        primaryLink="/register"
        secondaryCTA="Browse Properties"
        secondaryLink="/properties"
      />

      {/* What You Can Do Section */}
      <section className="py-16 px-4 bg-stone-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-charcoal">What You Can Do as a Tenant</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-porcelain p-6 rounded-xl">
              <div className="text-obsidian-500 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-charcoal">Search Properties</h3>
              <p className="text-architectural text-sm">Use advanced filters to find properties by price, location, bedrooms, and more.</p>
            </div>
            <div className="bg-porcelain p-6 rounded-xl">
              <div className="text-obsidian-500 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-charcoal">Save Favorites</h3>
              <p className="text-architectural text-sm">Bookmark properties you like and access them anytime from your account.</p>
            </div>
            <div className="bg-porcelain p-6 rounded-xl">
              <div className="text-obsidian-500 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-charcoal">Contact Owners</h3>
              <p className="text-architectural text-sm">Message property owners directly to ask questions or schedule viewings.</p>
            </div>
            <div className="bg-porcelain p-6 rounded-xl">
              <div className="text-obsidian-500 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-charcoal">Submit Applications</h3>
              <p className="text-architectural text-sm">Apply for properties directly through the platform and track your application status.</p>
            </div>
            <div className="bg-porcelain p-6 rounded-xl">
              <div className="text-obsidian-500 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-charcoal">Track Applications</h3>
              <p className="text-architectural text-sm">Keep track of all your property applications in one convenient dashboard.</p>
            </div>
            <div className="bg-porcelain p-6 rounded-xl">
              <div className="text-obsidian-500 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-charcoal">Pay Rent Online</h3>
              <p className="text-architectural text-sm">Once you move in, pay rent securely online (coming soon).</p>
            </div>
          </div>
        </div>
      </section>

      {/* Before You Register Section */}
      <section className="py-16 px-4 bg-porcelain">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-charcoal">Before You Register</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-stone-100 p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-charcoal flex items-center">
                <svg className="w-6 h-6 text-eucalyptus-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                What You Can Do Without Registering
              </h3>
              <ul className="space-y-2 text-architectural">
                <li className="flex items-start">
                  <span className="text-eucalyptus-500 mr-2">✓</span>
                  <span>Browse all available properties</span>
                </li>
                <li className="flex items-start">
                  <span className="text-eucalyptus-500 mr-2">✓</span>
                  <span>Use search filters</span>
                </li>
                <li className="flex items-start">
                  <span className="text-eucalyptus-500 mr-2">✓</span>
                  <span>View property details and photos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-eucalyptus-500 mr-2">✓</span>
                  <span>Read property descriptions</span>
                </li>
              </ul>
            </div>
            <div className="bg-stone-100 p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-charcoal flex items-center">
                <svg className="w-6 h-6 text-obsidian-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                What Requires Registration
              </h3>
              <ul className="space-y-2 text-architectural">
                <li className="flex items-start">
                  <span className="text-obsidian-500 mr-2">→</span>
                  <span>Contact property owners</span>
                </li>
                <li className="flex items-start">
                  <span className="text-obsidian-500 mr-2">→</span>
                  <span>Save favorite properties</span>
                </li>
                <li className="flex items-start">
                  <span className="text-obsidian-500 mr-2">→</span>
                  <span>Submit applications</span>
                </li>
                <li className="flex items-start">
                  <span className="text-obsidian-500 mr-2">→</span>
                  <span>Track application status</span>
                </li>
                <li className="flex items-start">
                  <span className="text-obsidian-500 mr-2">→</span>
                  <span>Pay rent online (coming soon)</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-8">
            <p className="text-architectural mb-4">Ready to get started? Registration is free and takes less than 2 minutes!</p>
            <Link
              to="/register"
              className="inline-block px-8 py-4 bg-obsidian-500 text-white rounded-xl font-semibold text-lg hover:bg-obsidian-600 transition-colors"
            >
              Create Your Free Account
            </Link>
          </div>
        </div>
      </section>

      <BenefitSection
        title="Why Tenants Love PropManage"
        benefits={benefits}
        imageUrl="https://images.unsplash.com/photo-1560185008-b033106af5d6"
      />

      <section className="py-16 px-4 bg-porcelain">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-charcoal">
            Features Built for Tenants
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-stone-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8 text-charcoal">
            How It Works for Tenants
          </h2>
          <div className="space-y-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-obsidian-500 text-white rounded-full flex items-center justify-center font-bold text-xl mr-6">
                1
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Create Your Account</h3>
                <p className="text-architectural">Sign up as a tenant in seconds. No credit card required.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-obsidian-500 text-white rounded-full flex items-center justify-center font-bold text-xl mr-6">
                2
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Search Properties</h3>
                <p className="text-architectural">Use our advanced filters to find properties that match your budget, location, and preferences.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-obsidian-500 text-white rounded-full flex items-center justify-center font-bold text-xl mr-6">
                3
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Contact Owners</h3>
                <p className="text-architectural">Message property owners directly, ask questions, and schedule viewings.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-obsidian-500 text-white rounded-full flex items-center justify-center font-bold text-xl mr-6">
                4
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Pay Rent Online</h3>
                <p className="text-architectural">Once you move in, pay rent securely online. Set up automatic payments for convenience. (Coming Soon)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to Find Your Next Home?"
        description="Join thousands of tenants who have found their perfect property through PropManage."
        primaryText="Start Searching"
        primaryLink="/properties"
        secondaryText="Sign Up Free"
        secondaryLink="/register"
      />
    </div>
  );
}

export default ForTenants;

