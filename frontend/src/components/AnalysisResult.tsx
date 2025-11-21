import React from "react";

interface Props {
  similarity?: number;
  feedback?: string;
}

const AnalysisResult: React.FC<Props> = ({ similarity, feedback }) => {
  if (!feedback) return null;

  return (
    <div className="card">
      <h2>Analysis Result</h2>
      {similarity !== undefined && (
        <p>
          <strong>Similarity score:</strong> {similarity.toFixed(3)}
        </p>
      )}
      <pre className="feedback">{feedback}</pre>
    </div>
  );
};

export default AnalysisResult;
