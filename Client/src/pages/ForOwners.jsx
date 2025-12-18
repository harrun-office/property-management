import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import BenefitSection from '../components/BenefitSection';
import FeatureCard from '../components/FeatureCard';
import CTASection from '../components/CTASection';

function ForOwners() {
  const benefits = [
    'List unlimited properties with no commission fees',
    'Reach thousands of potential tenants instantly',
    'Easy property listing management dashboard',
    'Automated rent collection system (coming soon)',
    'Tenant management and communication tools',
    'Property analytics and performance reports',
    'Mobile app for on-the-go management',
    '24/7 customer support for property owners'
  ];

  const features = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      title: 'Easy Listing',
      description: 'Create professional property listings in minutes. Add photos, descriptions, and all relevant details with our intuitive interface.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Analytics Dashboard',
      description: 'Track your property performance with detailed analytics. See views, inquiries, and rental income all in one place.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Automated Payments',
      description: 'Collect rent automatically from tenants. Set up recurring payments and get notified when rent is received. (Coming Soon)'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Tenant Management',
      description: 'Manage all your tenants from one dashboard. Track leases, communicate easily, and handle maintenance requests.'
    }
  ];

  return (
    <div className="min-h-screen">
      <HeroSection
        title="Manage Your Properties with Ease"
        subtitle="List your properties, reach more tenants, and manage everything from one powerful dashboard. No commission fees, no hassle. Keep 100% of your rental income."
        primaryCTA="Create Owner Account"
        primaryLink="/register"
        secondaryCTA="Learn More"
        secondaryLink="/how-it-works"
      />

      {/* What You Can Do Section */}
      <section className="py-16 px-4 bg-stone-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-charcoal">What You Can Do as a Property Owner</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-porcelain p-6 rounded-xl">
              <div className="text-obsidian-500 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-charcoal">List Properties</h3>
              <p className="text-architectural text-sm">Create professional listings with photos, descriptions, and pricing. List unlimited properties.</p>
            </div>
            <div className="bg-porcelain p-6 rounded-xl">
              <div className="text-obsidian-500 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-charcoal">Receive Inquiries</h3>
              <p className="text-architectural text-sm">Get notified when tenants are interested. Respond to inquiries directly through the platform.</p>
            </div>
            <div className="bg-porcelain p-6 rounded-xl">
              <div className="text-obsidian-500 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-charcoal">Manage Tenants</h3>
              <p className="text-architectural text-sm">Track all your tenants, leases, and communications from one dashboard.</p>
            </div>
            <div className="bg-porcelain p-6 rounded-xl">
              <div className="text-obsidian-500 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-charcoal">View Analytics</h3>
              <p className="text-architectural text-sm">Track property performance, views, inquiries, and rental income with detailed analytics.</p>
            </div>
            <div className="bg-porcelain p-6 rounded-xl">
              <div className="text-obsidian-500 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-charcoal">Collect Rent</h3>
              <p className="text-architectural text-sm">Accept rent payments online securely (coming soon). Track all payments and generate reports.</p>
            </div>
            <div className="bg-porcelain p-6 rounded-xl">
              <div className="text-obsidian-500 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-charcoal">Handle Maintenance</h3>
              <p className="text-architectural text-sm">Receive and manage maintenance requests from tenants (coming soon).</p>
            </div>
          </div>
        </div>
      </section>

      <BenefitSection
        title="Why Property Owners Choose PropManage"
        benefits={benefits}
        imageUrl="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
        reverse={true}
      />

      <section className="py-16 px-4 bg-porcelain">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-charcoal">
            Powerful Tools for Property Owners
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
            How It Works for Owners
          </h2>
          <div className="space-y-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-obsidian-500 text-white rounded-full flex items-center justify-center font-bold text-xl mr-6">
                1
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Register as Owner</h3>
                <p className="text-architectural">Create your owner account in minutes. Verify your identity and you're ready to go.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-obsidian-500 text-white rounded-full flex items-center justify-center font-bold text-xl mr-6">
                2
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">List Your Property</h3>
                <p className="text-architectural">Add property details, upload photos, set pricing, and publish your listing instantly.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-obsidian-500 text-white rounded-full flex items-center justify-center font-bold text-xl mr-6">
                3
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Connect with Tenants</h3>
                <p className="text-architectural">Receive inquiries, schedule viewings, and communicate directly with potential tenants.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-obsidian-500 text-white rounded-full flex items-center justify-center font-bold text-xl mr-6">
                4
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Manage Everything</h3>
                <p className="text-architectural">Track rent payments, manage tenants, handle maintenance requests, and view analytics all from your dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* No Commission Fees - Enhanced */}
      <section className="py-16 px-4 bg-porcelain">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 text-charcoal">No Commission Fees - Keep 100% of Your Income</h2>
            <p className="text-xl text-architectural mb-8 max-w-3xl mx-auto">
              Unlike traditional property management services and rental platforms, we don't charge commission fees. 
              List unlimited properties and keep 100% of your rental income.
            </p>
          </div>
          
          {/* Comparison Table */}
          <div className="bg-stone-100 rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-semibold mb-6 text-charcoal text-center">Compare with Traditional Platforms</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="p-4 text-left text-charcoal font-semibold">Feature</th>
                    <th className="p-4 text-center text-eucalyptus-500 font-semibold">PropManage</th>
                    <th className="p-4 text-center text-architectural font-semibold">Traditional Platforms</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Commission Fee</td>
                    <td className="p-4 text-center text-eucalyptus-500 font-semibold">0%</td>
                    <td className="p-4 text-center text-architectural">5-10%</td>
                  </tr>
                  <tr className="border-b bg-porcelain">
                    <td className="p-4 font-medium">Listing Fee</td>
                    <td className="p-4 text-center text-eucalyptus-500 font-semibold">Free</td>
                    <td className="p-4 text-center text-architectural">$50-$200 per listing</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Number of Listings</td>
                    <td className="p-4 text-center text-eucalyptus-500 font-semibold">Unlimited</td>
                    <td className="p-4 text-center text-architectural">Limited or extra fees</td>
                  </tr>
                  <tr className="border-b bg-porcelain">
                    <td className="p-4 font-medium">Tenant Management</td>
                    <td className="p-4 text-center text-eucalyptus-500 font-semibold">✓ Included</td>
                    <td className="p-4 text-center text-architectural">Extra cost</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Analytics & Reports</td>
                    <td className="p-4 text-center text-eucalyptus-500 font-semibold">✓ Included</td>
                    <td className="p-4 text-center text-architectural">Premium feature</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-stone-100 p-6 rounded-xl shadow-md">
              <h3 className="font-semibold text-lg mb-2 text-charcoal">Free Listing</h3>
              <p className="text-architectural">List as many properties as you want, completely free. No per-listing charges.</p>
            </div>
            <div className="bg-stone-100 p-6 rounded-xl shadow-md">
              <h3 className="font-semibold text-lg mb-2 text-charcoal">No Hidden Fees</h3>
              <p className="text-architectural">Transparent pricing with no surprise charges. What you see is what you get.</p>
            </div>
            <div className="bg-stone-100 p-6 rounded-xl shadow-md">
              <h3 className="font-semibold text-lg mb-2 text-charcoal">Keep 100%</h3>
              <p className="text-architectural">You keep all your rental income. We don't take a cut, ever.</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-architectural mb-4">Ready to start listing? Create your free owner account now!</p>
            <Link
              to="/register"
              className="inline-block px-8 py-4 bg-obsidian-500 text-white rounded-xl font-semibold text-lg hover:bg-obsidian-600 transition-colors"
            >
              Create Owner Account
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        title="Start Managing Your Properties Today"
        description="Join property owners who are simplifying their rental business with PropManage."
        primaryText="Create Owner Account"
        primaryLink="/register"
        secondaryText="View Features"
        secondaryLink="/features"
      />
    </div>
  );
}

export default ForOwners;

