import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [mainlandUsers, setMainlandUsers] = useState([]);
  const [offshoreUsers, setOffshoreUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaidUsers = async () => {
      setLoading(true);
      // Fetch all paid onboarding records
      const { data: onboardings } = await supabase
        .from('Onboarding')
        .select('*')
        .eq('submitted', true);
      // Fetch all related names in one go
      const [industries, activities, freezones, usersTable, mainlandTable, offshoreTable] = await Promise.all([
        supabase.from('Industry').select('id, name'),
        supabase.from('Activities').select('id, name'),
        supabase.from('Freezones').select('id, name'),
        supabase.from('Users').select('user_id, first_name, last_name, email'),
        supabase.from('MainlandUserInfo').select('*'),
        supabase.from('OffshoreUserInfo').select('*')
      ]);
      // Map for quick lookup
      const industryMap = Object.fromEntries((industries.data || []).map(i => [i.id, i.name]));
      const activityMap = Object.fromEntries((activities.data || []).map(a => [a.id, a.name]));
      const freezoneMap = Object.fromEntries((freezones.data || []).map(f => [f.id, f.name]));
      const userMap = Object.fromEntries((usersTable.data || []).map(u => [u.user_id, `${u.first_name} ${u.last_name}`]));
      // Attach names for onboarding users
      const withNames = (onboardings || []).map(o => ({
        ...o,
        industry_name: industryMap[o.industry] || '-',
        activity_name: o.custom_activity || activityMap[o.activity] || '-',
        freezone_name: freezoneMap[o.freezone] || '-',
        user_name: userMap[o.user_id] || o.user_id
      }));
      setUsers(withNames);
      // Mainland users
      setMainlandUsers((mainlandTable.data || []).map(u => ({
        ...u,
        user_name: userMap[u.user_id] || u.user_id
      })));
      // Offshore users
      setOffshoreUsers((offshoreTable.data || []).map(u => ({
        ...u,
        user_name: userMap[u.user_id] || u.user_id
      })));
      setLoading(false);
    };
    fetchPaidUsers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/signin';
  };

  return (
    <div className="d-flex vh-100 bg-dark text-white align-items-center justify-content-center">
      <div className="card-container p-4 shadow w-100" style={{ maxWidth: 1200, background: '#181c24', borderRadius: 16, boxShadow: '0 2px 16px #0002' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="title mb-0" style={{ color: 'var(--color-primary)' }}>Admin Dashboard</h2>
          <button className="btn btn-danger btn-sm fw-semibold" onClick={handleLogout}>Logout</button>
        </div>
        {loading ? <div className="text-white">Loading...</div> : (
          <>
            <h3 className="mt-4 mb-2" style={{ color: '#0ff' }}>Freezone Users</h3>
            <div className="table-responsive mb-4">
              <table className="table table-dark table-hover align-middle" style={{ borderRadius: 12, overflow: 'hidden' }}>
                <thead style={{ background: '#23272f' }}>
                  <tr>
                    <th>User</th>
                    <th>Industry</th>
                    <th>Activity</th>
                    <th>Freezone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ background: '#23272f' }}>
                      <td>{u.user_name}</td>
                      <td>{u.industry_name}</td>
                      <td>{u.activity_name}</td>
                      <td>{u.freezone_name}</td>
                      <td>
                        <button className="btn btn-primary btn-sm fw-semibold" onClick={() => navigate(`/admin/user/${u.id}`)}>
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h3 className="mt-4 mb-2" style={{ color: '#0ff' }}>Mainland Users</h3>
            <div className="table-responsive mb-4">
              <table className="table table-dark table-hover align-middle" style={{ borderRadius: 12, overflow: 'hidden' }}>
                <thead style={{ background: '#23272f' }}>
                  <tr>
                    <th>User</th>
                    <th>Business Name</th>
                    <th>Legal Structure</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mainlandUsers.map(u => (
                    <tr key={u.id} style={{ background: '#23272f' }}>
                      <td>{u.user_name}</td>
                      <td>{u.business_name}</td>
                      <td>{u.legal_structure}</td>
                      <td>
                        <button className="btn btn-primary btn-sm fw-semibold" onClick={() => navigate(`/admin/user/${u.id}`)}>
                          Show Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h3 className="mt-4 mb-2" style={{ color: '#0ff' }}>Offshore Users</h3>
            <div className="table-responsive mb-4">
              <table className="table table-dark table-hover align-middle" style={{ borderRadius: 12, overflow: 'hidden' }}>
                <thead style={{ background: '#23272f' }}>
                  <tr>
                    <th>User</th>
                    <th>Business Name</th>
                    <th>Jurisdiction</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {offshoreUsers.map(u => (
                    <tr key={u.id} style={{ background: '#23272f' }}>
                      <td>{u.user_name}</td>
                      <td>{u.business_name}</td>
                      <td>{u.jurisdiction}</td>
                      <td>
                        <button className="btn btn-primary btn-sm fw-semibold" onClick={() => navigate(`/admin/user/${u.id}`)}>
                          Show Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
