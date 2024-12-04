import React, { useState, useEffect } from 'react';
import '../assets/styles/dashboard.css';
import axiosWithHeader from '../services/axios.js';


const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosWithHeader.get('/api/users');
      setUsers(response.data.data);
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axiosWithHeader.delete(`/api/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
      alert('User deleted successfully.');
    } catch (err) {
      alert(`Error deleting user: ${err.message}`);
    }
  };

  const changeUserRole = async (userId, newRole) => {
    try {
      await axiosWithHeader.put(`/api/users/${userId}`, { role: newRole });
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
      alert('Role updated successfully.');
    } catch (err) {
      alert(`Error updating role: ${err.message}`);
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="dashboard">
      <h1>User Management Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => changeUserRole(user._id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="super-admin">Super Admin</option>
                </select>
              </td>
              <td>
                <button onClick={() => deleteUser(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
