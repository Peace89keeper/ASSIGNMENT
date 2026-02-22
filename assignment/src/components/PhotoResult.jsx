// src/components/PhotoResult.jsx - COMPLETE PHOTO GALLERY
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Photo.css';

const PhotoResult = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const EMPLOYEES_PER_PAGE = 12;

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://dummyjson.com/users');
      const data = await response.json();
      
      const employeesData = data.users.map(user => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        salary: Math.floor(Math.random() * 1500000 + 300000),
        department: ['HR', 'Engineering', 'Sales', 'Marketing', 'Finance', 'Design'][Math.floor(Math.random() * 6)],
        image: user.image,
        age: user.age
      }));
      
      setEmployees(employeesData);
      setFilteredEmployees(employeesData);
    } catch {
      console.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  // Filter employees
  useEffect(() => {
    let filtered = employees;

    if (searchQuery) {
      filtered = filtered.filter(emp =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(emp => emp.department === departmentFilter);
    }

    setFilteredEmployees(filtered);
    setCurrentPage(1); // Reset to first page
  }, [searchQuery, departmentFilter, employees]);

  // Pagination
  const indexOfLastEmployee = currentPage * EMPLOYEES_PER_PAGE;
  const indexOfFirstEmployee = indexOfLastEmployee - EMPLOYEES_PER_PAGE;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(filteredEmployees.length / EMPLOYEES_PER_PAGE);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const departments = ['all', 'HR', 'Engineering', 'Sales', 'Marketing', 'Finance', 'Design'];

  if (loading) {
    return (
      <div className="photo-container">
        <div className="loading">Loading photo gallery...</div>
      </div>
    );
  }

  return (
    <div className="photo-container">
      <div className="photo-header">
        <button className="back-btn" onClick={() => navigate('/list')}>
          ← Back to List
        </button>
        <h1>Employee Photo Gallery</h1>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-container">
          <select 
            className="filter-select"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>
                {dept === 'all' ? 'All Departments' : dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Info */}
      <div className="results-info">
        Showing {currentEmployees.length} of {filteredEmployees.length} employees 
        ({totalPages} pages)
      </div>

      {/* Photo Grid */}
      <div className="photo-grid">
        {currentEmployees.map((emp) => (
          <div key={emp.id} className="photo-card" onClick={() => navigate(`/details/${emp.id}`)}>
            <div className="photo-image-container">
              <img 
                src={emp.image}
                alt={emp.name}
                className="photo-image"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/250/4caf50/fff?text=${emp.name.charAt(0)}`;
                }}
              />
              <div className="photo-overlay">
                <span className="view-details">View Details</span>
              </div>
            </div>
            <div className="photo-info">
              <h3 className="photo-name">{emp.name}</h3>
              <div className="photo-dept">{emp.department}</div>
              <div className="photo-salary">₹{parseInt(emp.salary).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="page-btn"
            onClick={() => paginate(1)}
            disabled={currentPage === 1}
          >
            First
          </button>
          <button 
            className="page-btn"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = currentPage > 3 
                ? Math.max(currentPage - 2 + i, 1) 
                : i + 1;
              return (
                <button
                  key={page}
                  className={`page-number ${currentPage === page ? 'active' : ''}`}
                  onClick={() => paginate(page)}
                >
                  {page}
                </button>
              );
            })}
          </div>
          
          <button 
            className="page-btn"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <button 
            className="page-btn"
            onClick={() => paginate(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoResult;
