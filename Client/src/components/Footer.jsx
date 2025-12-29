import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--ui-bg-surface)] border-t border-[var(--ui-border-default)] mt-auto">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 text-xl font-bold text-[var(--ui-text-primary)] hover:text-[var(--brand-accent)] transition-colors group mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-[var(--brand-accent)] to-[var(--brand-accent-dark)] rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-medium transition-all duration-300 group-hover:scale-105">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span>PropManage</span>
            </Link>
            <p className="text-[var(--ui-text-secondary)] mb-6 text-sm leading-relaxed max-w-xs">
              Streamlining property management with intelligent automation, trusted by 500+ professionals worldwide.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-9 h-9 flex items-center justify-center text-[var(--ui-text-secondary)] hover:text-[var(--brand-accent)] hover:bg-[var(--ui-bg-muted)] rounded-lg transition-all duration-200 hover:scale-105" aria-label="LinkedIn">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center text-[var(--ui-text-secondary)] hover:text-[var(--brand-accent)] hover:bg-[var(--ui-bg-muted)] rounded-lg transition-all duration-200 hover:scale-105" aria-label="Twitter">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--ui-text-primary)] uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/features" className="text-[var(--ui-text-secondary)] hover:text-[var(--brand-accent)] transition-colors text-sm">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-[var(--ui-text-secondary)] hover:text-[var(--brand-accent)] transition-colors text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-[var(--ui-text-secondary)] hover:text-[var(--brand-accent)] transition-colors text-sm">
                  How It Works
                </Link>
              </li>
              <li>
                <a href="#" className="text-[var(--ui-text-secondary)] hover:text-[var(--brand-accent)] transition-colors text-sm">
                  API
                </a>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--ui-text-primary)] uppercase tracking-wider mb-4">Solutions</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/for-owners" className="text-[var(--ui-text-secondary)] hover:text-[var(--brand-accent)] transition-colors text-sm">
                  For Property Owners
                </Link>
              </li>
              <li>
                <Link to="/for-managers" className="text-[var(--ui-text-secondary)] hover:text-[var(--brand-accent)] transition-colors text-sm">
                  For Property Managers
                </Link>
              </li>
              <li>
                <Link to="/for-tenants" className="text-[var(--ui-text-secondary)] hover:text-[var(--brand-accent)] transition-colors text-sm">
                  For Tenants
                </Link>
              </li>
              <li>
                <a href="#" className="text-[var(--ui-text-secondary)] hover:text-[var(--brand-accent)] transition-colors text-sm">
                  Enterprise
                </a>
              </li>
            </ul>
          </div>

          {/* Support & Company */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--ui-text-primary)] uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-3 mb-6">
              <li>
                <a href="#" className="text-[var(--ui-text-secondary)] hover:text-[var(--brand-accent)] transition-colors text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-[var(--ui-text-secondary)] hover:text-[var(--brand-accent)] transition-colors text-sm">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="#" className="text-[var(--ui-text-secondary)] hover:text-[var(--brand-accent)] transition-colors text-sm">
                  Status Page
                </a>
              </li>
            </ul>

            <h3 className="text-sm font-semibold text-[var(--ui-text-primary)] uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-[var(--ui-text-secondary)] hover:text-[var(--brand-accent)] transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <a href="#" className="text-[var(--ui-text-secondary)] hover:text-[var(--brand-accent)] transition-colors text-sm">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-[var(--ui-text-secondary)] hover:text-[var(--brand-accent)] transition-colors text-sm">
                  Careers
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--ui-border-default)] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[var(--ui-text-secondary)] text-sm">
              © {currentYear} PropManage. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <a href="#" className="text-[var(--ui-text-secondary)] hover:text-[var(--brand-accent)] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-[var(--ui-text-secondary)] hover:text-[var(--brand-accent)] transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-[var(--ui-text-secondary)] hover:text-[var(--brand-accent)] transition-colors">
                Cookie Policy
              </a>
              <div className="flex items-center gap-2 text-[var(--ui-text-secondary)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-xs">SOC 2 Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

