
interface User {
  name: string;
  email: string;
}

interface WelcomeSectionProps {
  user: User;
}

export const WelcomeSection = ({ user }: WelcomeSectionProps) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <div className="text-center space-y-4">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
        {getGreeting()}, {user.name}! 👋
      </h2>
      <p className="text-gray-600 dark:text-gray-300 text-lg">
        Como está sua produtividade hoje?
      </p>
    </div>
  );
};
