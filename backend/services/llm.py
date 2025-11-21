from typing import List


class LLMClient:
    """
    Replace the `generate` method with a real LLM call.
    For demo, it just echoes with some structure.
    """

    def generate(self, prompt: str) -> str:
        # TODO: Wire in real LLM (OpenAI, etc.)
        return (
            "This is a stubbed LLM response.\n\n"
            "In a real setup, this would be a detailed recruiter-style "
            "analysis of the resume against the job description."
        )

    def generate_structured_feedback(
        self, context_chunks: List[str], job_description: str
    ) -> str:
        prompt = f"""
You are an expert technical recruiter.

You are given:
1. Resume content (context).
2. A job description.

Task:
- Summarize candidate profile.
- Match skills vs job description.
- Highlight strengths.
- Highlight missing or weak areas.
- Give an overall score out of 10.

Job description:
{job_description}

Resume context:
{"\n\n---\n\n".join(context_chunks)}

Respond in clear sections with headings.
"""
        return self.generate(prompt)
