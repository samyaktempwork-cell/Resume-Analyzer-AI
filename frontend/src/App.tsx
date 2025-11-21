import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [preview, setPreview] = useState("");
  const [feedback, setFeedback] = useState("");
  const [similarity, setSimilarity] = useState("");
  const [loading, setLoading] = useState(false);

  // ------------------ HANDLERS ------------------ //

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setError("");

      const res = await axios.post("http://localhost:8000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPreview(res.data.text || "");
    } catch (err) {
      setError("Upload failed. Check backend.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!jobDescription) {
      setError("Please enter job description.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post("http://localhost:8000/analyze", {
        job_description: jobDescription,
      });

      setSimilarity(res.data.similarity || "");
      setFeedback(res.data.feedback || "");
    } catch (err) {
      setError("Analyze failed. Check backend.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ------------------ UI ------------------ //

  return (
    <div className="app">
      <h1>Resume Analyzer AI</h1>
      <p className="subtitle">
        Upload a résumé PDF and compare it against a job description using RAG + LLM.
      </p>

      <div className="card">
        <h2>Upload Résumé (PDF)</h2>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
        {error && <p className="error">{error}</p>}
      </div>

      <div className="card">
        <h2>Job Description</h2>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
        />
        <button onClick={handleAnalyze} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </div>

      {similarity && (
        <div className="card">
          <h3>Match Score</h3>
          <div className="preview">{similarity}</div>
        </div>
      )}

      {feedback && (
        <div className="card">
          <h3>Feedback</h3>
          <div className="feedback">{feedback}</div>
        </div>
      )}

      {preview && (
        <div className="card">
          <h3>Extracted Résumé Preview</h3>
          <pre className="preview">{preview}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
