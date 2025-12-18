import { Link } from 'react-router-dom';

function CTASection({ title, description, primaryText, primaryLink, secondaryText, secondaryLink }) {
  return (
    <section className="bg-obsidian-500 text-porcelain py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">{title}</h2>
        <p className="text-xl text-stone-100 mb-8">{description}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primaryText && primaryLink && (
            <Link
              to={primaryLink}
              className="px-8 py-4 bg-brass-500 text-white rounded-xl font-semibold text-lg hover:bg-brass-600 transition-colors shadow-lg"
            >
              {primaryText}
            </Link>
          )}
          {secondaryText && secondaryLink && (
            <Link
              to={secondaryLink}
              className="px-8 py-4 bg-transparent border-2 border-porcelain text-porcelain rounded-xl font-semibold text-lg hover:bg-porcelain hover:text-obsidian-500 transition-colors"
            >
              {secondaryText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export default CTASection;

