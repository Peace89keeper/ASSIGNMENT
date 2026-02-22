
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Details.css';

const Details = () => {
  const [allEmployees, setAllEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllEmployees();
  }, []);

  const fetchAllEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://dummyjson.com/users');
      const data = await response.json();
      
      const employees = data.users.map(user => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone,
        salary: Math.floor(Math.random() * 1500000 + 300000),
        age: user.age || Math.floor(Math.random() * 40 + 22),
        department: ['HR', 'Engineering', 'Sales', 'Marketing', 'Finance'][Math.floor(Math.random() * 5)],
        image: user.image,
        address: `${user.address.address}, ${user.address.city}`,
        company: user.company?.name || 'Tech Corp'
      }));
      
      setAllEmployees(employees);
      // Auto-select first employee
      setSelectedEmployee(employees[0]);
      
    } catch {
      console.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  // Filter employees based on search
  const filteredEmployees = allEmployees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleEmployeeSelect = (emp) => {
    setSelectedEmployee(emp);
    setSearchQuery(''); // Clear search after selection
  };

  if (loading) {
    return (
      <div className="details-container">
        <div className="loading">Loading employees...</div>
      </div>
    );
  }

  return (
    <div className="details-container">
      <div className="details-header">
        <button className="back-btn" onClick={() => navigate('/list')}>
          ← Back to List
        </button>
        <h1>Employee Search & Details</h1>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name (e.g., Michael, Emily...)"
            value={searchQuery}
            onChange={handleSearch}
          />
          <span className="search-count">
            {filteredEmployees.length} of {allEmployees.length} employees
          </span>
        </div>
      </div>

      <div className="details-layout">
        {/* Employee List */}
        <div className="employee-list">
          <h3>Employees ({filteredEmployees.length})</h3>
          <div className="list-container">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <div 
                  key={emp.id}
                  className={`emp-item ${selectedEmployee?.id === emp.id ? 'active' : ''}`}
                  onClick={() => handleEmployeeSelect(emp)}
                >
                  <img 
                    src={emp.image} 
                    alt={emp.name}
                    className="emp-list-img"
                  />
                  <div className="emp-list-info">
                    <div className="emp-name">{emp.name}</div>
                    <div className="emp-dept">{emp.department}</div>
                    <div className="emp-salary">₹{parseInt(emp.salary).toLocaleString()}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                No employees found for "{searchQuery}"
              </div>
            )}
          </div>
        </div>

        {/* Selected Employee Details */}
        <div className="employee-details">
          {selectedEmployee ? (
            <>
              <div className="profile-header">
                <img 
                  src={selectedEmployee.image} 
                  alt={selectedEmployee.name}
                  className="profile-image-large"
                />
                <div className="profile-main-info">
                  <h2>{selectedEmployee.name}</h2>
                  <div className="profile-badge">{selectedEmployee.department}</div>
                  <div className="salary-display">
                    <span className="salary-amount-large">
                      ₹{parseInt(selectedEmployee.salary).toLocaleString()}
                    </span>
                    <span className="salary-label">Monthly</span>
                  </div>
                </div>
              </div>

              <div className="details-grid">
                <div className="details-card">
                  <h3>📧 Contact</h3>
                  <div className="info-row">
                    <div className="info-item">
                      <span className="info-label">Email</span>
                      <span className="info-value">{selectedEmployee.email}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Phone</span>
                      <span className="info-value">{selectedEmployee.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="details-card">
                  <h3>💼 Employment</h3>
                  <div className="info-row">
                    <div className="info-item">
                      <span className="info-label">ID</span>
                      <span className="info-value">EMP-{selectedEmployee.id.toString().padStart(3, '0')}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Age</span>
                      <span className="info-value">{selectedEmployee.age}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <h3>Select an employee to view details</h3>
              <p>Search or click any employee above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Details;
