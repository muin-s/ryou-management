import { Button } from '@/components/ui/button';
import { Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="flex justify-center mb-6">
          <Building2 className="h-24 w-24 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-foreground">
          Hostel Issue Management System
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A streamlined platform for students to report hostel issues, track their resolution,
          and stay updated with important notices.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button size="lg" onClick={() => navigate('/login')} className="text-lg px-8">
            Login
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/signup')} className="text-lg px-8">
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
