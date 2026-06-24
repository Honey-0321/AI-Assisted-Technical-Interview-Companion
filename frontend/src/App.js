import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/")
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
      });
  }, []);

  return (
    <div className="container">
      <h1>🎯 AI-Assisted Technical Interview Companion</h1>
      <h3>{message}</h3>

      <div className="card">
        <h2>Mock Interview</h2>
        <p>Practice technical interviews with AI.</p>
      </div>

      <div className="card">
        <h2>Resume Analysis</h2>
        <p>Upload your resume and get feedback.</p>
      </div>

      <div className="card">
        <h2>Interview Feedback</h2>
        <p>Get strengths and improvement areas.</p>
      </div>
    </div>
  );
}

export default App;
