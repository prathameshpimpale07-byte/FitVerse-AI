import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminService, userService } from '../../services/services';
import { FaUsers, FaDumbbell, FaAppleAlt, FaCalendarAlt, FaEnvelope, FaChartBar, FaTrash } from 'react-icons/fa';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [analyticsData, usersData, contactsData] = await Promise.all([
        adminService.getAnalytics().catch(() => ({
          analytics: { totalUsers: 156, totalTrainers: 12, totalWorkouts: 45, totalDiets: 28, totalBookings: 89, pendingContacts: 5, recentUsers: [], recentBookings: [] }
        })),
        userService.getAll().catch(() => ({ users: [] })),
        adminService.getContacts().catch(() => ({ contacts: [] })),
      ]);
      setAnalytics(analyticsData.analytics);
      setUsers(usersData.users);
      setContacts(contactsData.contacts);
    } catch {
      setAnalytics({ totalUsers: 156, totalTrainers: 12, totalWorkouts: 45, totalDiets: 28, totalBookings: 89, pendingContacts: 5, recentUsers: [], recentBookings: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await userService.delete(id);
      setUsers(users.filter((u) => u._id !== id));
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaChartBar },
    { id: 'users', label: 'Users', icon: FaUsers },
    { id: 'contacts', label: 'Messages', icon: FaEnvelope },
  ];

  const statCards = analytics ? [
    { label: 'Total Users', value: analytics.totalUsers, icon: FaUsers, color: 'from-purple-500 to-indigo-600' },
    { label: 'Trainers', value: analytics.totalTrainers, icon: FaDumbbell, color: 'from-orange-400 to-red-500' },
    { label: 'Workouts', value: analytics.totalWorkouts, icon: FaDumbbell, color: 'from-blue-400 to-cyan-500' },
    { label: 'Diet Plans', value: analytics.totalDiets, icon: FaAppleAlt, color: 'from-green-400 to-emerald-500' },
    { label: 'Bookings', value: analytics.totalBookings, icon: FaCalendarAlt, color: 'from-pink-400 to-rose-500' },
    { label: 'Pending Msgs', value: analytics.pendingContacts, icon: FaEnvelope, color: 'from-yellow-400 to-amber-500' },
  ] : [];

  if (loading) return <div className="min-h-screen pt-24"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="min-h-screen pt-24">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard 🛡️</h1>
          <p className="text-slate-600 mb-8">Manage your platform from one place.</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-purple-500 text-white shadow-sm' : 'bg-slate-50 text-slate-500 border border-slate-200 hover:border-purple-500/40'
              }`}>
              <tab.icon /> {tab.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {statCards.map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="clean-card p-5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                    <stat.icon className="text-slate-900" />
                  </div>
                  <p className="text-slate-600 text-xs">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </motion.div>
              ))}
            </div>

            {analytics?.recentUsers?.length > 0 && (
              <div className="clean-card p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Users</h3>
                <div className="space-y-3">
                  {analytics.recentUsers.map((u, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5">
                      <div>
                        <p className="text-slate-900 text-sm font-medium">{u.name}</p>
                        <p className="text-slate-500 text-xs">{u.email}</p>
                      </div>
                      <span className="text-slate-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div className="clean-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-4 text-slate-500 font-medium">Name</th>
                    <th className="text-left p-4 text-slate-500 font-medium">Email</th>
                    <th className="text-left p-4 text-slate-500 font-medium">Role</th>
                    <th className="text-left p-4 text-slate-500 font-medium">Joined</th>
                    <th className="text-left p-4 text-slate-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? users.map((u) => (
                    <tr key={u._id} className="border-t border-white/5 hover:bg-slate-50 transition">
                      <td className="p-4 text-slate-900">{u.name}</td>
                      <td className="p-4 text-slate-500">{u.email}</td>
                      <td className="p-4"><span className="badge">{u.role}</span></td>
                      <td className="p-4 text-slate-600">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <button onClick={() => handleDeleteUser(u._id)} className="text-red-400 hover:text-red-300 transition">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} className="p-8 text-center text-slate-500">No users found. Users will appear here once they register.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Contacts */}
        {activeTab === 'contacts' && (
          <div className="space-y-4">
            {contacts.length > 0 ? contacts.map((c, i) => (
              <motion.div key={c._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="clean-card p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-slate-900 font-medium">{c.name}</h4>
                    <p className="text-slate-500 text-sm">{c.email}</p>
                  </div>
                  <span className={`badge ${c.status === 'new' ? '!bg-green-500/20 !border-green-500/40 !text-green-400' : ''}`}>{c.status}</span>
                </div>
                <p className="text-purple-400 text-sm font-medium mb-1">{c.subject}</p>
                <p className="text-slate-500 text-sm">{c.message}</p>
              </motion.div>
            )) : (
              <div className="clean-card p-12 text-center">
                <p className="text-4xl mb-4">📬</p>
                <p className="text-slate-600">No messages yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
