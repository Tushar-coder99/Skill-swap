import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login } from '../api';
import GlassCard from '../components/GlassCard';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const data = await login(formData);
      
      // FORCE SAVE to localStorage
      localStorage.setItem('user', JSON.stringify(data));
      
      // Verify it saved correctly
      const savedUser = localStorage.getItem('user');
      console.log('✅ SAVED USER:', JSON.parse(savedUser)); // Debug log
      
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <GlassCard className="w-full max-w-md p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Welcome Back</h2>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
              placeholder="Enter password"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 rounded-lg font-bold shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              'Log In'
            )}
          </motion.button>
        </form>

        <p className="text-center mt-6 text-gray-400 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-pink-400 hover:text-pink-300 font-semibold">
            Sign Up
          </Link>
        </p>
      </GlassCard>
    </div>
  );
};

export default Login;
