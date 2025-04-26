import React, { useState } from 'react';
import axios from 'axios';

function Admin() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    location: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/opportunities', formData);
      alert('Opportunity created successfully!');
      setFormData({ title: '', description: '', duration: '', location: '' });
    } catch (error) {
      alert('Error creating opportunity. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Panel - Create Opportunity</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Opportunity Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            style={{ marginBottom: '10px', display: 'block' }}
          />
        </div>
        <div>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            style={{ marginBottom: '10px', display: 'block', width: '300px', height: '100px' }}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Duration (e.g., 3 months)"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            required
            style={{ marginBottom: '10px', display: 'block' }}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
            style={{ marginBottom: '10px', display: 'block' }}
          />
        </div>
        <button type="submit">Create Opportunity</button>
      </form>
    </div>
  );
}

export default Admin;