import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './List.css';

const List = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      // ✅ NEW RELIABLE API - NO 429 ERRORS
      const response = await fetch('https://dummyjson.com/users');
      if (!response.ok) throw new Error('Network error');
      
      const data = await response.json();
      
      // Transform users → employees format
      const transformedEmployees = data.users.map(user => ({
        id: user.id,
        employee_name: `${user.firstName} ${user.lastName}`,
        employee_salary: Math.floor(Math.random() * 1500000 + 300000), // ₹3L-18L
        employee_age: user.age || Math.floor(Math.random() * 40 + 22),
        profile_image: user.image
      }));
      
      setEmployees(transformedEmployees);
      setFilteredEmployees(transformedEmployees);
      
    } catch (err) {
      setError('Failed to load employees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(emp =>
        emp.employee_name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  };

  const handleRowClick = (id) => {
    navigate(`/details/${id}`);
  };

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  if (loading) {
    return (
      <div className="list-container">
        <div className="list-header">
          <h1>Employee Directory</h1>
        </div>
        <div className="loading">Loading employees...</div>
      </div>
    );
  }

  return (
    <div className="list-container">
      <div className="list-header">
        <h1>Employee Directory ({employees.length} employees)</h1>
        
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <button className="search-btn" onClick={() => handleSearch(searchQuery)}>
            🔍
          </button>
        </div>

        <div className="action-buttons">
          <button className="action-btn" onClick={() => navigate('/graph')}>
            📊 Salary Analysis
          </button>
          <button className="action-btn" onClick={() => navigate('/map')}>
            🗺️ Employee Map
          </button>
          <button className="action-btn" onClick={fetchEmployees}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="list-card">
        <div className="results-info">
          Showing {filteredEmployees.length} of {employees.length} employees
          {searchQuery && ` for "${searchQuery}"`}
        </div>

        <table className="employee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Salary</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp.id} className="employee-row" onClick={() => handleRowClick(emp.id)}>
                <td>{emp.id}</td>
                <td>
                  <img 
                    src={emp.profile_image} 
                    alt={emp.employee_name}
                    className="emp-photo"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/50/4caf50/fff?text=${emp.employee_name.charAt(0)}`;
                    }}
                  />
                </td>
                <td>{emp.employee_name}</td>
                <td>₹{parseInt(emp.employee_salary).toLocaleString()}</td>
                <td>{emp.employee_age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default List;

