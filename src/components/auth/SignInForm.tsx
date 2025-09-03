import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useAuth } from '../../contexts/AuthContext';

interface SignInFormProps {
  onSuccess: () => void;
  onSwitchToSignUp: () => void;
}

// Sign in form component for user authentication
export function SignInForm({ onSuccess, onSwitchToSignUp }: SignInFormProps) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useAuth();

  // Handles form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  // Handles sign in form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn({
        username: formData.username,
        password: formData.password
      });

      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || 'Sign in failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-amber-900">Welcome Back</h2>
        <p className="text-amber-700 mt-2">Continue your treasure hunting adventure!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="username" className="text-amber-800">Username</Label>
          <Input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
            required
            className="mt-1 bg-amber-50 border-amber-300 focus:border-amber-500"
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-amber-800">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
            className="mt-1 bg-amber-50 border-amber-300 focus:border-amber-500"
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <div className="text-center">
        <span className="text-amber-700">Don't have an account? </span>
        <button
          onClick={onSwitchToSignUp}
          className="text-amber-600 hover:text-amber-800 font-medium underline"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}