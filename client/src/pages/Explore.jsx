import { useState, useEffect } from 'react';
import { getAllUsers, getProfile, sendSwap } from '../api';
import GlassCard from '../components/GlassCard';
import Modal from '../components/Modal';
import { Search, MapPin, ArrowRightLeft, Loader2, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const Explore = () => {
  const [users, setUsers] = useState([]);
  const [myProfile, setMyProfile] = useState(null); // Need my skills to offer
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [skillToLearn, setSkillToLearn] = useState('');
  const [skillToTeach, setSkillToTeach] = useState('');
  const [swapLoading, setSwapLoading] = useState(false);

  const token = JSON.parse(localStorage.getItem('user'))?.token;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, myData] = await Promise.all([
          getAllUsers('', token),
          getProfile(token)
        ]);
        setUsers(usersData);
        setMyProfile(myData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await getAllUsers(searchTerm, token);
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSwap = (user) => {
    if (!myProfile.skillsOffered || myProfile.skillsOffered.length === 0) {
      alert("You need to add 'Skills Offered' to your profile before you can swap!");
      return;
    }
    setSelectedUser(user);
    setSkillToLearn(user.skillsOffered[0] || ''); // Default to first skill
    setSkillToTeach(myProfile.skillsOffered[0] || ''); // Default to first skill
  };

  const handleSubmitSwap = async (e) => {
    e.preventDefault();
    setSwapLoading(true);
    try {
      await sendSwap({
        toUserId: selectedUser._id,
        offeredSkill: skillToTeach,
        requestedSkill: skillToLearn
      }, token);
      alert('Swap Request Sent Successfully!');
      setSelectedUser(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setSwapLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
          Explore Mentors
        </h1>
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search by skill (e.g. React, Piano)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-6 pl-12 focus:outline-none focus:border-purple-500 transition-colors text-white"
          />
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
        </form>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-purple-400" size={48} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <GlassCard key={user._id} hoverEffect={true} className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xl font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{user.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <MapPin size={12} /> {user.location || 'Global'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 flex-grow">
                <div>
                  <p className="text-xs text-purple-300 font-semibold mb-2 uppercase tracking-wider">Offers</p>
                  <div className="flex flex-wrap gap-2">
                    {user.skillsOffered.length > 0 ? (
                      user.skillsOffered.map((skill, i) => (
                        <span key={i} className="bg-purple-500/20 text-purple-200 text-xs px-2 py-1 rounded-md border border-purple-500/20">
                          {skill}
                        </span>
                      ))
                    ) : <span className="text-gray-500 text-xs italic">No skills listed</span>}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-pink-300 font-semibold mb-2 uppercase tracking-wider">Wants</p>
                  <div className="flex flex-wrap gap-2">
                    {user.skillsWanted.length > 0 ? (
                      user.skillsWanted.map((skill, i) => (
                        <span key={i} className="bg-pink-500/20 text-pink-200 text-xs px-2 py-1 rounded-md border border-pink-500/20">
                          {skill}
                        </span>
                      ))
                    ) : <span className="text-gray-500 text-xs italic">No skills requested</span>}
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOpenSwap(user)}
                disabled={user.skillsOffered.length === 0}
                className="mt-6 w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center gap-2 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowRightLeft size={18} /> Request Swap
              </motion.button>
            </GlassCard>
          ))}
          
          {users.length === 0 && (
             <div className="col-span-full text-center text-gray-400 py-20">
                No users found matching "{searchTerm}"
             </div>
          )}
        </div>
      )}

      {/* Swap Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title={`Swap with ${selectedUser?.name}`}
      >
        <form onSubmit={handleSubmitSwap} className="space-y-6">
          <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/20">
            <label className="block text-purple-200 text-sm mb-2 font-semibold">I want to learn:</label>
            <select
              value={skillToLearn}
              onChange={(e) => setSkillToLearn(e.target.value)}
              className="w-full bg-black/30 border border-purple-500/30 rounded-lg p-3 text-white focus:outline-none"
            >
              {selectedUser?.skillsOffered.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-center">
             <ArrowRightLeft className="text-gray-400 rotate-90" />
          </div>

          <div className="bg-pink-500/10 p-4 rounded-xl border border-pink-500/20">
            <label className="block text-pink-200 text-sm mb-2 font-semibold">I will teach:</label>
            <select
              value={skillToTeach}
              onChange={(e) => setSkillToTeach(e.target.value)}
              className="w-full bg-black/30 border border-pink-500/30 rounded-lg p-3 text-white focus:outline-none"
            >
              {myProfile?.skillsOffered.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={swapLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 rounded-lg font-bold shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2"
          >
             {swapLoading ? <Loader2 className="animate-spin"/> : <><Send size={18} /> Send Request</>}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Explore;
