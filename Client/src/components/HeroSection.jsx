import { Link } from 'react-router-dom';
import Button from './ui/Button';

function HeroSection({ title, subtitle, primaryCTA, secondaryCTA, primaryLink, secondaryLink }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[var(--color-bg-primary)] via-[var(--color-bg-primary)] to-[var(--color-bg-secondary)] text-obsidian py-28 px-4">

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight text-obsidian animate-fade-in">
          {title}
        </h1>
        <p className="text-lg md:text-xl mb-12 text-[var(--color-text-secondary)] max-w-4xl mx-auto leading-relaxed animate-slide-up">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
          {primaryCTA && primaryLink && (
            <Link to={primaryLink}>
              <Button
                variant="primary"
                size="lg"
                className="shadow-xl hover:shadow-2xl font-semibold bg-obsidian-500 text-white border border-obsidian-500 hover:bg-obsidian-600"
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
                className="bg-[var(--color-surface)] border-2 border-brass-500 text-brass-700 hover:bg-brass-50"
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

