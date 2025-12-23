function BenefitSection({ title, benefits, imageUrl, reverse = false }) {
  return (
    <section className={`py-20 px-4 ${reverse ? 'bg-porcelain' : 'bg-stone-50'}`}>
      <div className={`max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center ${reverse ? 'md:grid-flow-dense' : ''}`}>
        <div className={reverse ? 'md:col-start-2' : ''}>
          <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-8 leading-tight">{title}</h2>
          <ul className="space-y-5">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start group">
                <div className="flex-shrink-0 w-8 h-8 bg-eucalyptus-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-eucalyptus-200 transition-colors">
                  <svg className="w-5 h-5 text-eucalyptus-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-lg text-charcoal leading-relaxed pt-1">{benefit}</span>
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

