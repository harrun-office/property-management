import { Link } from 'react-router-dom';
import Button from './ui/Button';

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
    <section className="relative overflow-hidden bg-gradient-to-b from-[var(--ui-bg-page)] via-[var(--ui-bg-page)] to-[var(--ui-bg-muted)] py-28 px-4">

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight animate-fade-in">
          {title}
        </h1>
        <p className="text-lg md:text-xl mb-12 text-[var(--ui-text-secondary)] max-w-4xl mx-auto leading-relaxed animate-slide-up">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
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

