import Card from './ui/Card';

function FeatureCard({ icon, title, description }) {
  return (
    <Card variant="elevated" padding="lg" hover className="h-full">
      <div className="text-obsidian-500 mb-4 transform group-hover:scale-110 transition-transform duration-200">
        {icon}
      </div>
      <Card.Title className="mb-3">{title}</Card.Title>
      <Card.Description className="leading-relaxed">{description}</Card.Description>
    </Card>
  );
}

export default FeatureCard;

