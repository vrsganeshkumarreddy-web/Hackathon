import React, { useState, useEffect } from 'react';
import { 
  Shield, User, Lock, Mail, Phone, Calendar, FileText, 
  Plus, Trash2, Edit2, Search, LogOut, CheckCircle, 
  AlertCircle, Activity, UserPlus, Heart, FilePlus
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); // login, signup, dashboard

  // Local Storage Initialization
  useEffect(() => {
    const activeUser = localStorage.getItem('hrs_active_user');
    if (activeUser) {
      setUser(JSON.parse(activeUser));
      setView('dashboard');
    }

    // Seed default records if empty
    if (!localStorage.getItem('hrs_records')) {
      const initialRecords = [
        { id: '1', patientName: 'Rahul Sharma', email: 'rahul@gmail.com', age: 32, bloodGroup: 'B+', diagnosis: 'Hypertension', doctor: 'Dr. A. Mehta', prescription: 'Amlodipine 5mg', date: '2026-06-01', status: 'Stable' },
        { id: '2', patientName: 'Priya Verma', email: 'priya@gmail.com', age: 28, bloodGroup: 'O+', diagnosis: 'Seasonal Allergies', doctor: 'Dr. S. Roy', prescription: 'Cetirizine 10mg', date: '2026-06-03', status: 'Recovered' }
      ];
      localStorage.setItem('hrs_records', JSON.stringify(initialRecords));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('hrs_active_user');
    setUser(null);
    setView('login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Header */}
      <header className="bg-teal-700 text-white shadow-md py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Heart className="h-7 w-7 text-teal-200 fill-teal-200" />
          <span className="text-xl font-bold tracking-wide">HealthRecords System</span>
        </div>
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-sm bg-teal-800 px-3 py-1 rounded-full border border-teal-600">
              {user.role === 'admin' ? '👨‍⚕️ Doctor / Admin' : '👤 Patient'} : {user.name}
            </span>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-1 bg-teal-600 hover:bg-teal-500 px-3 py-1.5 rounded text-sm transition"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4">
        {!user ? (
          view === 'login' ? <Login setUser={setUser} setView={setView} /> : <Signup setView={setView} />
        ) : (
          user.role === 'admin' ? <AdminDashboard user={user} /> : <UserDashboard user={user} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-400 text-center py-3 text-xs">
        &copy; 2026 Health Records System. Secure Medical Portal.
      </footer>
    </div>
  );
}

// ================= LOGIN COMPONENT =================
function Login({ setUser, setView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('hrs_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);

    if (found) {
      setUser(found);
      localStorage.setItem('hrs_active_user', JSON.stringify(found));
    } else {
      setError('Invalid email or password. Please check or sign up.');
    }
  };

  const fillAdminDemo = () => {
    setEmail('admin@hospital.com');
    setPassword('admin123');
    // Ensure admin exists in storage
    const users = JSON.parse(localStorage.getItem('hrs_users') || '[]');
    if (!users.some(u => u.email === 'admin@hospital.com')) {
      users.push({ name: 'Dr. House', email: 'admin@hospital.com', password: 'admin123', role: 'admin' });
      localStorage.setItem('hrs_users', JSON.stringify(users));
    }
  };

  const fillPatientDemo = () => {
    setEmail('rahul@gmail.com');
    setPassword('user123');
    const users = JSON.parse(localStorage.getItem('hrs_users') || '[]');
    if (!users.some(u => u.email === 'rahul@gmail.com')) {
      users.push({ name: 'Rahul Sharma', email: 'rahul@gmail.com', password: 'user123', role: 'user' });
      localStorage.setItem('hrs_users', JSON.stringify(users));
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-slate-100">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
        <p className="text-sm text-slate-500">Sign in to access health records</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input 
              type="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="name@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input 
              type="password" required
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded-lg transition shadow">
          Login
        </button>
      </form>

      <div className="mt-4 flex gap-2">
        <button onClick={fillAdminDemo} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs py-1.5 rounded font-medium">
          Fill Admin Demo
        </button>
        <button onClick={fillPatientDemo} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs py-1.5 rounded font-medium">
          Fill Patient Demo
        </button>
      </div>

      <p className="text-center text-sm text-slate-600 mt-6">
        Don't have an account?{' '}
        <button onClick={() => setView('signup')} className="text-teal-600 font-semibold hover:underline">
          Sign up
        </button>
      </p>
    </div>
  );
}

// ================= SIGNUP COMPONENT =================
function Signup({ setView }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [success, setSuccess] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('hrs_users') || '[]');
    if (users.some(u => u.email === email)) {
      alert('Email already registered!');
      return;
    }

    const newUser = { name, email, password, role };
    users.push(newUser);
    localStorage.setItem('hrs_users', JSON.stringify(users));

    setSuccess('Account created successfully! Redirecting to login...');
    setTimeout(() => setView('login'), 1500);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-slate-100">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
        <p className="text-sm text-slate-500">Register new user or doctor profile</p>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Full Name</label>
          <input 
            type="text" required
            value={name} onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Email Address</label>
          <input 
            type="email" required
            value={email} onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
            placeholder="name@example.com"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Password</label>
          <input 
            type="password" required
            value={password} onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Role</label>
          <select 
            value={role} onChange={e => setRole(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none bg-white"
          >
            <option value="user">Patient / User</option>
            <option value="admin">Doctor / Admin</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded-lg transition shadow">
          Sign Up
        </button>
      </form>

      <p className="text-center text-sm text-slate-600 mt-6">
        Already have an account?{' '}
        <button onClick={() => setView('login')} className="text-teal-600 font-semibold hover:underline">
          Login
        </button>
      </p>
    </div>
  );
}

// ================= ADMIN DASHBOARD =================
function AdminDashboard({ user }) {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    patientName: '', email: '', age: '', bloodGroup: 'O+', diagnosis: '', doctor: user.name, prescription: '', date: new Date().toISOString().split('T')[0], status: 'Stable'
  });

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = () => {
    const data = JSON.parse(localStorage.getItem('hrs_records') || '[]');
    setRecords(data);
  };

  const handleSave = (e) => {
    e.preventDefault();
    let updated = [...records];
    if (editingId) {
      updated = updated.map(r => r.id === editingId ? { ...formData, id: editingId } : r);
    } else {
      const newRecord = { ...formData, id: Date.now().toString() };
      updated.push(newRecord);
    }
    localStorage.setItem('hrs_records', JSON.stringify(updated));
    setRecords(updated);
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      const updated = records.filter(r => r.id !== id);
      localStorage.setItem('hrs_records', JSON.stringify(updated));
      setRecords(updated);
    }
  };

  const openEdit = (record) => {
    setFormData(record);
    setEditingId(record.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ patientName: '', email: '', age: '', bloodGroup: 'O+', diagnosis: '', doctor: user.name, prescription: '', date: new Date().toISOString().split('T')[0], status: 'Stable' });
  };

  const filtered = records.filter(r => 
    r.patientName.toLowerCase().includes(search.toLowerCase()) || 
    r.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg border border-slate-100 p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Doctor / Admin Portal</h2>
          <p className="text-xs text-slate-500">Manage patient medical database and records</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm shadow transition"
        >
          <FilePlus className="h-4 w-4" />
          <span>Add Medical Record</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <input 
          type="text"
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by patient name, email, or diagnosis..."
          className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none"
        />
      </div>

      {/* Records Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-semibold border-b">
              <th className="p-3">Patient</th>
              <th className="p-3">Diagnosis</th>
              <th className="p-3">Blood Group</th>
              <th className="p-3">Prescription</th>
              <th className="p-3">Doctor</th>
              <th className="p-3">Date</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-6 text-center text-slate-400">No medical records found.</td>
              </tr>
            ) : (
              filtered.map(r => (
                <tr key={r.id} className="border-b hover:bg-slate-50 transition">
                  <td className="p-3">
                    <div className="font-semibold text-slate-900">{r.patientName}</div>
                    <div className="text-xs text-slate-500">{r.email} ({r.age} yrs)</div>
                  </td>
                  <td className="p-3 text-slate-700 font-medium">{r.diagnosis}</td>
                  <td className="p-3"><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">{r.bloodGroup}</span></td>
                  <td className="p-3 text-slate-600">{r.prescription}</td>
                  <td className="p-3 text-slate-600">{r.doctor}</td>
                  <td className="p-3 text-slate-500 text-xs">{r.date}</td>
                  <td className="p-3 flex justify-center space-x-2">
                    <button onClick={() => openEdit(r)} className="p-1.5 bg-amber-50 text-amber-600 rounded hover:bg-amber-100 transition">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(r.id)} className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">{editingId ? 'Edit Medical Record' : 'Add New Medical Record'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Patient Name</label>
                  <input type="text" required value={formData.patientName} onChange={e => setFormData({...formData, patientName: e.target.value})} className="w-full px-3 py-2 border rounded text-sm outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Email</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border rounded text-sm outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Age</label>
                  <input type="number" required value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full px-3 py-2 border rounded text-sm outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Blood Group</label>
                  <select value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})} className="w-full px-3 py-2 border rounded text-sm outline-none bg-white">
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Date</label>
                  <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border rounded text-sm outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Diagnosis</label>
                <input type="text" required value={formData.diagnosis} onChange={e => setFormData({...formData, diagnosis: e.target.value})} className="w-full px-3 py-2 border rounded text-sm outline-none focus:ring-2 focus:ring-teal-500" />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Prescription</label>
                <input type="text" required value={formData.prescription} onChange={e => setFormData({...formData, prescription: e.target.value})} className="w-full px-3 py-2 border rounded text-sm outline-none focus:ring-2 focus:ring-teal-500" />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={closeModal} className="px-4 py-2 border rounded text-sm text-slate-600 hover:bg-slate-100">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded text-sm hover:bg-teal-700 shadow">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ================= USER DASHBOARD =================
function UserDashboard({ user }) {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('hrs_records') || '[]');
    // Match records by email or show sample records if testing demo user
    const myRecords = data.filter(r => r.email.toLowerCase() === user.email.toLowerCase() || user.email === 'rahul@gmail.com');
    setRecords(myRecords);
  }, [user]);

  return (
    <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg border border-slate-100 p-6">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-xl font-bold text-slate-800">My Health Records</h2>
        <p className="text-xs text-slate-500">View personal medical history, diagnoses, and prescriptions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-teal-50 border border-teal-100 p-4 rounded-lg">
          <div className="text-xs font-semibold text-teal-600 uppercase">Registered Patient</div>
          <div className="text-lg font-bold text-teal-900">{user.name}</div>
          <div className="text-xs text-teal-700">{user.email}</div>
        </div>
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
          <div className="text-xs font-semibold text-blue-600 uppercase">Total Records</div>
          <div className="text-2xl font-bold text-blue-900">{records.length}</div>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg">
          <div className="text-xs font-semibold text-emerald-600 uppercase">Status</div>
          <div className="text-lg font-bold text-emerald-900">Active & Verified</div>
        </div>
      </div>

      <h3 className="text-md font-bold text-slate-800 mb-3">Medical History History</h3>
      <div className="space-y-4">
        {records.length === 0 ? (
          <div className="p-8 text-center border rounded-lg text-slate-400 bg-slate-50">
            No medical records assigned to your email address yet.
          </div>
        ) : (
          records.map(r => (
            <div key={r.id} className="border rounded-lg p-4 bg-slate-50 hover:bg-white transition shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs bg-teal-100 text-teal-800 font-semibold px-2 py-0.5 rounded">{r.diagnosis}</span>
                  <span className="ml-2 text-xs text-slate-500">Date: {r.date}</span>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">Blood: {r.bloodGroup}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mt-3">
                <div><span className="font-semibold text-slate-700">Attending Doctor:</span> {r.doctor}</div>
                <div><span className="font-semibold text-slate-700">Prescription:</span> {r.prescription}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}