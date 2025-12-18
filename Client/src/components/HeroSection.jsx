import { Link } from 'react-router-dom';

function HeroSection({ title, subtitle, primaryCTA, secondaryCTA, primaryLink, secondaryLink }) {
  return (
    <section className="bg-obsidian-500 text-porcelain py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          {title}
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-stone-100 max-w-3xl mx-auto">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primaryCTA && primaryLink && (
            <Link
              to={primaryLink}
              className="px-8 py-4 bg-brass-500 text-white rounded-xl font-semibold text-lg hover:bg-brass-600 transition-colors shadow-lg"
            >
              {primaryCTA}
            </Link>
          )}
          {secondaryCTA && secondaryLink && (
            <Link
              to={secondaryLink}
              className="px-8 py-4 bg-transparent border-2 border-porcelain text-porcelain rounded-xl font-semibold text-lg hover:bg-porcelain hover:text-obsidian-500 transition-colors"
            >
              {secondaryCTA}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

