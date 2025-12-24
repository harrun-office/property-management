import { Link } from 'react-router-dom';
import Button from './ui/Button';

/**
 * TODO: DESIGN SYSTEM VIOLATIONS - Replace primitive tokens with semantic tokens:
 * - Line 6: bg-gradient-to-br from-obsidian-600 via-obsidian-500 to-obsidian-700, text-porcelain
 *   Should use: bg-[var(--ui-bg-inverse)] or bg-[var(--ui-action-primary)], text-[var(--ui-text-inverse)]
 *   NOTE: Gradients may need special handling - consider solid color or CSS gradient with semantic tokens
 * - Line 16: text-porcelain
 *   Should use: text-[var(--ui-text-inverse)]
 * - Line 17: text-stone-100
 *   Should use: text-[var(--ui-text-inverse)] with opacity
 * - Line 28: border-porcelain, text-porcelain, hover:bg-porcelain, hover:text-obsidian-600
 *   Should use: border-[var(--ui-text-inverse)], text-[var(--ui-text-inverse)], hover:bg-[var(--ui-text-inverse)], hover:text-[var(--ui-action-primary)]
 */

function CTASection({ title, description, primaryText, primaryLink, secondaryText, secondaryLink }) {
  return (
    <section className="bg-[var(--ui-bg-inverse)] text-[var(--ui-text-inverse)] py-20 px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
        <p className="text-xl mb-10 leading-relaxed">{description}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primaryText && primaryLink && (
            <Link to={primaryLink}>
              <Button variant="accent" size="lg" className="shadow-xl hover:shadow-2xl">
                {primaryText}
              </Button>
            </Link>
          )}
          {secondaryText && secondaryLink && (
            <Link to={secondaryLink}>
              <Button variant="outline" size="lg">
                {secondaryText}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export default CTASection;

