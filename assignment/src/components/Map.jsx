// src/components/Maps.jsx - PERFECTLY WORKING
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';  // 🔥 REQUIRED
import './Map.css';

// Fix Leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Maps = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const cities = [
    { name: 'Faridabad', lat: 28.4089, lng: 77.3178 },
    { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
    { name: 'Noida', lat: 28.5355, lng: 77.3910 },
    { name: 'Gurgaon', lat: 28.4595, lng: 77.0266 },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
    { name: 'Pune', lat: 18.5204, lng: 73.8567 },
    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  ];

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
        salary: Math.floor(Math.random() * 1500000 + 300000),
        age: user.age || Math.floor(Math.random() * 40 + 22),
        image: user.image,
        email: user.email,
        phone: user.phone,
        city: cities[Math.floor(Math.random() * cities.length)],
        department: ['HR', 'Engineering', 'Sales', 'Marketing', 'Finance'][Math.floor(Math.random() * 5)]
      }));
      
      setEmployees(employeesData);
    } catch {
      console.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="maps-container">
        <div className="loading">Loading employee locations...</div>
      </div>
    );
  }

  // Group employees by city
  const employeesByCity = cities.map(city => ({
    ...city,
    count: employees.filter(emp => emp.city.name === city.name).length,
    employees: employees.filter(emp => emp.city.name === city.name)
  })).filter(city => city.count > 0);

  // Calculate insights
  const cityWithMostEmployees = employeesByCity.reduce((max, city) => 
    city.count > max.count ? city : max
  );
  
  const highestAvgSalaryCity = employeesByCity.reduce((max, city) => {
    const avg = city.employees.reduce((sum, emp) => sum + emp.salary, 0) / city.count;
    return avg > max.avg ? { ...city, avg } : max;
  }, { avg: 0 });

  return (
    <div className="maps-container">
      <div className="maps-header">
        <button className="back-btn" onClick={() => navigate('/list')}>
          ← Back to List
        </button>
        <h1>Employee Locations ({employees.length} total)</h1>
      </div>

      <div className="maps-content">
        {/* 🔥 PERFECT MAP WRAPPER */}
        <div className="map-wrapper">
          <MapContainer
            center={[23.0, 78.0]}
            zoom={5}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            
            {employeesByCity.map((city, index) => (
              <Marker key={index} position={[city.lat, city.lng]}>
                <Popup>
                  <div style={{ minWidth: '280px', padding: '1rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748', fontSize: '1.25rem' }}>
                      {city.name}
                    </h4>
                    <p style={{ margin: '0.5rem 0', fontWeight: '600', color: '#667eea' }}>
                      {city.count} employees working here
                    </p>
                    <div style={{ marginTop: '1rem' }}>
                      {city.employees.slice(0, 5).map(emp => (
                        <div key={emp.id} style={{ 
                          margin: '0.25rem 0', 
                          padding: '0.5rem', 
                          background: '#f7fafc', 
                          borderRadius: '6px',
                          fontSize: '0.9rem'
                        }}>
                          👤 {emp.name} 
                          <span style={{ color: '#667eea', fontWeight: '500' }}>
                            - ₹{parseInt(emp.salary).toLocaleString()}
                          </span>
                        </div>
                      ))}
                      {city.count > 5 && (
                        <div style={{ color: '#a0aec0', fontStyle: 'italic', fontSize: '0.85rem' }}>
                          ... and {city.count - 5} more
                        </div>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Stats Panel */}
        <div className="stats-container">
          <h3>📊 City Distribution</h3>
          <div className="stats-grid">
            {employeesByCity.map((city, index) => {
              const avgSalary = Math.round(
                city.employees.reduce((sum, emp) => sum + emp.salary, 0) / city.count / 1000
              );
              return (
                <div key={index} className="city-card">
                  <div className="city-header">
                    <span className="city-name">{city.name}</span>
                    <span className="city-count">{city.count}</span>
                  </div>
                  <div className="city-bar">
                    <div 
                      className="city-progress"
                      style={{ 
                        width: `${(city.count / employees.length) * 100}%` 
                      }}
                    />
                  </div>
                  <div className="city-salaries">
                    Avg: ₹{avgSalary}K
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="insights">
            <div className="insight">
              👥 <strong>Most Employees:</strong> {cityWithMostEmployees.name} 
              ({cityWithMostEmployees.count})
            </div>
            <div className="insight">
              💰 <strong>Highest Avg Salary:</strong> {highestAvgSalaryCity.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maps;


