import { useState } from "react";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);

  const [resumeText, setResumeText] = useState("");
  const [skills, setSkills] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState([]);

  const [interviewStarted, setInterviewStarted] =
    useState(false);

  const questions = [
    "What is the difference between ArrayList and LinkedList in Java?",
    "Explain OOP concepts in Java.",
    "What is the difference between SQL and MySQL?",
    "Explain REST APIs.",
    "What is React and why is it used?",
  ];

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [interviewFinished, setInterviewFinished] =
    useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a resume!");
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
        "HTML",
        "CSS",
        "SQL",
        "MySQL",
        "Git",
        "GitHub",
        "REST API",
        "React",
        "Node.js",
        "C",
      ];

      const foundSkills = skillList.filter((skill) =>
        data.resume_text
          .toLowerCase()
          .includes(skill.toLowerCase())
      );

      setSkills(foundSkills);

      const calculatedScore = Math.min(
        foundSkills.length * 10,
        100
      );

      setScore(calculatedScore);

      if (calculatedScore >= 80) {
        setFeedback([
          "✅ Strong technical profile",
          "✅ Good skill coverage",
          "✅ Ready for technical interviews",
        ]);
      } else {
        setFeedback([
          "⚠️ Add more projects",
          "⚠️ Include certifications",
          "⚠️ Improve technical skill section",
        ]);
      }
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  const handleNextQuestion = () => {
    const updatedAnswers = [...answers, answer];

    setAnswers(updatedAnswers);
    setAnswer("");

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setInterviewFinished(true);
    }
  };

  return (
    <div className="container">
      <h1 className="title">
        🚀 AI-Assisted Technical Interview Companion
      </h1>

      <p className="subtitle">
        Smart Resume Analysis • Mock Interviews • AI
        Feedback
      </p>

      <div className="stats">
        <div className="stat-card">
          <h2>📄</h2>
          <p>Resume Analyzer</p>
        </div>

        <div className="stat-card">
          <h2>🎯</h2>
          <p>Mock Interview</p>
        </div>

        <div className="stat-card">
          <h2>🤖</h2>
          <p>AI Feedback</p>
        </div>
      </div>

      {!interviewStarted ? (
        <div className="dashboard">
          <div className="card">
            <h2>🎤 Mock Interview</h2>

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
            <h2>📄 Resume Analysis</h2>

            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
            />

            <br />
            <br />

            <button onClick={handleUpload}>
              Upload Resume
            </button>

            {resumeText && (
              <>
                <h3>📊 Resume Score</h3>

                <div className="score">
                  {score}/100
                </div>

                <h3>🛠 Skills Detected</h3>

                <div>
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="skill"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="card">
            <h2>🤖 AI Feedback</h2>

            {feedback.length > 0 ? (
              <ul style={{ textAlign: "left" }}>
                {feedback.map(
                  (item, index) => (
                    <li key={index}>
                      {item}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p>
                Upload a resume to get AI
                feedback.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="card">
          {!interviewFinished ? (
            <>
              <h2>🎯 Mock Interview Round</h2>

              <h3>
                Question {currentQuestion + 1}
              </h3>

              <p>
                {
                  questions[currentQuestion]
                }
              </p>

              <textarea
                rows="6"
                cols="60"
                placeholder="Type your answer here..."
                value={answer}
                onChange={(e) =>
                  setAnswer(
                    e.target.value
                  )
                }
              />

              <br />
              <br />

              <button
                onClick={
                  handleNextQuestion
                }
              >
                {currentQuestion ===
                  questions.length - 1
                  ? "Finish Interview"
                  : "Next Question"}
              </button>
            </>
          ) : (
            <>
              <h2>
                🎉 Interview Completed
              </h2>

              <p>
                You answered{" "}
                {answers.length} questions.
              </p>

              <button
                onClick={() => {
                  setInterviewStarted(
                    false
                  );
                  setInterviewFinished(
                    false
                  );
                  setCurrentQuestion(0);
                  setAnswers([]);
                }}
              >
                Back to Dashboard
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
