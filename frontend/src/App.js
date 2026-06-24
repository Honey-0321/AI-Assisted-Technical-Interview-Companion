import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [resumeText, setResumeText] = useState("");
  const [skills, setSkills] = useState([]);
  const [resumeScore, setResumeScore] = useState(0);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/")
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a resume first!");
      return;
    }

    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/upload_resume",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      setResumeText(data.resume_text);

      const skillList = [
        "Java",
        "Python",
        "JavaScript",
        "React",
        "HTML",
        "CSS",
        "SQL",
        "MySQL",
        "Git",
        "GitHub",
        "Node.js",
        "Django",
        "REST API",
        "C",
        "C++",
      ];

      const foundSkills = skillList.filter((skill) =>
        data.resume_text.toLowerCase().includes(skill.toLowerCase())
      );

      setSkills(foundSkills);

      let score = 40;

      score += foundSkills.length * 5;

      if (data.resume_text.includes("Internship"))
        score += 10;

      if (data.resume_text.includes("Project"))
        score += 10;

      if (data.resume_text.includes("Certification"))
        score += 10;

      if (score > 100) score = 100;

      setResumeScore(score);

      const tips = [];

      if (!data.resume_text.includes("Project")) {
        tips.push("Add Projects section.");
      }

      if (!data.resume_text.includes("Certification")) {
        tips.push("Add Certifications.");
      }

      if (foundSkills.length < 5) {
        tips.push("Add more technical skills.");
      }

      if (
        data.resume_text.includes("Project") &&
        data.resume_text.includes("Certification")
      ) {
        tips.push("Resume looks strong.");
      }

      setFeedback(tips);

      alert("Resume uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Upload failed!");
    }
  };

  return (
    <div className="container">
      <h1>🎯 AI-Assisted Technical Interview Companion</h1>

      <h2>{message}</h2>

      {!interviewStarted ? (
        <>
          <div className="card">
            <h2>Mock Interview</h2>

            <p>
              Practice technical interviews with AI.
            </p>

            <button
              onClick={() =>
                setInterviewStarted(true)
              }
            >
              Start Interview
            </button>
          </div>

          <div className="card">
            <h2>Resume Analysis</h2>

            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
            />

            {selectedFile && (
              <p>
                <strong>Selected File:</strong>{" "}
                {selectedFile.name}
              </p>
            )}

            <button onClick={handleUpload}>
              Upload Resume
            </button>

            <p>
              Upload your resume and get feedback.
            </p>
          </div>

          {resumeText && (
            <div className="card">
              <h2>📄 Resume Text</h2>

              <textarea
                rows="12"
                cols="80"
                value={resumeText}
                readOnly
              />

              <h2>🛠 Skills Detected</h2>

              {skills.length > 0 ? (
                <ul>
                  {skills.map((skill, index) => (
                    <li key={index}>
                      {skill}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No skills detected.</p>
              )}

              <h2>📊 Resume Score</h2>

              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "green",
                }}
              >
                {resumeScore}/100
              </div>

              <h2>🤖 AI Feedback</h2>

              <ul
                style={{
                  textAlign: "left",
                  maxWidth: "500px",
                  margin: "auto",
                }}
              >
                {feedback.map((item, index) => (
                  <li key={index}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="card">
            <h2>Interview Feedback</h2>

            <p>
              Get strengths and improvement areas.
            </p>
          </div>
        </>
      ) : (
        <div className="card">
          <h2>Mock Interview Round</h2>

          <h3>Question 1</h3>
          <p>
            What is the difference between
            ArrayList and LinkedList in Java?
          </p>

          <h3>Question 2</h3>
          <p>
            Explain OOP concepts in Java.
          </p>

          <h3>Question 3</h3>
          <p>
            What is the difference between
            SQL and MySQL?
          </p>

          <h3>Question 4</h3>
          <p>
            Explain REST APIs.
          </p>

          <h3>Question 5</h3>
          <p>
            What is React and why is it used?
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
