# dhis2-docker-react
This project is a combination of dhis2 on docker and react app 
# DHIS2 Local Instance + React Integration for Event Data Capture

## Abstract
This repository demonstrates the integration of a local **DHIS2 instance** (running via Docker) with a standalone **React application**. The React app dynamically retrieves program configuration from DHIS2 using its REST API, renders a data entry form, and submits event data directly into DHIS2. The workflow is designed to be reproducible, transparent, and scientifically rigorous.

---

## 1. Prerequisites

- **Operating System**: Windows
- **Docker & Docker Compose**: Required for DHIS2 deployment
- **Node.js (v16+) & npm**: Required for React development
- **Git**: For version control and repository management

Verify installations:
```bash
docker --version
docker-compose --version
node -v
npm -v
git --version

-------

## 2. DHIS2 Setup with Docker
    2.1 Create Project Folder

mkdir dhis2-un
cd dhis2-un

## 2.2 Define Docker Compose File
Create docker-compose.yml:
"
version: '3.8'

services:
  db:
    image: postgis/postgis:13-3.3   
    container_name: dhis2-db-un
    environment:
      POSTGRES_DB: un
      POSTGRES_USER: dhis
      POSTGRES_PASSWORD: dhis
    volumes:
      - dhis2_db_data:/var/lib/postgresql/data
    ports:
      - "5435:5432"   # host 5435 → container 5432

  dhis2:
    image: dhis2/core:2.40.0.1
    container_name: dhis2-un
    depends_on:
      - db
    environment:
      DHIS2_HOME: /opt/dhis2
      DB_HOST: db
      DB_PORT: 5432
      DB_NAME: un
      DB_USER: dhis
      DB_PASSWORD: dhis
    ports:
      - "8080:8080"
    volumes:
      - ./dhis.conf:/opt/dhis2/dhis.conf
      - dhis2_home:/opt/dhis2

volumes:
  dhis2_db_data:
  dhis2_home:
"

## 2.3 Configure DHIS2

Create dhis.conf:
"
# Database connection settings
connection.url = jdbc:postgresql://db:5432/un
connection.username = dhis
connection.password = dhis

# Optional: Hibernate dialect (recommended for PostgreSQL 13+)
hibernate.dialect = org.hibernate.dialect.PostgreSQLDialect


## 2.4 Launch DHIS2
docker-compose up -d

## 2.5 Access DHIS2 at:
👉 http://localhost:8080
Login:
usernam: admin
password: district

--------------

## 3. Configure Event Program in DHIS2
Navigate to Apps → Maintenance.

Create a new Event Program:

Name: Individual Health Info

Type: Event Program

Add a Program Stage: Basic Info.

Define Data Elements:

Name → Value type: Text

Age → Value type: Number

Symptom → Value type: Text with option set of 
Headache, Fever and Cough 

Assign the program to an Org Unit.

----------------

## 4. React Application Development

4.1 Initialize Project
npm create vite@latest dhis2-form --template react
cd dhis2-form
npm install axios

4.2 API Configuration (src/api.js)

"
import axios from "axios";

const BASE_URL = "http://localhost:8080/api";
const AUTH = "Basic " + btoa("admin:district");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: AUTH,
    "Content-Type": "application/json"
  }
});

export default api;
"

## 4.3 Application Logic (src/App.jsx)
"
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

// This line is required
export default App;
"

## 4.4 Application CSS (src/App.css)
"
/* App.css */

body {
  font-family: Arial, sans-serif;
  background: #f4f6f9;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 500px;
  margin: 50px auto;
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

h1 {
  text-align: center;
  color: #333;
}

form div {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #444;
}

input[type="text"],
input[type="number"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  transition: border-color 0.3s;
}

input[type="text"]:focus,
input[type="number"]:focus {
  border-color: #007bff;
  outline: none;
}

input[type="checkbox"] {
  margin-right: 8px;
}

button {
  width: 100%;
  padding: 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #0056b3;
}

"

-------------

## 5. Running the Application
5.1 Start React Dev Server
npm run dev

5.2 Access at:
👉 http://localhost:5173

5.3 Workflow
Fill out the form (Name, Age, Symptoms).

Submit.

Verify submission in DHIS2 →  Capture app.
