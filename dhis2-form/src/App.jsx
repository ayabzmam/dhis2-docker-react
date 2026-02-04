import React, { useState } from 'react';
import './App.css';
import api from './api';   // if you’re connecting to DHIS2

function App() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    symptoms: []
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e) => {
    const { value, checked } = e.target;
    let newSymptoms = [...formData.symptoms];
    if (checked) {
      newSymptoms.push(value);
    } else {
      newSymptoms = newSymptoms.filter(symptom => symptom !== value);
    }
    setFormData({ ...formData, symptoms: newSymptoms });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);

    // Example DHIS2 submission (replace IDs with real ones)
    const eventPayload = {
      program: "pVMWyrocWyE",
      orgUnit: "ov3xLsUS7j4",
      eventDate: new Date().toISOString().split('T')[0],
      dataValues: [
        { dataElement: "jIXQP9SlQcv", value: formData.name },
        { dataElement: "Phozt4nUaHh", value: formData.age },
        { dataElement: "gMGti20cdl7", value: formData.symptoms.join(",") }
      ]
    };



    try {
      await api.post('/events', eventPayload);
      alert('Data submitted to DHIS2!');
      setFormData({ name: '', age: '', symptoms: [] });
    } catch (err) {
      console.error('Error submitting to DHIS2:', err);
      alert('Submission failed');
    }
  };

  return (
    <div className="container">
      <h1>Basic Health Screening</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </div>

        <div>
          <label>Age</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} />
        </div>

        <div>
          <label>Symptoms</label>
          <div>
            <input type="checkbox" value="Headache" checked={formData.symptoms.includes("Headache")} onChange={handleCheckbox} /> Headache
          </div>
          <div>
            <input type="checkbox" value="Fever" checked={formData.symptoms.includes("Fever")} onChange={handleCheckbox} /> Fever
          </div>
          <div>
            <input type="checkbox" value="Cough" checked={formData.symptoms.includes("Cough")} onChange={handleCheckbox} /> Cough
          </div>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

// ✅ This line is required
export default App;