// src/api/questions.js
import { API_BASE } from "../config";

// Anonymous user asks a question
export async function askQuestion(adId, text) {
  const res = await fetch(`${API_BASE}/api/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      text: text,
      ad: adId
     }),
  });

  if (!res.ok) throw new Error("Failed to send question");
  return res.json();
}

// Get all questions for an ad (public)
export async function getQuestions(adId) {
  const res = await fetch(`${API_BASE}/api/questions/ad/${adId}`);

  if (!res.ok) throw new Error("Failed to load questions");

  return res.json();
}

// Owner answers a question
export async function answerQuestion(questionId, answer, token) {

  const res = await fetch(`${API_BASE}/api/questions/${questionId}/answer`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ answer }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.log(errorData.message || `Server error: ${res.status}`)
    throw new Error("Failed answering question");
  } 
  return res.json();
}
