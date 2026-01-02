import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile, getSwaps, updateSwap } from '../api';
import GlassCard from '../components/GlassCard';
import Modal from '../components/Modal';
import { MapPin, Clock, Plus, Trash2, Loader2, Save, Check, X } from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [token, setToken] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser?.token) {
        navigate('/login');
        return;
      }
      setToken(storedUser.token);

      try {
        const [profileData, swapData] = await Promise.all([
          getProfile(storedUser.token),
          getSwaps(storedUser.token),
        ]);
        setUser(profileData);
        setSwaps(swapData);
      } catch (err) {
        setError(err.message);
        if (err.message.includes('authorized')) navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [navigate]);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    try {
      let updatedData = {};
      if (modalType === 'offered') {
        updatedData = { skillsOffered: [...user.skillsOffered, newSkill] };
      } else {
        updatedData = { skillsWanted: [...user.skillsWanted, newSkill] };
      }

      await updateProfile(updatedData, token);
      setUser({ ...user, ...updatedData });
      setNewSkill('');
      setModalOpen(false);
    } catch {
      alert('Failed to add skill');
    }
  };

  const handleRemoveSkill = async (skillToRemove, type) => {
    if (!confirm(`Delete ${skillToRemove}?`)) return;

    try {
      let updatedData = {};
      if (type === 'offered') {
        updatedData = { skillsOffered: user.skillsOffered.filter((s) => s !== skillToRemove) };
      } else {
        updatedData = { skillsWanted: user.skillsWanted.filter((s) => s !== skillToRemove) };
      }

      await updateProfile(updatedData, token);
      setUser({ ...user, ...updatedData });
    } catch {
      alert('Failed to remove skill');
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setNewSkill('');
    setModalOpen(true);
  };

  const handleSwapAction = async (id, status) => {
    try {
      await updateSwap(id, status, token);
      setSwaps((prev) =>
        prev.map((s) => (s._id === id ? { ...s, status } : s))
      );
    } catch {
      alert('Failed to update swap');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center pt-20">
        <Loader2 className="animate-spin text-purple-400" size={48} />
      </div>
    );
  }
  if (error) {
    return <div className="text-center text-red-400 pt-20">Error: {error}</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile */}
        <div className="space-y-8">
          <GlassCard className="text-center">
            <div className="w-32 h-32 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full mx-auto mb-4 border-4 border-white/20 shadow-lg flex items-center justify-center text-4xl font-bold text-white/50">
              {user.name.charAt(0)}
            </div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <div className="flex items-center justify-center gap-2 text-gray-400 mt-2">
              <MapPin size={16} /> {user.location || 'Global'}
            </div>
            <div className="mt-6 flex justify-between items-center bg-white/5 p-3 rounded-xl">
              <span className="text-sm flex items-center gap-2">
                <Clock size={14} /> {user.availability || 'Flexible'}
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    user.isPublic ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span className="text-xs">
                  {user.isPublic ? 'Public' : 'Private'}
                </span>
              </div>
            </div>
          </GlassCard>

          {/* Swap Requests */}
          <GlassCard>
            <h3 className="text-xl font-bold mb-4">Swap Requests</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {swaps.length === 0 && (
                <p className="text-gray-500 text-sm">
                  No swap activity yet. Start exploring users and propose your
                  first swap!
                </p>
              )}
              {swaps.map((swap) => {
                const isIncoming =
                  swap.toUser === user._id || swap.toName === user.name;
                return (
                  <div
                    key={swap._id}
                    className="p-3 rounded-xl bg-white/5 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {isIncoming
                          ? `${swap.fromName} wants to learn ${swap.requestedSkill}`
                          : `You requested ${swap.toName}`}
                      </p>
                      <p className="text-xs text-gray-400">
                        Offering: {swap.offeredSkill} • Status: {swap.status}
                      </p>
                    </div>
                    {swap.status === 'Pending' && isIncoming && (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleSwapAction(swap._id, 'Accepted')
                          }
                          className="p-2 rounded-full bg-green-500/20 text-green-300 hover:bg-green-500/30"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleSwapAction(swap._id, 'Rejected')
                          }
                          className="p-2 rounded-full bg-red-500/20 text-red-300 hover:bg-red-500/30"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                    {swap.status === 'Pending' && !isIncoming && (
                      <button
                        onClick={() =>
                          handleSwapAction(swap._id, 'Cancelled')
                        }
                        className="text-xs text-gray-400 hover:text-red-300"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Skills */}
        <div className="lg:col-span-2 space-y-8">
          {/* Offered */}
          <GlassCard>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-purple-200">
                Skills I Offer
              </h3>
              <button
                onClick={() => openModal('offered')}
                className="p-2 bg-purple-600/50 hover:bg-purple-600 rounded-full transition shadow-lg border border-purple-400/30"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.skillsOffered?.map((skill) => (
                <div
                  key={skill}
                  className="flex justify-between items-center p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl group hover:bg-purple-500/20 transition-all"
                >
                  <span className="font-medium text-purple-100">{skill}</span>
                  <Trash2
                    size={18}
                    onClick={() => handleRemoveSkill(skill, 'offered')}
                    className="text-gray-500 hover:text-red-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
              {(!user.skillsOffered ||
                user.skillsOffered.length === 0) && (
                <p className="text-gray-500 italic col-span-2 text-center py-4">
                  You haven't listed any skills yet.
                </p>
              )}
            </div>
          </GlassCard>

          {/* Wanted */}
          <GlassCard>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-pink-200">
                Skills I Want
              </h3>
              <button
                onClick={() => openModal('wanted')}
                className="p-2 bg-pink-600/50 hover:bg-pink-600 rounded-full transition shadow-lg border border-pink-400/30"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.skillsWanted?.map((skill) => (
                <div
                  key={skill}
                  className="flex justify-between items-center p-4 bg-pink-500/10 border border-pink-500/20 rounded-xl group hover:bg-pink-500/20 transition-all"
                >
                  <span className="font-medium text-pink-100">{skill}</span>
                  <Trash2
                    size={18}
                    onClick={() => handleRemoveSkill(skill, 'wanted')}
                    className="text-gray-500 hover:text-red-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
              {(!user.skillsWanted ||
                user.skillsWanted.length === 0) && (
                <p className="text-gray-500 italic col-span-2 text-center py-4">
                  You haven't requested any skills yet.
                </p>
              )}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Add Skill Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          modalType === 'offered'
            ? 'Add a Skill You Teach'
            : 'Add a Skill You Want'
        }
      >
        <form onSubmit={handleAddSkill} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Skill Name
            </label>
            <input
              autoFocus
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder={
                modalType === 'offered'
                  ? 'e.g. React.js, Public Speaking'
                  : 'e.g. Piano, French'
              }
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 rounded-lg font-bold shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2"
          >
            <Save size={18} /> Save Skill
          </button>
        </form>
      </Modal>
    </>
  );
};

export default Dashboard;
