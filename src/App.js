import './App.css';
import React, {useState} from 'react';

function App() {
  const [screenShot, setScreenShot] = useState(null);
  const [icsData, setIcsData] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    console.log("File change:", e.target.files[0]);
    if (e.target.files && e.target.files[0]) {
      setScreenShot(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!screenShot) {
      setError('Please select a screenshot');
      return;
    }

    console.log("File submit");

    setError('');
    setLoading(true);
    console.log("File submit");

    const formData = new FormData();
    formData.append('file', screenShot);

    try {
      const response = await fetch('https://the-scheduler.onrender.com/upload', {
        method: 'POST',
        body: formData
      });

      console.log("Response: ", response);

      if (!response.ok) {
        throw new Error('Server Error: ${response.statusText}');
      }

      const data=await response.text();
      setIcsData(data);
    }
    catch (error) {
      setError(error.message);
    }
    finally {
      setLoading(false);
    }

  };

  return (
    <div style={{ padding: '2rem'}}>
      <h1>Upload Screenshot for ICS Conversion</h1>
      <div>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </div>

      {error && <p style={{ color: 'red'}}>Error: {error}</p>}

      {icsData && (
        <div style={{marginTop: '2rem'}}>
          <h2>ICS Data</h2>
          <textarea
            value={icsData}
            readOnly
            rows={10}
            style={{width: '100%'}}
          />
          <a
            href={'data:text/calender;charset=utf-8,${encdoeURIComponent(icsData)}'}
            download="calender.ics"
            >
              Download ICS File
            </a>
    </div>
      )}
    </div>
  );
}

export default App;
