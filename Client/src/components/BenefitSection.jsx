/**
 * TODO: DESIGN SYSTEM VIOLATIONS - Replace primitive tokens with semantic tokens:
 * - Line 3: bg-porcelain, bg-stone-50
 *   Should use: bg-[var(--ui-bg-surface)], bg-[var(--ui-bg-muted)]
 * - Line 6: text-charcoal
 *   Should use: text-[var(--ui-text-primary)]
 * - Line 10: bg-eucalyptus-100, hover:bg-eucalyptus-200
 *   Should use: bg-[var(--ui-bg-muted)] with success styling (may need --ui-success-bg token)
 * - Line 11: text-eucalyptus-600
 *   Should use: text-[var(--ui-success)]
 * - Line 15: text-charcoal
 *   Should use: text-[var(--ui-text-primary)]
 */

function BenefitSection({ title, benefits, imageUrl, reverse = false }) {
  return (
    <section className={`py-20 px-4 ${reverse ? 'bg-porcelain' : 'bg-stone-50'}`}>
      <div className={`max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center ${reverse ? 'md:grid-flow-dense' : ''}`}>
        <div className={reverse ? 'md:col-start-2' : ''}>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">{title}</h2>
          <ul className="space-y-5">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start group">
                <div className="flex-shrink-0 w-8 h-8 bg-eucalyptus-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-eucalyptus-200 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-lg leading-relaxed pt-1">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
        {imageUrl && (
          <div className={reverse ? 'md:col-start-1 md:row-start-1' : ''}>
            <div className="rounded-2xl shadow-xl overflow-hidden">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default BenefitSection;

