function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-stone-100 rounded-2xl shadow-md p-8 hover:shadow-xl transition-shadow border border-stone-200">
      <div className="text-obsidian-500 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-charcoal mb-3">{title}</h3>
      <p className="text-architectural leading-relaxed">{description}</p>
    </div>
  );
}

export default FeatureCard;

