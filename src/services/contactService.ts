// src/services/contactService.ts

type ContactSubmission = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const submitContactRequest = async (data: ContactSubmission): Promise<void> => {
  const response = await fetch(`${API_URL}/contact/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to submit contact request');
  }

  return await response.json();
};
