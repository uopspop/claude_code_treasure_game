import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useAuth } from '../../contexts/AuthContext';

interface SignUpFormProps {
  onSuccess: () => void;
  onSwitchToSignIn: () => void;
}

// Sign up form component with validation and user feedback
export function SignUpForm({ onSuccess, onSwitchToSignIn }: SignUpFormProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signUp } = useAuth();

  // Handles form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  // Handles sign up form submission with validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const result = await signUp({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || 'Sign up failed');
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
        <h2 className="text-2xl font-bold text-amber-900">Create Account</h2>
        <p className="text-amber-700 mt-2">Join the treasure hunt adventure!</p>
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
          <Label htmlFor="email" className="text-amber-800">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
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

        <div>
          <Label htmlFor="confirmPassword" className="text-amber-800">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
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
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </form>

      <div className="text-center">
        <span className="text-amber-700">Already have an account? </span>
        <button
          onClick={onSwitchToSignIn}
          className="text-amber-600 hover:text-amber-800 font-medium underline"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}