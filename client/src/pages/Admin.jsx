import { useState, useEffect } from 'react';
import { getProfile } from '../api';
import GlassCard from '../components/GlassCard';
import { Loader2, Download, Users, AlertTriangle, Ban } from 'lucide-react';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  useEffect(() => {
    const init = async () => {
      try {
        const profile = await getProfile(token);
        setUser(profile);
        
        if (profile.role === 'admin') {
          // Fetch admin data here later
          setUsers([{name: 'Demo User 1'}, {name: 'Demo User 2'}]); // Mock for now
        }
      } catch (error) {
        console.error('Admin init error:', error);
      } finally {
        setLoading(false);
      }
    };
    if (token) init();
  }, [token]);

  if (!user?.role === 'admin') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <GlassCard className="text-center p-12 max-w-md">
          <Shield className="text-gray-500 mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-bold mb-2">Admin Access Required</h2>
          <p className="text-gray-400 mb-6">Only administrators can access this panel</p>
          <button className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-xl font-semibold">
            Go to Dashboard
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
          Admin Dashboard
        </h1>
        <button className="bg-green-500/90 hover:bg-green-500 text-white px-6 py-2 rounded-xl font-semibold shadow-lg transition-all flex items-center gap-2">
          <Download size={18} /> Export CSV
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-purple-400" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users List */}
          <GlassCard>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Users className="text-blue-400" /> All Users ({users.length})
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {users.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold">
                      {user.name.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all">
                      <Ban size={16} />
                    </button>
                    <button className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-all">
                      <AlertTriangle size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Stats */}
          <GlassCard>
            <h3 className="text-xl font-bold mb-6">Platform Stats</h3>
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-1">{users.length}</div>
                <div className="text-sm text-gray-400">Total Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400 mb-1">0</div>
                <div className="text-sm text-gray-400">Banned Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-400 mb-1">12</div>
                <div className="text-sm text-gray-400">Active Swaps</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-1">4.7</div>
                <div className="text-sm text-gray-400">Avg Rating</div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Admin;
