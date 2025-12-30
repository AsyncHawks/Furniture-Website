import { Badge } from '@components';

const BadgeSection = () => {
  const badges = [
    {
      icon: '/icons/Truck.svg',
      title: 'Free Delivery',
      description: 'Lorem ipsum dolor sit amet.',
    },
    {
      icon: '/icons/24.svg',
      title: 'Support 24/7',
      description: 'Lorem ipsum dolor sit amet.',
    },
    {
      icon: '/icons/Shield.svg',
      title: '100% Authentic',
      description: 'Lorem ipsum dolor sit amet.',
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 min-h-37 p-6 max-w-480 mx-auto">
      {badges.map((b, i) => (
        <Badge key={i} icon={b.icon} title={b.title} description={b.description} />
      ))}
    </div>
  );
};

export default BadgeSection;
