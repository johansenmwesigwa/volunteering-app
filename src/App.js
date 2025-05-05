import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Admin from './Admin';
import AdminLogin from './AdminLogin';
import { motion } from 'framer-motion';
import { Routes, Route, Navigate, Link } from 'react-router-dom'; // ✅ No BrowserRouter here


function App() {
    const [opportunities, setOpportunities] = useState([]);
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);
    const [formData, setFormData] = useState({ applicantName: '', applicantEmail: '' });
    const [appliedOpportunities, setAppliedOpportunities] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
      fetch('/api/opportunities')
        .then(response => response.json())
        .then(data => {
          console.log(data); // 👈 Check what comes back
          setOpportunities(data);
        })
        .catch(error => console.error('Error fetching opportunities:', error));
    }, []);

    const fetchOpportunities = async () => {
      try {
        console.log('Fetching opportunities...');
        console.log('Backend URL:', 'http://localhost:4000/api/opportunities');
    
        // Fetch opportunities from the backend
        // Make sure your backend is running and accessible at this URL
        const res = await axios.get('http://localhost:4000/api/opportunities');
        console.log('Fetched data:', res.data);
    
        setOpportunities(res.data);
      } catch (error) {
        console.error('Error fetching opportunities:', error.message);
        alert('Failed to load opportunities. Please try again later.');
      }
    };

  const loadAppliedOpportunities = () => {
    const applied = JSON.parse(localStorage.getItem('appliedOpportunities')) || [];
    setAppliedOpportunities(applied);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/apply', {
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

      setShowSuccess(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
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
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <div className="min-h-screen bg-gray-100">
              <div className="max-w-3xl mx-auto p-6">
              <h1 className="text-3xl font-bold text-blue-600 mb-4">Volunteering Opportunities</h1>
              <div className="flex gap-4 mb-6">
                <Link to="/login"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
                  🛠 Go to Admin Panel
                </Link>
                <button
                  onClick={fetchOpportunities}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                >
                  🔄 Refresh Opportunities
                </button>
              </div>

              <ul className="space-y-6">
                {opportunities.map((opp) => (
                  <li key={opp._id} className="bg-white shadow-md rounded p-5">
                    <h2 className="text-xl font-semibold text-gray-800">{opp.title}</h2>
                    <p className="text-gray-700">{opp.description}</p>
                    <p className="text-sm text-gray-600"><strong>Duration:</strong> {opp.duration}</p>
                    <p className="text-sm text-gray-600"><strong>Location:</strong> {opp.location}</p>

                    {hasApplied(opp._id) ? (
                      <button
                      disabled className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed">
                      ✅ Already Applied
                        </button>
                    ) : (
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                        onClick={() => setSelectedOpportunity(opp)}
                      >
                        Apply
                      </button>
                    )}

                    {selectedOpportunity && selectedOpportunity._id === opp._id && (
                      <div style={{ marginTop: '30px' }}>
                        <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Apply for {selectedOpportunity.title}</h2>
                        <motion.form
                          onSubmit={handleApply}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="mb-4">
                            <input
                              type="text"
                              placeholder="Your Name"
                              value={formData.applicantName}
                              onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                              required
                            />
                          </div>
                          <div className='mb-4'>
                            <input
                              type="email"
                              placeholder="Your Email"
                              value={formData.applicantEmail}
                              onChange={(e) => setFormData({ ...formData, applicantEmail: e.target.value })}
                              className='w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400'
                              required
                            />
                          </div>
                          <div className='mb-4'>
                            <input
                              type="phone"
                              placeholder="Your Phone Number"
                              value={formData.applicantPhone}
                              onChange={(e) => setFormData({ ...formData, applicantPhone: e.target.value })}
                              className='w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400'
                              required
                            />
                          </div>
                          <div className="mb-4">
                            <input
                              type="text"
                              placeholder="Why interested in this opportunity?"
                              value={formData.applicantInterest}
                              onChange={(e) => setFormData({ ...formData, applicantInterest: e.target.value })}
                              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                              required
                            />
                          </div>
                          <div className="flex gap-3">
                            <button
                              type="submit"
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            >
                              Submit Application
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedOpportunity(null)}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </motion.form>
                      </div>
                    )}
                  </li>
                ))}
              </ul>

              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: -20 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="mt-4 p-4 bg-green-100 text-green-800 rounded shadow-md text-center"
                >
                  🎉 Application submitted successfully!
                </motion.div>
              )}
              </div>
            </div>
          </motion.div>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  );
}

export default App;