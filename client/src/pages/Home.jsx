import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';

const Home = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 space-y-20">
      
      {/* Hero Section */}
      <div className="grid lg:grid-cols-2 gap-12 items-center px-6 lg:px-20">
        
        {/* Left: Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 max-w-fit shadow-xl">
            <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-emerald-200">Live Matching</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            Exchange Skills. <br />
            <span className="block text-6xl">Grow Together.</span>
          </h1>
          
          <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
            Master new skills through peer-to-peer knowledge exchange. 
            No payments, just pure learning in a trusted community.
          </p>
          
          <div className="flex gap-4">
            <Link to="/register">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="ios-button bg-gradient-to-r from-[#667eea] to-[#764ba2] border-none shadow-2xl text-white font-bold px-8 py-4"
              >
                <Zap size={20} className="opacity-90" /> Get Started
              </motion.button>
            </Link>
            <Link to="/explore">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="ios-button text-white/90 px-8 py-4"
              >
                <Users size={20} className="opacity-90" /> Explore
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Right: Demo Swap */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="ios-card h-[480px] flex flex-col justify-between p-8">
            
            {/* Swap Preview */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400/90 to-cyan-400/90 rounded-2xl flex items-center justify-center shadow-2xl border border-white/20">
                  <span className="font-bold text-sm">S</span>
                </div>
                <div>
                  <h3 className="font-bold text-xl">Sarah</h3>
                  <p className="text-sm text-gray-400">Sarah teaches Python</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center my-8">
                <div className="w-24 h-1 bg-gradient-to-r from-gray-500 to-gray-700 rounded-full shadow-inner" />
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400/90 to-pink-400/90 rounded-2xl flex items-center justify-center shadow-2xl border border-white/20">
                  <span className="font-bold text-sm">T</span>
                </div>
                <div>
                  <h3 className="font-bold text-xl">You</h3>
                  <p className="text-sm text-gray-400">You teach React</p>
                </div>
              </div>
            </div>
            
            {/* Status */}
            <div className="pt-6 border-t border-white/10 flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-lg" />
              <span className="font-semibold text-emerald-400 text-sm">Active Match</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Features */}
      <div className="px-6 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <GlassCard className="text-center !p-10">
              <Zap className="w-20 h-20 text-yellow-400 mx-auto mb-6 opacity-80 shadow-2xl" />
              <h3 className="text-2xl font-bold mb-4 text-white">Instant Matching</h3>
              <p className="text-gray-300 leading-relaxed">
                AI-powered algorithm finds perfect skill partners instantly based on your needs and expertise.
              </p>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <GlassCard className="text-center !p-10">
              <Shield className="w-20 h-20 text-emerald-400 mx-auto mb-6 opacity-80 shadow-2xl" />
              <h3 className="text-2xl font-bold mb-4 text-white">Verified Community</h3>
              <p className="text-gray-300 leading-relaxed">
                Trusted platform with peer reviews, admin moderation, and verified skill exchanges.
              </p>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <GlassCard className="text-center !p-10">
              <Users className="w-20 h-20 text-blue-400 mx-auto mb-6 opacity-80 shadow-2xl" />
              <h3 className="text-2xl font-bold mb-4 text-white">Global Network</h3>
              <p className="text-gray-300 leading-relaxed">
                Join 10,000+ developers, designers, and creators sharing knowledge worldwide.
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
