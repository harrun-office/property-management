import { Link } from 'react-router-dom';
import Button from './ui/Button';
import { CurrencyDollarIcon, ShieldCheckIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

/**
 * TODO: DESIGN SYSTEM VIOLATIONS - Replace primitive tokens with semantic tokens:
 * - Line 6: text-obsidian
 *   Should use: text-[var(--ui-text-primary)]
 * - Line 9: text-obsidian
 *   Should use: text-[var(--ui-text-primary)]
 * - Line 21: bg-obsidian-700, text-white, border-obsidian-700, hover:bg-obsidian-800
 *   Should use: bg-[var(--ui-action-primary-hover)], text-[var(--ui-text-inverse)], border-[var(--ui-action-primary-hover)]
 * - Line 32: border-obsidian-500, text-obsidian-600, hover:bg-obsidian-50
 *   Should use: border-[var(--ui-action-primary)], text-[var(--ui-link)], hover:bg-[var(--ui-bg-muted)]
 */

function HeroSection({ title, subtitle, primaryCTA, secondaryCTA, primaryLink, secondaryLink }) {
  return (
    <section className="relative overflow-hidden py-32 px-4">
      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Advanced Title with Multiple Effects */}
        <div className="relative mb-8">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight animate-fade-in-up relative">
            {/* Main gradient text */}
            <span className="bg-gradient-to-r from-[var(--ui-text-primary)] via-[var(--brand-accent)] to-[var(--ui-text-primary)] bg-clip-text text-transparent relative z-10">
              {title.split(' ').slice(0, 2).join(' ')}
            </span>
            <br />
            <span className="bg-gradient-to-r from-[var(--brand-accent)] via-[var(--brand-secondary)] to-[var(--brand-accent)] bg-clip-text text-transparent relative z-10">
              {title.split(' ').slice(2).join(' ')}
            </span>

            {/* Subtle glow effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-[var(--glow-primary)] via-[var(--glow-secondary)] to-[var(--glow-primary)] bg-clip-text text-transparent opacity-30 blur-sm scale-105 animate-pulse" style={{animationDuration: '3s'}}>
              {title}
            </span>

            {/* Floating particles effect */}
            <div className="absolute -top-4 -left-4 w-2 h-2 bg-[var(--brand-accent)] rounded-full animate-bounce opacity-60" style={{animationDuration: '2s'}}></div>
            <div className="absolute -top-2 -right-6 w-1.5 h-1.5 bg-[var(--brand-secondary)] rounded-full animate-bounce opacity-40" style={{animationDuration: '2.5s', animationDelay: '0.5s'}}></div>
            <div className="absolute -bottom-3 left-1/4 w-1 h-1 bg-[var(--brand-tertiary)] rounded-full animate-bounce opacity-50" style={{animationDuration: '3s', animationDelay: '1s'}}></div>
          </h1>
        </div>
        <div className="text-lg md:text-xl mb-12 text-[var(--ui-text-secondary)] max-w-4xl mx-auto leading-relaxed animate-slide-up space-y-3" style={{animationDelay: '0.3s'}}>
          <div className="flex items-start gap-3 justify-center">
            <CurrencyDollarIcon className="w-6 h-6 text-[var(--brand-accent)] flex-shrink-0 mt-0.5" />
            <span className="text-left">Automated rent collection, tenant screening, and maintenance tracking.</span>
          </div>
          <div className="flex items-start gap-3 justify-center">
            <ShieldCheckIcon className="w-6 h-6 text-[var(--brand-accent)] flex-shrink-0 mt-0.5" />
            <span className="text-left">Save 30% on management costs while keeping 100% of rental income.</span>
          </div>
          <div className="flex items-start gap-3 justify-center">
            <WrenchScrewdriverIcon className="w-6 h-6 text-[var(--brand-accent)] flex-shrink-0 mt-0.5" />
            <span className="text-left">Professional property management without the headaches.</span>
          </div>
        </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{animationDelay: '0.5s'}}>
          {primaryCTA && primaryLink && (
            <Link to={primaryLink}>
              <Button
                variant="primary"
                size="lg"
                className="shadow-xl hover:shadow-2xl font-semibold"
              >
                {primaryCTA}
              </Button>
            </Link>
          )}
          {secondaryCTA && secondaryLink && (
            <Link to={secondaryLink}>
              <Button
                variant="outline"
                size="lg"
                className="font-semibold"
              >
                {secondaryCTA}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

