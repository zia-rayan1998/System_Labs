import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center p-6">
        <h1 className="mb-6 text-4xl font-bold">Welcome to SystemDesign</h1>
        <p className="mb-8 text-lg text-muted-foreground">Choose how you'd like to sign in:</p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/auth?role=admin')}
            className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium"
          >
            Admin
          </button>

          <button
            onClick={() => navigate('/auth?role=user')}
            className="px-6 py-3 rounded-md bg-card border border-border/50 text-foreground font-medium"
          >
            User
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
