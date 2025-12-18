function BenefitSection({ title, benefits, imageUrl, reverse = false }) {
  return (
    <section className={`py-16 px-4 ${reverse ? 'bg-porcelain' : 'bg-stone-100'}`}>
      <div className={`max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center ${reverse ? 'md:grid-flow-dense' : ''}`}>
        <div className={reverse ? 'md:col-start-2' : ''}>
          <h2 className="text-4xl font-bold text-charcoal mb-6">{title}</h2>
          <ul className="space-y-4">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <svg className="w-6 h-6 text-eucalyptus-500 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-lg text-charcoal">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
        {imageUrl && (
          <div className={reverse ? 'md:col-start-1 md:row-start-1' : ''}>
            <img
              src={imageUrl}
              alt={title}
              className="rounded-2xl shadow-lg w-full h-auto"
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default BenefitSection;

