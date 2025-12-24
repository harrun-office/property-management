import Card from './ui/Card';

/**
 * TODO: DESIGN SYSTEM VIOLATIONS - Replace primitive tokens with semantic tokens:
 * - Line 6: text-obsidian-500
 *   Should use: text-[var(--ui-action-primary)]
 */

function FeatureCard({ icon, title, description }) {
  return (
    <Card variant="elevated" padding="lg" hover className="h-full">
      <div className="mb-4 transform group-hover:scale-110 transition-transform duration-200">
        {icon}
      </div>
      <Card.Title className="mb-3">{title}</Card.Title>
      <Card.Description className="leading-relaxed">{description}</Card.Description>
    </Card>
  );
}

export default FeatureCard;

