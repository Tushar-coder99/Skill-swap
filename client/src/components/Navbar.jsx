import { Link, useNavigate } from 'react-router-dom';
import { Layers, Compass, Shield, LogIn, LogOut } from 'lucide-react';
import { logout } from '../api';

const Navbar = () => {
  const navigate = useNavigate();

  // Read directly from localStorage every render
  let user = null;
  try {
    const stored = localStorage.getItem('user');
    if (stored) {
      user = JSON.parse(stored);
    }
  } catch (e) {
    console.error('Navbar localStorage error:', e);
    localStorage.removeItem('user');
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-4 z-50 mx-4">
      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-6 py-4 flex justify-between items-center shadow-lg">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          <Layers className="text-purple-400" size={28} /> SkillSwap
        </Link>
        
        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-purple-300 transition-colors hidden md:block">Home</Link>
          
          {user ? (
            <>
              <Link to="/explore" className="hover:text-purple-300 transition-colors flex items-center gap-1">
                <Compass size={18} /> Explore
              </Link>
              <Link to="/dashboard" className="hover:text-purple-300 transition-colors">Dashboard</Link>
              
              {/* ADMIN BUTTON - ONLY FOR ADMINS */}
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:text-yellow-300 transition-colors flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/40 shadow-md">
                  <Shield size={18} className="text-yellow-400" /> Admin
                </Link>
              )}
            </>
          ) : (
            <Link to="/" className="hover:text-purple-300 transition-colors hidden md:block"></Link>
          )}
          
          {/* Auth Buttons */}
          {user ? (
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 px-4 py-2 rounded-full transition-all border border-red-500/20 hover:border-red-400 shadow-md font-medium"
            >
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <div className="flex gap-3">
              <Link to="/login">
                <button className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all text-sm">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-purple-500/30 transition-all">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
