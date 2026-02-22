
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Graph.css';

const Graph = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSalaryData = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await fetch('https://dummyjson.com/users');
      const data = await response.json();
      
      const employees = data.users.map(user => ({
        name: `${user.firstName} ${user.lastName}`,
        salary: Math.floor(Math.random() * 1500000 + 300000), // ₹3L-18L
        age: user.age || Math.floor(Math.random() * 40 + 22),
        image: user.image
      }));
      
      // Top 10 for graph
      const top10 = employees.slice(0, 10);
      setSalaryData(top10);
      
      // Full analysis
      const stats = calculateAnalysis(employees);
      setAnalysis(stats);
      
    } catch (err) {
      console.error('Graph data error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateAnalysis = (employees) => {
    const salaries = employees.map(emp => emp.salary);
    
    return {
      totalEmployees: employees.length,
      highestSalary: Math.max(...salaries),
      lowestSalary: Math.min(...salaries),
      averageSalary: Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length / 10000) * 10000,
      medianSalary: calculateMedian(salaries),
      salaryRange: Math.max(...salaries) - Math.min(...salaries),
      topEarner: employees.find(emp => emp.salary === Math.max(...salaries))?.name,
      avgAge: Math.round(employees.reduce((sum, emp) => sum + emp.age, 0) / employees.length)
    };
  };

  const calculateMedian = (numbers) => {
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  };

  // ✅ FIXED: Changed fetchEmployees() → fetchSalaryData()
  useEffect(() => {
    fetchSalaryData();
  }, [fetchSalaryData]);

  if (loading) {
    return (
      <div className="graph-container">
        <div className="loading">Analyzing salaries...</div>
      </div>
    );
  }

  if (!analysis) {
    return <div className="loading">No data available</div>;
  }

  return (
    <div className="graph-container">
      <div className="graph-header">
        <h1 className='graph-title'>Salary Analysis Dashboard</h1>
        <button className="back-btn" onClick={() => navigate('/list')}>
          ← Back to List
        </button>
      </div>

      {/* Key Insights */}
      <div className="insights-grid">
        <div className="insight-card highest">
          <h3>Highest Salary</h3>
          <div className="insight-value">
            ₹{Math.round(analysis.highestSalary / 10000) / 100}L
          </div>
          <div className="insight-label">{analysis.topEarner}</div>
        </div>
        
        <div className="insight-card average">
          <h3>Average Salary</h3>
          <div className="insight-value">
            ₹{Math.round(analysis.averageSalary / 10000) / 100}L
          </div>
        </div>
        
        <div className="insight-card range">
          <h3>Salary Range</h3>
          <div className="insight-value">
            ₹{Math.round(analysis.salaryRange / 10000) / 100}L
          </div>
        </div>
        
        <div className="insight-card employees">
          <h3>Total Employees</h3>
          <div className="insight-value">{analysis.totalEmployees}</div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="graph-card">
        <h3>Top 10 Salaries</h3>
        <svg viewBox="0 0 800 400" className="salary-chart">
          <defs>
            <linearGradient id="bar-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4caf50"/>
              <stop offset="100%" stopColor="#81c784"/>
            </linearGradient>
          </defs>
          <rect x="50" y="50" width="700" height="320" fill="rgba(255,255,255,0.5)" rx="10"/>
          <text x="400" y="35" textAnchor="middle" fontSize="20" fontWeight="700" fill="#e91e63">
            Monthly Salaries (₹ Lakhs)
          </text>
          
          {/* Y-Axis */}
          {[3, 2, 1, 0].map((value, i) => (
            <g key={i}>
              <line x1="80" y1={370 - (value * 80)} x2="750" y2={370 - (value * 80)}
                    stroke="#e0e0e0" strokeWidth="1"/>
              <text x="70" y={375 - (value * 80)} fontSize="12" fill="#666">{value}L</text>
            </g>
          ))}
          
          {/* Bars */}
          {salaryData.map((emp, index) => {
            const barHeight = Math.min((emp.salary / 100000) * 50, 300);
            const barY = 370 - barHeight;
            return (
              <g key={emp.name}>
                <rect 
                  x={90 + (index * 65)}
                  y={barY}
                  width="50"
                  height={barHeight}
                  fill="url(#bar-gradient)" 
                  rx="6"
                  className="bar"
                />
                <text x={115 + (index * 65)} y={barY - 8} fontSize="11" fill="#e91e63" textAnchor="middle">
                  ₹{Math.round(emp.salary/10000)/100}
                </text>
                <text x={115 + (index * 65)} y="395" fontSize="10" fill="#333" textAnchor="middle">
                  {emp.name.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default Graph;

