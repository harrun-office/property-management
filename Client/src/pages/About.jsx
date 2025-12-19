import { Link } from 'react-router-dom';

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
    <div className="min-h-screen bg-porcelain">
      <section className="bg-obsidian text-porcelain py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-porcelain">About PropManage</h1>
          <p className="text-xl md:text-2xl text-stone-200 max-w-3xl mx-auto">
            Simplifying property management for everyone
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-stone-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-charcoal">What is PropManage?</h2>
          <p className="text-lg text-charcoal leading-relaxed mb-6">
            PropManage is a comprehensive property management platform designed to connect tenants and property owners 
            in one easy-to-use system. We provide all the tools needed for property search, listing management, tenant 
            communication, and rental operations—all in one secure platform.
          </p>
          
          <h2 className="text-4xl font-bold mb-6 text-charcoal mt-12">Our Mission</h2>
          <p className="text-lg text-charcoal leading-relaxed mb-6">
            At PropManage, we believe that finding a home or managing rental properties shouldn't be complicated. 
            Our mission is to create a seamless, user-friendly platform that connects tenants with property owners 
            and simplifies every aspect of the rental process.
          </p>
          <p className="text-lg text-charcoal leading-relaxed mb-6">
            We're building a comprehensive property management solution that eliminates the friction in traditional 
            rental processes. Whether you're a tenant searching for your next home or a property owner looking 
            to streamline your rental business, PropManage provides the tools you need to succeed.
          </p>
          <p className="text-lg text-charcoal leading-relaxed">
            Our platform is designed to be transparent, secure, and accessible to everyone. We're committed to 
            continuous innovation, always working on new features that make property management easier and more 
            efficient for our users.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-porcelain">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-charcoal">Who We Serve</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-stone-100 p-6 rounded-xl shadow-md border border-stone-200">
              <h3 className="text-xl font-semibold mb-3 text-charcoal">Tenants</h3>
              <p className="text-architectural">People looking for rental properties. Free to browse, free to register, and free to use all tenant features.</p>
            </div>
            <div className="bg-stone-100 p-6 rounded-xl shadow-md border border-stone-200">
              <h3 className="text-xl font-semibold mb-3 text-charcoal">Property Owners</h3>
              <p className="text-architectural">Individuals and businesses managing rental properties. List unlimited properties with zero commission fees.</p>
            </div>
            <div className="bg-stone-100 p-6 rounded-xl shadow-md border border-stone-200">
              <h3 className="text-xl font-semibold mb-3 text-charcoal">Property Managers</h3>
              <p className="text-architectural">Professional property management companies managing multiple properties, vendors, and maintenance tasks.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-porcelain">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-charcoal">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-stone-100 rounded-2xl shadow-md p-8 border border-stone-200">
                <div className="text-obsidian mb-4">{value.icon}</div>
                <h3 className="text-2xl font-semibold mb-3 text-charcoal">{value.title}</h3>
                <p className="text-architectural leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-stone-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-charcoal">Why We Built This</h2>
          <p className="text-lg text-charcoal leading-relaxed mb-6">
            The rental market has been fragmented and inefficient for too long. Tenants struggle to find suitable 
            properties, while property owners face challenges in managing listings, communicating with tenants, and 
            collecting rent. We saw an opportunity to create a unified platform that addresses these pain points.
          </p>
          <p className="text-lg text-charcoal leading-relaxed mb-6">
            PropManage was born from the frustration of dealing with outdated property management systems and 
            inefficient rental processes. We wanted to build something modern, intuitive, and powerful—a platform 
            that works for everyone, regardless of technical expertise.
          </p>
          <p className="text-lg text-charcoal leading-relaxed">
            Today, we're proud to serve thousands of users who trust PropManage for their property management needs. 
            But we're just getting started. We're constantly working on new features and improvements to make the 
            platform even better.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-stone-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-charcoal">Contact Information</h2>
          <div className="bg-porcelain p-8 rounded-xl border border-stone-200">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-charcoal mb-2">Support</h3>
                <p className="text-architectural">Email: support@propmanage.com</p>
                <p className="text-architectural">Available 24/7</p>
              </div>
              <div>
                <h3 className="font-semibold text-charcoal mb-2">General Inquiries</h3>
                <p className="text-architectural">Email: info@propmanage.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-obsidian text-porcelain">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-porcelain">Join Us on This Journey</h2>
          <p className="text-xl text-stone-200 mb-8">
            Whether you're a tenant or property owner, we'd love to have you as part of the PropManage community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-brass text-porcelain rounded-xl font-semibold text-lg hover:bg-brass-light transition-colors shadow-lg"
            >
              Get Started
            </Link>
            <Link
              to="/how-it-works"
              className="px-8 py-4 bg-transparent border-2 border-porcelain text-porcelain rounded-xl font-semibold text-lg hover:bg-porcelain hover:text-obsidian transition-colors"
            >
              Learn How It Works
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;

