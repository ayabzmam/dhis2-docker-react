
navigate project....cd C:\Users\DELL\dhis2-form
run app....npm run dev
Local: http://localhost:5173/




⚙️ Prerequisites
Node.js  (v16+ recommended)

npm or yarn

A running DHIS2 instance (e.g., http://localhost:8080/)

A DHIS2 event program created in the Maintenance app

Program ID

Org Unit ID (assigned to the program)

Data Element IDs (linked to the program stage)

🚀 Setup
Clone the project

bash
git clone <your-repo-url>
cd <project-folder>
Install dependencies

bash
npm install
Configure API connection

Create src/api.js:

javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  auth: {
    username: 'admin',   // replace with your DHIS2 username
    password: 'district' // replace with your DHIS2 password
  }
});

export default api;
📝 App Code (src/App.jsx)
javascript
import React, { useState } from 'react';
import './App.css';
import api from './api';

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

    const eventPayload = {
      program: "pVMWyrocWyE",        // replace with your program ID
      orgUnit: "ov3xLsUS7j4",        // replace with your org unit ID
      eventDate: new Date().toISOString().split('T')[0],
      dataValues: [
        { dataElement: "jIXQP9SlQcv", value: formData.name },   // Name
        { dataElement: "Phozt4nUaHh", value: formData.age },    // Age
        { dataElement: "deHeadache", value: formData.symptoms.includes("Headache") ? "true" : "false" },
        { dataElement: "deFever", value: formData.symptoms.includes("Fever") ? "true" : "false" },
        { dataElement: "deCough", value: formData.symptoms.includes("Cough") ? "true" : "false" }
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

export default App;
▶️ Running the App
Start the dev server:

bash
npm start        # for Create React App
npm run dev      # for Vite
Open the app in your browser:

Code
http://localhost:5173/
Fill in the form and submit.

If successful, you’ll see “Data submitted to DHIS2!”

The event will be stored in DHIS2.

📊 Viewing Data in DHIS2
Since this is an event program, your data will appear in:

Event Capture app → list of submitted events.

Event Reports app → tabular reports of events.

Event Visualizer app → charts/graphs from event data.

API check:

Code
http://localhost:8080/api/events?program=pVMWyrocWyE&orgUnit=ov3xLsUS7j4
⚠️ Notes
Replace all placeholder IDs (pVMWyrocWyE, ov3xLsUS7j4, jIXQP9SlQcv, etc.) with real IDs from your DHIS2 program stage.

Each symptom must be a separate boolean data element in DHIS2.

If you want a single symptom field, use an option set (but that only allows one symptom per event).

✅ Summary
This README covers:

Setting up the React app

Connecting to DHIS2 via Axios

Handling multiple checkboxes correctly

Running the app after restarting Node

Viewing stored data in DHIS2