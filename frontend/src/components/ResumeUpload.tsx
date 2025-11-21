import React, { useState } from "react";

interface Props {
  onUploaded: (resumeId: string, preview: string) => void;
}

const ResumeUpload: React.FC<Props> = ({ onUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file");
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const resp = await (await import("../api")).uploadResume(file);
      onUploaded(resp.resume_id, resp.preview);
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card">
      <h2>Upload Résumé (PDF)</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ResumeUpload;
