import axios from "axios";

const API_BASE = "http://localhost:8000";

export async function uploadResume(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(`${API_BASE}/api/resumes/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data; // { resume_id, preview }
}

export async function analyzeResume(resumeId: string, jobDescription: string) {
  const res = await axios.post(`${API_BASE}/api/resumes/analyze`, {
    resume_id: resumeId,
    job_description: jobDescription,
  });
  return res.data;
}
