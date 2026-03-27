interface IFeatureCard {
  icon: React.ElementType;
  name: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, name, description }: IFeatureCard) => {
  return (
    <div className="bg-white max-w-xs rounded-3xl shadow-lg p-5 group cursor-default hover:via-violet-50 hover:bg-linear-to-br from-fuchsia-600/20 via-transparent">
      <Icon className="h-10 w-14 mb-4 text-neutral-500" />
      <h5 className="text-xl font-medium mb-2 text-neutral-900">{name}</h5>
      <p className="text-neutral-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
