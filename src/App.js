import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Admin from './Admin'; // Add this line

function App() {
    const [showAdmin, setShowAdmin] = useState(false);
    const [opportunities, setOpportunities] = useState([]);
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);
    const [formData, setFormData] = useState({ applicantName: '', applicantEmail: '' });
    const [appliedOpportunities, setAppliedOpportunities] = useState([]);

  useEffect(() => {
    fetchOpportunities();
    loadAppliedOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    const res = await axios.get('https://volunteering-app.onrender.com');
    setOpportunities(res.data);
  };

  const loadAppliedOpportunities = () => {
    const applied = JSON.parse(localStorage.getItem('appliedOpportunities')) || [];
    setAppliedOpportunities(applied);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/apply', {
        ...formData,
        opportunityId: selectedOpportunity._id,
      });

      alert('Application submitted successfully!');
      setSelectedOpportunity(null);
      setFormData({ applicantName: '', applicantEmail: '' });

      // Save this opportunity ID as applied
      const updatedApplied = [...appliedOpportunities, selectedOpportunity._id];
      setAppliedOpportunities(updatedApplied);
      localStorage.setItem('appliedOpportunities', JSON.stringify(updatedApplied));
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        alert('Something went wrong. Please try again.');
      }
    }
  };

  const hasApplied = (opportunityId) => {
    return appliedOpportunities.includes(opportunityId);
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* NEW BUTTON to switch between Admin and Public */}
      <button onClick={() => setShowAdmin(!showAdmin)} style={{ marginBottom: '20px' }}>
        {showAdmin ? '🔙 Back to Opportunities' : '🛠 Go to Admin Panel'}
      </button>
  
      {/* If Admin is ON, show Admin Page */}
      {showAdmin ? (
        <Admin />
      ) : (
        <>
          {/* Public view — existing content */}
          <h1>Volunteering Opportunities</h1>
          <button onClick={fetchOpportunities} style={{ marginBottom: '20px' }}>
            🔄 Refresh Opportunities
          </button>
  
          <ul>
            {opportunities.map((opp) => (
              <li key={opp._id} style={{ marginBottom: '20px' }}>
                <h2>{opp.title}</h2>
                <p>{opp.description}</p>
                <p><strong>Duration:</strong> {opp.duration}</p>
                <p><strong>Location:</strong> {opp.location}</p>
  
                {hasApplied(opp._id) ? (
                  <button disabled style={{ backgroundColor: '#ccc', cursor: 'not-allowed' }}>
                    ✅ Already Applied
                  </button>
                ) : (
                  <button onClick={() => setSelectedOpportunity(opp)}>
                    Apply
                  </button>
                )}
              </li>
            ))}
          </ul>
  
          {selectedOpportunity && (
            <div style={{ marginTop: '30px' }}>
              <h2>Apply for {selectedOpportunity.title}</h2>
              <form onSubmit={handleApply}>
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.applicantName}
                    onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={formData.applicantEmail}
                    onChange={(e) => setFormData({ ...formData, applicantEmail: e.target.value })}
                    required
                  />
                </div>
                <button type="submit">Submit Application</button>
                <button type="button" onClick={() => setSelectedOpportunity(null)}>Cancel</button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;