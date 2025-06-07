// src/services/BYOBService.ts
// Define BYOBSubmission type or import it from the correct module
type BYOBSubmission = object;

// Define or import your API_URL here
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const submitBYOBRequest = async (data: BYOBSubmission, token?: string): Promise<void> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/byob/submit`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to submit BYOB request');
  }

  return await response.json();
};
