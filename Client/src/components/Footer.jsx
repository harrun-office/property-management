import { Link } from 'react-router-dom';

/**
 * TODO: DESIGN SYSTEM VIOLATIONS - Replace primitive tokens with semantic tokens:
 * This component has extensive violations. All primitive tokens (stone-*, obsidian, brass-*, charcoal, architectural, eucalyptus-*)
 * must be replaced with semantic --ui-* tokens. Key violations:
 * - bg-stone-200, border-stone-300, hover:bg-stone-300
 * - text-charcoal, text-obsidian, text-brass-500
 * - bg-brass-400, bg-brass-500, bg-brass-600
 * - text-architectural
 * - bg-gradient-to-br from-brass-400 to-brass-600 (gradients may need special handling)
 * 
 * Footer requires explicit background color (--ui-bg-surface or --ui-bg-muted)
 */

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-200 text-charcoal mt-auto w-full border-t border-stone-300">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="text-2xl font-bold text-obsidian hover:text-brass-500 transition-colors mb-4 inline-block flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-brass-400 to-brass-600 rounded-lg flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span>PropManage</span>
            </Link>
            <p className="text-charcoal mb-6 text-sm leading-relaxed">
              Your complete property management solution. Connect tenants with property owners in one secure platform.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-charcoal/80 hover:text-brass-500 transition-colors p-2 hover:bg-stone-300 rounded-lg" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-charcoal/80 hover:text-brass-500 transition-colors p-2 hover:bg-stone-300 rounded-lg" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-charcoal/80 hover:text-brass-500 transition-colors p-2 hover:bg-stone-300 rounded-lg" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-obsidian">Quick Links</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-charcoal hover:text-brass-500 transition-colors text-sm flex items-center group">
                  <span className="w-1.5 h-1.5 bg-brass-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-charcoal hover:text-brass-500 transition-colors text-sm flex items-center group">
                  <span className="w-1.5 h-1.5 bg-brass-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link to="/for-tenants" className="text-charcoal hover:text-brass-500 transition-colors text-sm flex items-center group">
                  <span className="w-1.5 h-1.5 bg-brass-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  For Tenants
                </Link>
              </li>
              <li>
                <Link to="/for-owners" className="text-charcoal hover:text-brass-500 transition-colors text-sm flex items-center group">
                  <span className="w-1.5 h-1.5 bg-brass-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  For Owners
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-charcoal hover:text-brass-500 transition-colors text-sm flex items-center group">
                  <span className="w-1.5 h-1.5 bg-brass-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Features
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-charcoal hover:text-brass-500 transition-colors text-sm flex items-center group">
                  <span className="w-1.5 h-1.5 bg-brass-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-obsidian">Resources</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/about" className="text-charcoal hover:text-brass-500 transition-colors text-sm flex items-center group">
                  <span className="w-1.5 h-1.5 bg-brass-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-charcoal hover:text-brass-500 transition-colors text-sm flex items-center group">
                  <span className="w-1.5 h-1.5 bg-brass-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-charcoal hover:text-brass-500 transition-colors text-sm flex items-center group">
                  <span className="w-1.5 h-1.5 bg-brass-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-charcoal hover:text-brass-500 transition-colors text-sm flex items-center group">
                  <span className="w-1.5 h-1.5 bg-brass-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-charcoal hover:text-brass-500 transition-colors text-sm flex items-center group">
                  <span className="w-1.5 h-1.5 bg-brass-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-charcoal hover:text-brass-500 transition-colors text-sm flex items-center group">
                  <span className="w-1.5 h-1.5 bg-brass-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-obsidian">Contact Us</h3>
            <ul className="space-y-3 text-charcoal text-sm">
              <li className="flex items-start group">
                <svg className="w-5 h-5 mr-2 mt-0.5 text-brass-500 flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:support@propmanage.com" className="hover:text-brass-500 transition-colors">
                  support@propmanage.com
                </a>
              </li>
              <li className="flex items-start group">
                <svg className="w-5 h-5 mr-2 mt-0.5 text-brass-500 flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+1234567890" className="hover:text-brass-500 transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-start group">
                <svg className="w-5 h-5 mr-2 mt-0.5 text-brass-500 flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>123 Property Street,<br />City, State 12345</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-stone-300 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-charcoal text-sm mb-4 md:mb-0">
              © {currentYear} PropManage. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-charcoal hover:text-brass-500 transition-colors">
                Privacy
              </a>
              <a href="#" className="text-charcoal hover:text-brass-500 transition-colors">
                Terms
              </a>
              <a href="#" className="text-charcoal hover:text-brass-500 transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

