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
    const [successOpportunityId, setSuccessOpportunityId] = useState(null);

    useEffect(() => {
      fetchOpportunities();
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

      setSuccessOpportunityId(selectedOpportunity._id);
      setTimeout(() => setSuccessOpportunityId(null), 3000);
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
            <div className="min-h-screen bg-gray-600">
              <div className="max-w-3xl mx-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex-1 text-center">
                  <h1 className="text-3xl font-bold text-green-100">Volunteering Opportunities</h1>
                </div>
                <div className="flex gap-4">
                  <Link to="/login"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                    🛠 Go to Admin Panel
                  </Link>
                  <button
                    onClick={fetchOpportunities}
                    className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded"
                  >
                    🔄 Refresh Opportunities
                  </button>
                </div>
              </div>

              <ul className="space-y-6">
                {opportunities.map((opp) => (
                  <li key={opp._id} className="bg-white shadow-md rounded p-5">
                    <h2 className="text-xl font-semibold text-gray-800">{opp.title}</h2>
                    <p className="text-gray-700">{opp.description}</p>
                    <p className="text-sm text-gray-600"><strong>Duration:</strong> {opp.duration}</p>
                    <p className="text-sm text-gray-600"><strong>Place:</strong> {opp.location}</p>

                    {hasApplied(opp._id) ? (
                      <button
                      disabled className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed">
                      ✅ Already Applied
                        </button>
                    ) : (
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        onClick={() => setSelectedOpportunity(opp)}
                      >
                        Apply
                      </button>
                    )}

                    {successOpportunityId === opp._id && (
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

            
              {/* Footer */}
              <footer className="mt-12 bg-gray-200 text-blue-800 text-center text-sm py-6">
                <p>© {new Date().getFullYear()} Volunteering Opportunities</p>
                <p>
                  📞 <a href="tel:+255744123181" className="text-blue-600 hover:underline">+255 744 123 181</a> | 
                  📤 <a href="mailto:contact@volunteer.org" className="text-blue-600 hover:underline">contact@volunteer.org</a>
                </p>
                <div className="flex justify-center gap-4 mt-2">
                <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-pink-600"
                    >
                      <path d="M7.75 2C5.678 2 4 3.678 4 5.75v12.5C4 20.322 5.678 22 7.75 22h8.5C18.322 22 20 20.322 20 18.25V5.75C20 3.678 18.322 2 16.25 2h-8.5zM6 5.75A1.75 1.75 0 0 1 7.75 4h8.5A1.75 1.75 0 0 1 18 5.75v12.5A1.75 1.75 0 0 1 16.25 20h-8.5A1.75 1.75 0 0 1 6 18.25V5.75zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 1.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zm4.25-3.25a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5z" />
                    </svg>
                  </a>
                  <a
                    href="https://x.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-black"
                    >
                      <path d="M20.267 3H17.43l-3.264 4.93L10.22 3H3l7.003 10.276L3.5 21h2.837l3.424-5.174L13.782 21h7.218l-7.442-10.9L20.267 3zm-5.024 14.895-4.242-6.223.918-1.338 4.351 6.55-1.027.01z" />
                      </svg>
                  </a>
                </div>
              </footer>
              </div>
            </div>
          </motion.div>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  );
}

export default App;