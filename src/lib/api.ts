import { AIExtractedMedicine } from '../types';

export async function extractPrescription(
  imageBase64: string,
  mimeType: string,
  language: 'en' | 'bn'
): Promise<{ medicines: AIExtractedMedicine[] }> {
  const response = await fetch('/api/extract', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageBase64, mimeType, language }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to extract prescription');
  }

  return response.json();
}
